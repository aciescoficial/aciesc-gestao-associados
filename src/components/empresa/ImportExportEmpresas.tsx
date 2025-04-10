
import React, { useState } from 'react';
import { Upload, Download, AlertTriangle, Check, X } from 'lucide-react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

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
}

const ImportDialog: React.FC<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onImportSuccess: () => void;
}> = ({ isOpen, setIsOpen, onImportSuccess }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportEmpresaData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data as any[];
          const errors: string[] = [];
          
          // Validate and transform the data
          const transformedData = parsedData.map((row, index) => {
            // Validate required fields
            const requiredFields = ['razaoSocial', 'nomeFantasia', 'cnpj', 'responsavel', 'telefone', 'email', 'endereco', 'cidade', 'cep', 'nicho', 'desconto', 'produtos'];
            
            for (const field of requiredFields) {
              if (!row[field]?.trim()) {
                errors.push(`Linha ${index + 2}: Campo obrigatório '${field}' não preenchido.`);
              }
            }
            
            // Validate nicho is a valid enum value
            const validNichos = ["Alimentação", "Saúde", "Educação", "Serviços", "Comércio", "Lazer", "Tecnologia", "Outro"];
            
            if (row.nicho && !validNichos.includes(row.nicho)) {
              errors.push(`Linha ${index + 2}: Valor inválido para 'nicho'. Valores permitidos: ${validNichos.join(', ')}`);
            }
            
            return {
              razaoSocial: row.razaoSocial?.trim() || '',
              nomeFantasia: row.nomeFantasia?.trim() || '',
              cnpj: row.cnpj?.trim() || '',
              responsavel: row.responsavel?.trim() || '',
              telefone: row.telefone?.trim() || '',
              email: row.email?.trim() || '',
              endereco: row.endereco?.trim() || '',
              cidade: row.cidade?.trim() || '',
              cep: row.cep?.trim() || '',
              site: row.site?.trim() || undefined,
              instagram: row.instagram?.trim() || undefined,
              whatsapp: row.whatsapp?.trim() || undefined,
              nicho: row.nicho as NichoType,
              desconto: row.desconto?.trim() || '',
              produtos: row.produtos?.trim() || ''
            };
          });
          
          setValidationErrors(errors);
          setPreviewData(transformedData);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast({
            title: "Erro ao processar arquivo",
            description: "O arquivo CSV não pôde ser processado. Verifique o formato.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const importEmpresas = async () => {
    if (validationErrors.length > 0 || !file) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const empresasData = previewData.map(item => ({
        razao_social: item.razaoSocial,
        nome_fantasia: item.nomeFantasia,
        cnpj: item.cnpj,
        responsavel: item.responsavel,
        telefone: item.telefone,
        email: item.email,
        endereco: item.endereco,
        cidade: item.cidade,
        cep: item.cep,
        site: item.site || null,
        instagram: item.instagram || null,
        whatsapp: item.whatsapp || null,
        nicho: item.nicho,
        desconto: item.desconto,
        produtos: item.produtos,
        status: 'pendente' as StatusType
      }));
      
      const { error } = await supabase
        .from('empresas')
        .insert(empresasData);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Importação concluída",
        description: `${empresasData.length} empresas foram importadas com sucesso.`,
      });
      
      setFile(null);
      setPreviewData([]);
      setValidationErrors([]);
      setIsOpen(false);
      onImportSuccess();
    } catch (error: any) {
      console.error('Error importing companies:', error);
      toast({
        title: "Erro na importação",
        description: error.message || "Ocorreu um erro ao importar as empresas.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Importar Empresas</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <input
              type="file"
              id="csv-upload"
              className="sr-only"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <label
              htmlFor="csv-upload"
              className={`cursor-pointer flex flex-col items-center ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">
                {file ? file.name : 'Clique para selecionar um arquivo CSV'}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                O arquivo deve conter cabeçalhos e estar no formato UTF-8
              </span>
            </label>
          </div>
          
          {validationErrors.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <div className="ml-3 space-y-1">
                  <h3 className="text-sm font-medium text-amber-800">
                    Encontramos {validationErrors.length} problemas no arquivo
                  </h3>
                  <div className="text-xs text-amber-700 max-h-32 overflow-y-auto">
                    {validationErrors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {previewData.length > 0 && validationErrors.length === 0 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="flex">
                <Check className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    {previewData.length} empresas encontradas no arquivo e prontas para importar
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {previewData.length > 0 && (
            <div className="overflow-x-auto max-h-60">
              <table className="wp-table text-xs">
                <thead>
                  <tr>
                    <th>Razão Social</th>
                    <th>Nome Fantasia</th>
                    <th>CNPJ</th>
                    <th>Email</th>
                    <th>Cidade</th>
                    <th>Nicho</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td>{item.razaoSocial}</td>
                      <td>{item.nomeFantasia}</td>
                      <td>{item.cnpj}</td>
                      <td>{item.email}</td>
                      <td>{item.cidade}</td>
                      <td>{item.nicho}</td>
                    </tr>
                  ))}
                  {previewData.length > 5 && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500">
                        ... e mais {previewData.length - 5} registros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={importEmpresas}
              disabled={!file || validationErrors.length > 0 || isProcessing}
              className="flex items-center gap-2"
            >
              {isProcessing ? 'Importando...' : 'Importar Empresas'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ImportExportEmpresas: React.FC<{
  onImportSuccess: () => void;
}> = ({ onImportSuccess }) => {
  const { toast } = useToast();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*');
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há empresas para exportar.",
        });
        return;
      }
      
      // Fix: Define the empresa type to match the database structure
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
        logoUrl: empresa.logo_url || '',
        capaUrl: empresa.capa_url || '',
        videoUrl: empresa.video_url || '',
        status: empresa.status
      }));
      
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `empresas_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: `${exportData.length} empresas foram exportadas com sucesso.`,
      });
    } catch (error: any) {
      console.error('Error exporting companies:', error);
      toast({
        title: "Erro na exportação",
        description: error.message || "Ocorreu um erro ao exportar as empresas.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsImportOpen(true)}
        >
          <Upload className="h-4 w-4" />
          Importar
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </div>
      
      <ImportDialog
        isOpen={isImportOpen}
        setIsOpen={setIsImportOpen}
        onImportSuccess={onImportSuccess}
      />
    </div>
  );
};

export default ImportExportEmpresas;
