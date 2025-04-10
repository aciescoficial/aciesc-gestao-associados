import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, FileSpreadsheet, Check, X, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { exportEmpresas, importEmpresas } from './empresaService';
import { Database } from '@/integrations/supabase/types';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

interface ImportField {
  fieldName: string;
  targetField: string;
  isRequired: boolean;
}

interface ImportValidationData {
  fieldName: string;
  targetField: string;
  isValid: boolean;
}

interface ImportEmpresaData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  nicho: NichoType;
  desconto: string;
  produtos: string;
  logo_url?: string;
  capa_url?: string;
  video_url?: string;
  status: StatusType;
}

const importFields: ImportField[] = [
  { fieldName: 'Razão Social', targetField: 'razaoSocial', isRequired: true },
  { fieldName: 'Nome Fantasia', targetField: 'nomeFantasia', isRequired: true },
  { fieldName: 'CNPJ', targetField: 'cnpj', isRequired: true },
  { fieldName: 'Responsável', targetField: 'responsavel', isRequired: true },
  { fieldName: 'Telefone', targetField: 'telefone', isRequired: true },
  { fieldName: 'E-mail', targetField: 'email', isRequired: true },
  { fieldName: 'Endereço', targetField: 'endereco', isRequired: true },
  { fieldName: 'Cidade', targetField: 'cidade', isRequired: true },
  { fieldName: 'CEP', targetField: 'cep', isRequired: true },
  { fieldName: 'Site', targetField: 'site', isRequired: false },
  { fieldName: 'Instagram', targetField: 'instagram', isRequired: false },
  { fieldName: 'WhatsApp', targetField: 'whatsapp', isRequired: false },
  { fieldName: 'Nicho', targetField: 'nicho', isRequired: true },
  { fieldName: 'Desconto', targetField: 'desconto', isRequired: true },
  { fieldName: 'Produtos', targetField: 'produtos', isRequired: true },
  { fieldName: 'Logo URL', targetField: 'logo_url', isRequired: false },
  { fieldName: 'Capa URL', targetField: 'capa_url', isRequired: false },
  { fieldName: 'Vídeo URL', targetField: 'video_url', isRequired: false },
];

const isValidNichoType = (value: any): value is NichoType => {
  return [
    'Alimentação',
    'Saúde',
    'Educação',
    'Serviços',
    'Comércio',
    'Lazer',
    'Tecnologia',
    'Outro',
  ].includes(value);
};

const isValidStatusType = (value: any): value is StatusType => {
  return ['ativo', 'pendente', 'inativo'].includes(value);
};

