
import React, { useState, useRef } from 'react';
import { Download, Upload, CheckCircle, AlertCircle, HelpCircle, Trash2, XCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Database } from '@/integrations/supabase/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

interface EmpresaData {
  id?: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: NichoType;
  status: StatusType;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  produtos?: string;
  endereco: string;
  cep: string;
  latitude?: number;
  longitude?: number;
  desconto?: string;
  created_at?: string;
  logo_url?: string;
  capa_url?: string;
  video_url?: string;
}

interface ImportError {
  row: number;
  message: string;
  field?: string;
  data: any;
}

interface ImportPreviewProps {
  data: EmpresaData[];
  onConfirm: () => void;
  onCancel: () => void;
  errors: ImportError[];
}

const ImportPreview: React.FC<ImportPreviewProps> = ({ data, onConfirm, onCancel, errors }) => {
  // Agrupar erros por linha para exibição
  const errorsByRow: Record<number, ImportError[]> = {};
  errors.forEach(error => {
    if (!errorsByRow[error.row]) {
      errorsByRow[error.row] = [];
    }
    errorsByRow[error.row].push(error);
  });

  return (
    <>
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Validação dos campos</h4>
        <div className="bg-slate-50 p-4 rounded-md border">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-blue-500" />
            <span className="text-sm">Campos obrigatórios: nome_fantasia, razao_social, cnpj, responsavel, telefone, email, cidade, nicho, endereco, cep</span>
          </div>
          
          {errors.length > 0 && (
            <div className="flex items-center gap-2 text-red-500 text-sm mb-2">
              <AlertCircle size={16} />
              <span>Foram encontrados {errors.length} problemas que precisam ser corrigidos antes da importação.</span>
            </div>
          )}
          
          {/* Lista de erros agrupada por tipo */}
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {Object.entries(
                errors.reduce<Record<string, {message: string, count: number}>>((acc, error) => {
                  const key = error.field ? `${error.field}: ${error.message}` : error.message;
                  if (!acc[key]) acc[key] = {message: error.message, count: 0};
                  acc[key].count++;
                  return acc;
                }, {})
              ).map(([key, {message, count}]) => (
                <div key={key} className="bg-red-50 text-red-700 px-3 py-2 rounded-md flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <XCircle size={16} />
                    <span>{key}</span>
                  </div>
                  <span className="bg-red-100 px-2 py-1 rounded-full text-xs font-medium">{count} {count === 1 ? 'ocorrência' : 'ocorrências'}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <ScrollArea className="h-[300px] border rounded-md">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0">
            <TableRow>
              <TableHead className="w-[50px]">Linha</TableHead>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Nicho</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const rowErrors = errorsByRow[index] || [];
              return (
                <TableRow 
                  key={index} 
                  className={rowErrors.length > 0 ? "bg-red-50" : ""}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.nome_fantasia}</TableCell>
                  <TableCell>{item.cnpj}</TableCell>
                  <TableCell>{item.responsavel}</TableCell>
                  <TableCell>{item.nicho}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.cidade}</TableCell>
                  <TableCell>
                    {rowErrors.length > 0 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent className="w-[280px]">
                            <div className="text-xs space-y-1">
                              {rowErrors.map((err, i) => (
                                <p key={i}>{err.field ? `${err.field}: ` : ''}{err.message}</p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <DialogFooter className="mt-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex-shrink-0">
            {errors.length > 0 && (
              <span className="text-red-500 text-sm mr-2">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                {errors.length} {errors.length === 1 ? "erro encontrado" : "erros encontrados"}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button onClick={onConfirm} disabled={errors.length > 0}>
              Confirmar Importação
            </Button>
          </div>
        </div>
      </DialogFooter>
    </>
  );
};

interface ImportExportEmpresasProps {
  onImportSuccess: () => void;
}

const ImportExportEmpresas: React.FC<ImportExportEmpresasProps> = ({ onImportSuccess }) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<EmpresaData[]>([]);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("CSV parse results:", results);
        
        // Process and validate the data
        const parsedData = results.data as Record<string, string>[];
        const errors: ImportError[] = [];
        
        // Process and validate the data
        const processedData: EmpresaData[] = parsedData.map((row, index) => {
          const empresa: Partial<EmpresaData> = {};
          
          // Required fields
          empresa.nome_fantasia = row.nome_fantasia || '';
          empresa.razao_social = row.razao_social || '';
          empresa.cnpj = row.cnpj || '';
          empresa.responsavel = row.responsavel || '';
          empresa.telefone = row.telefone || '';
          empresa.email = row.email || '';
          empresa.cidade = row.cidade || '';
          empresa.nicho = (row.nicho as NichoType) || 'Outro';
          empresa.status = (row.status as StatusType) || 'pendente';
          empresa.endereco = row.endereco || '';
          empresa.cep = row.cep || '';
          
          // Optional fields
          if (row.site) empresa.site = row.site;
          if (row.instagram) empresa.instagram = row.instagram;
          if (row.whatsapp) empresa.whatsapp = row.whatsapp;
          if (row.produtos) empresa.produtos = row.produtos;
          if (row.desconto) empresa.desconto = row.desconto;
          if (row.latitude) empresa.latitude = Number(row.latitude);
          if (row.longitude) empresa.longitude = Number(row.longitude);
          if (row.logo_url) empresa.logo_url = row.logo_url;
          if (row.capa_url) empresa.capa_url = row.capa_url;
          if (row.video_url) empresa.video_url = row.video_url;
          
          // Validate required fields
          const requiredFields = [
            { field: 'nome_fantasia', label: 'Nome Fantasia' },
            { field: 'razao_social', label: 'Razão Social' },
            { field: 'cnpj', label: 'CNPJ' },
            { field: 'responsavel', label: 'Responsável' },
            { field: 'telefone', label: 'Telefone' },
            { field: 'email', label: 'Email' },
            { field: 'cidade', label: 'Cidade' },
            { field: 'endereco', label: 'Endereço' },
            { field: 'cep', label: 'CEP' },
            { field: 'nicho', label: 'Nicho' }
          ];
          
          requiredFields.forEach(({field, label}) => {
            if (!empresa[field as keyof EmpresaData]) {
              errors.push({
                row: index,
                field,
                message: `Campo ${label} é obrigatório`,
                data: row
              });
            }
          });
          
          // Validate email format
          if (empresa.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.email)) {
            errors.push({
              row: index,
              field: 'email',
              message: 'Email inválido',
              data: row
            });
          }
          
          // Validate CNPJ format (simplified validation)
          if (empresa.cnpj && !validateCNPJ(empresa.cnpj)) {
            errors.push({
              row: index,
              field: 'cnpj',
              message: 'CNPJ inválido ou mal formatado',
              data: row
            });
          }
          
          // Validate nicho - must be one of the valid types
          const validNichos: NichoType[] = ['Alimentação', 'Saúde', 'Educação', 'Serviços', 'Comércio', 'Lazer', 'Tecnologia', 'Outro'];
          if (empresa.nicho && !validNichos.includes(empresa.nicho)) {
            errors.push({
              row: index,
              field: 'nicho',
              message: `Nicho inválido. Valores permitidos: ${validNichos.join(', ')}`,
              data: row
            });
          }
          
          return empresa as EmpresaData;
        });
        
        setImportData(processedData);
        setImportErrors(errors);
        setIsImportDialogOpen(true);
        setIsImporting(false);
      },
      error: (error) => {
        console.error('Parsing error:', error);
        toast({
          title: 'Erro ao processar arquivo',
          description: 'O arquivo CSV não pôde ser processado corretamente.',
          variant: 'destructive',
        });
        setIsImporting(false);
      }
    });
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Helper function to validate CNPJ
  const validateCNPJ = (cnpj: string): boolean => {
    // Remove non-numeric characters
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // CNPJ must have 14 digits
    if (cnpj.length !== 14) {
      return false;
    }
    
    // Check if all digits are the same (invalid)
    if (/^(\d)\1+$/.test(cnpj)) {
      return false;
    }
    
    // For a complete validation, we would implement the check digits algorithm
    // but for simplicity, we'll just check the format
    return true;
  };

  const handleExportEmpresas = async () => {
    setIsExporting(true);
    
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Create CSV
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `empresas_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: 'Exportação concluída',
          description: `${data.length} empresas foram exportadas com sucesso.`,
        });
      } else {
        toast({
          title: 'Sem dados para exportar',
          description: 'Não há empresas registradas para exportação.',
        });
      }
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: 'Erro na exportação',
        description: error.message || 'Erro ao exportar os dados.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsImporting(true);
    
    try {
      // Remove any potential id from import data
      const dataToInsert = importData.map(({ id, ...item }) => ({
        ...item,
        created_at: new Date().toISOString()
      }));
      
      // Using an explicit type cast to match the database structure
      const { data, error } = await supabase
        .from('empresas')
        .insert(dataToInsert as any[]);
      
      if (error) throw error;
      
      toast({
        title: 'Importação concluída',
        description: `${importData.length} empresas foram importadas com sucesso.`,
      });
      
      onImportSuccess();
      setIsImportDialogOpen(false);
      setImportData([]);
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: 'Erro na importação',
        description: error.message || 'Erro ao importar os dados.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 bg-slate-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Download className="h-5 w-5" />
              Importação e Exportação de Empresas
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Importe ou exporte dados de empresas conveniadas em formato CSV.
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={handleExportEmpresas}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exportando...' : 'Exportar CSV'}
            </Button>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isImporting ? 'Importando...' : 'Importar CSV'}
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".csv"
              className="hidden" 
            />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            Instruções para Importação
          </h4>
          
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Prepare um arquivo CSV com as colunas necessárias para importação</li>
            <li>As colunas obrigatórias são: nome_fantasia, razao_social, cnpj, responsavel, telefone, email, cidade, nicho, endereco e cep</li>
            <li>Para o campo "nicho", use um dos seguintes valores: Alimentação, Saúde, Educação, Serviços, Comércio, Lazer, Tecnologia, Outro</li>
            <li>Para o campo "status", use um dos seguintes valores: ativo, pendente, inativo</li>
            <li>Certifique-se de que o CSV está corretamente formatado antes de importar</li>
          </ul>
          
          <div className="mt-4">
            <button 
              className="text-sm text-blue-500 flex items-center gap-1"
              onClick={() => {
                const template = [
                  {
                    nome_fantasia: "Empresa Exemplo",
                    razao_social: "Empresa Exemplo LTDA",
                    cnpj: "12.345.678/0001-00",
                    responsavel: "João Silva",
                    telefone: "(11) 98765-4321",
                    email: "contato@empresa.com",
                    cidade: "São Paulo",
                    nicho: "Comércio",
                    status: "ativo",
                    endereco: "Rua Exemplo, 123",
                    cep: "01234-567",
                    site: "www.empresa.com",
                    instagram: "@empresa",
                    whatsapp: "(11) 98765-4321",
                    desconto: "10% para associados"
                  }
                ];
                
                const csv = Papa.unparse(template);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', 'template_empresas.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="h-4 w-4" />
              Baixar modelo de CSV para importação
            </button>
          </div>
        </div>
        
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Revisar Dados para Importação</DialogTitle>
              <DialogDescription>
                Revise os dados antes de confirmar a importação. Registros com erros são destacados em vermelho.
              </DialogDescription>
            </DialogHeader>
            
            <ImportPreview 
              data={importData} 
              errors={importErrors}
              onConfirm={handleConfirmImport}
              onCancel={() => setIsImportDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImportExportEmpresas;