const ImportMappingStep: React.FC<{
  headers: string[];
  importFields: ImportField[];
  fieldMapping: Record<string, string>;
  setFieldMapping: (mapping: Record<string, string>) => void;
  onNext: () => void;
}> = ({ headers, importFields, fieldMapping, setFieldMapping, onNext }) => {
  const handleFieldMappingChange = (header: string, targetField: string) => {
    setFieldMapping({ ...fieldMapping, [header]: targetField });
  };

  return (
    <div className="space-y-4">
      <p>Mapeie as colunas do arquivo CSV para os campos correspondentes:</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coluna no Arquivo</TableHead>
            <TableHead>Campo Correspondente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {headers.map((header) => (
            <TableRow key={header}>
              <TableCell>{header}</TableCell>
              <TableCell>
                <select
                  className="border rounded px-2 py-1"
                  value={fieldMapping[header] || ''}
                  onChange={(e) => handleFieldMappingChange(header, e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {importFields.map((field) => (
                    <option key={field.targetField} value={field.targetField}>
                      {field.fieldName}
                    </option>
                  ))}
                </select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <Button onClick={onNext}>Próximo</Button>
      </div>
    </div>
  );
};

const ImportValidationStep: React.FC<{
  importData: any[];
  importFields: ImportField[];
  fieldMapping: Record<string, string>;
  setValidationData: (data: ImportValidationData[]) => void;
  onNext: () => void;
}> = ({ importData, importFields, fieldMapping, setValidationData, onNext }) => {
  const [isChecking, setIsChecking] = useState(false);

  const validateData = () => {
    setIsChecking(true);
    const validationResults: ImportValidationData[] = [];

    importData.forEach((item) => {
      importFields.forEach((field) => {
        const header = Object.keys(fieldMapping).find(
          (key) => fieldMapping[key] === field.targetField
        );
        const value = header ? item[header] : undefined;
        const isValid = value !== undefined && value !== null && value !== '';

        validationResults.push({
          fieldName: header || field.fieldName,
          targetField: field.targetField,
          isValid: field.isRequired ? isValid : true,
        });
      });
    });

    setValidationData(validationResults);
    setIsChecking(false);
    onNext();
  };

  return (
    <div className="space-y-4">
      <p>Validando os dados importados. Verifique se todos os campos obrigatórios estão preenchidos.</p>
      <div className="flex justify-end">
        <Button onClick={validateData} disabled={isChecking}>
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Validando...
            </>
          ) : (
            'Validar Dados'
          )}
        </Button>
      </div>
    </div>
  );
};

const ImportConfirmationStep: React.FC<{
  importData: any[];
  fieldMapping: Record<string, string>;
  validationData: ImportValidationData[];
  onImport: (data: ImportEmpresaData[]) => Promise<void>;
  onCancel: () => void;
}> = ({ importData, fieldMapping, validationData, onImport, onCancel }) => {
  const [isImporting, setIsImporting] = useState(false);

  const getValidationStatus = (targetField: string) => {
    const results = validationData.filter((item) => item.targetField === targetField);
    return results.every((result) => result.isValid);
  };

  const transformData = (): ImportEmpresaData[] => {
    return importData.map((item) => {
      const razaoSocial = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'razaoSocial') || ''] || '';
      const nomeFantasia = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'nomeFantasia') || ''] || '';
      const cnpj = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'cnpj') || ''] || '';
      const responsavel = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'responsavel') || ''] || '';
      const telefone = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'telefone') || ''] || '';
      const email = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'email') || ''] || '';
      const endereco = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'endereco') || ''] || '';
      const cidade = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'cidade') || ''] || '';
      const cep = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'cep') || ''] || '';
      const site = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'site') || ''] || undefined;
      const instagram = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'instagram') || ''] || undefined;
      const whatsapp = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'whatsapp') || ''] || undefined;
      
      let nichoValue = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'nicho') || ''] || '';
      const nicho = isValidNichoType(nichoValue) ? nichoValue : 'Outro';
      
      const desconto = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'desconto') || ''] || '';
      const produtos = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'produtos') || ''] || '';
      const logo_url = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'logo_url') || ''] || undefined;
      const capa_url = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'capa_url') || ''] || undefined;
      const video_url = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'video_url') || ''] || undefined;

      let statusValue = item[Object.keys(fieldMapping).find((key) => fieldMapping[key] === 'status') || ''] || 'pendente';
      const status = isValidStatusType(statusValue) ? statusValue : 'pendente';

      return {
        razaoSocial,
        nomeFantasia,
        cnpj,
        responsavel,
        telefone,
        email,
        endereco,
        cidade,
        cep,
        site,
        instagram,
        whatsapp,
        nicho,
        desconto,
        produtos,
        logo_url,
        capa_url,
        video_url,
        status
      };
    });
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const transformedData = transformData();
      await onImport(transformedData);
    } catch (error) {
      console.error('Error during import:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const allValid = importFields.every((field) => getValidationStatus(field.targetField));

  return (
    <div className="space-y-4">
      <p>
        Confirme os dados abaixo antes de importar. Certifique-se de que todos os campos obrigatórios estão
        validados.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campo</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {importFields.map((field) => (
            <TableRow key={field.targetField}>
              <TableCell>{field.fieldName}</TableCell>
              <TableCell>
                {getValidationStatus(field.targetField) ? (
                  <Badge variant="outline">
                    <Check className="h-4 w-4 mr-2" />
                    Validado
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="h-4 w-4 mr-2" />
                    Inválido
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleImport} disabled={!allValid || isImporting}>
          {isImporting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Importando...
            </>
          ) : (
            'Importar'
          )}
        </Button>
      </div>
    </div>
  );
};

const ImportExportEmpresas: React.FC = () => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [validationData, setValidationData] = useState<ImportValidationData[]>([]);
  const [hasHeaders, setHasHeaders] = useState(true);
  const [step, setStep] = useState<'upload' | 'mapping' | 'validation' | 'confirmation'>('upload');
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: hasHeaders,
        skipEmptyLines: true,
        complete: (results) => {
          setImportData(results.data);
          setStep('mapping');
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Erro ao ler o arquivo",
            description: "Ocorreu um erro ao processar o arquivo CSV. Verifique o formato e tente novamente.",
            variant: "destructive"
          });
        },
      });
    }
  };

  const handleToggleHeaders = () => {
    setHasHeaders(!hasHeaders);
  };

  const handleNextStep = () => {
    switch (step) {
      case 'upload':
        if (importData.length > 0) setStep('mapping');
        break;
      case 'mapping':
        setStep('validation');
        break;
      case 'validation':
        setStep('confirmation');
        break;
      default:
        break;
    }
  };

  const handleBackToMapping = () => {
    setStep('mapping');
  };

  const handleStartImport = async (data: ImportEmpresaData[]) => {
    try {
      setIsProcessing(true);
      await importEmpresas(data);
      toast({
        title: "Importação concluída",
        description: `${data.length} empresas foram importadas com sucesso.`,
      });
      setIsImportOpen(false);
      setStep('upload');
      setImportData([]);
      setValidationData([]);
      setFieldMapping({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing empresas:', error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelImport = () => {
    setIsImportOpen(false);
    setStep('upload');
    setImportData([]);
    setValidationData([]);
    setFieldMapping({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const headers = importFields.map(field => field.fieldName);
    const csv = Papa.unparse([headers]);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'empresas_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    try {
      setIsProcessing(true);
      const data = await exportEmpresas();
      
      if (!data || data.length === 0) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não existem empresas cadastradas para exportar.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      
      interface EmpresaExport {
        razao_social: string;
        nome_fantasia: string;
        cnpj: string;
        responsavel: string;
        telefone: string;
        email: string;
        endereco: string;
        cidade: string;
        cep: string;
        site: string | null;
        instagram: string | null;
        whatsapp: string | null;
        nicho: NichoType;
        desconto: string;
        produtos: string;
        logo_url: string | null;
        capa_url: string | null;
        video_url: string | null;
        status: StatusType;
      }
      
      const exportData = (data as EmpresaExport[]).map(empresa => ({
        razaoSocial: empresa.razao_social,
        nomeFantasia: empresa.nome_fantasia,
        cnpj: empresa.cnpj,
        responsavel: empresa.responsavel,
        telefone: empresa.telefone,
        email: empresa.email,
        endereco: empresa.endereco,
        cidade: empresa.cidade,
        cep: empresa.cep,
        site: empresa.site || '',
        instagram: empresa.instagram || '',
        whatsapp: empresa.whatsapp || '',
        nicho: empresa.nicho,
        desconto: empresa.desconto,
        produtos: empresa.produtos,
        logo_url: empresa.logo_url || '',
        capa_url: empresa.capa_url || '',
        video_url: empresa.video_url || '',
        status: empresa.status
      }));
      
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `empresas_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: `${exportData.length} empresas foram exportadas com sucesso.`,
      });
    } catch (error) {
      console.error('Error exporting empresas:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleDownloadTemplate}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Baixar Template
        </Button>
        <Button onClick={() => setIsImportOpen(true)} disabled={isProcessing}>
          <Upload className="h-4 w-4 mr-2" />
          Importar Empresas
        </Button>
        <Button onClick={handleExport} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Exportar Empresas
            </>
          )}
        </Button>
      </div>

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Empresas</DialogTitle>
            <DialogDescription>
              Selecione um arquivo CSV para importar os dados das empresas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {step === 'upload' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasHeaders"
                    checked={hasHeaders}
                    onChange={handleToggleHeaders}
                  />
                  <label htmlFor="hasHeaders" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Primeira linha como cabeçalho
                  </label>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  ref={fileInputRef}
                  id="fileInput"
                />
                <label htmlFor="fileInput">
                  <Button variant="secondary" asChild>
                    <span className="flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo CSV
                    </span>
                  </Button>
                </label>
              </div>
            )}

            {step === 'mapping' && importData.length > 0 && (
              <ImportMappingStep
                headers={Object.keys(importData[0])}
                importFields={importFields}
                fieldMapping={fieldMapping}
                setFieldMapping={setFieldMapping}
                onNext={handleNextStep}
              />
            )}

            {step === 'validation' && importData.length > 0 && (
              <ImportValidationStep
                importData={importData}
                importFields={importFields}
                fieldMapping={fieldMapping}
                setValidationData={setValidationData}
                onNext={handleNextStep}
              />
            )}

            {step === 'confirmation' && importData.length > 0 && (
              <ImportConfirmationStep
                importData={importData}
                fieldMapping={fieldMapping}
                validationData={validationData}
                onImport={handleStartImport}
                onCancel={handleCancelImport}
              />
            )}
          </div>
          <DialogFooter>
            {step !== 'upload' && step !== 'confirmation' && (
              <Button type="button" variant="outline" onClick={handleBackToMapping}>
                Voltar
              </Button>
            )}
            {step === 'upload' && (
              <Button type="button" variant="outline" onClick={() => setIsImportOpen(false)}>
                Cancelar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportExportEmpresas;
