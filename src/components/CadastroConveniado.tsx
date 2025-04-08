
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { FileUp, FileDown, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

type StatusType = Database['public']['Enums']['status_type'];

interface ConveniadoFormData {
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  cidade: string;
  cpf: string;
  creci: string;
  placaPrincipal: string;
  placaSecundaria: string;
}

interface ImportConveniadoData {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci?: string;
  status: 'pendente';
  email: string;
  telefone: string;
  placa_principal?: string;
  placa_secundaria?: string;
  cidade?: string;
}

interface ImportValidationData {
  fieldName: string;
  targetField: string;
  isValid: boolean;
}

const CadastroConveniado: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<ImportConveniadoData[]>([]);
  const [validationData, setValidationData] = useState<ImportValidationData[]>([]);
  const [importFormat, setImportFormat] = useState<'csv' | 'xml'>('csv');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConveniadoFormData>();
  
  const onSubmit = async (data: ConveniadoFormData) => {
    setIsSubmitting(true);
    
    try {
      // Map form data to database schema
      const conveniadoData = {
        nome: data.nome,
        sobrenome: data.sobrenome,
        telefone: data.telefone,
        email: data.email,
        cidade: data.cidade,
        cpf: data.cpf,
        creci: data.creci || null,
        placa_principal: data.placaPrincipal || null,
        placa_secundaria: data.placaSecundaria || null,
        status: 'pendente' as StatusType
      };
      
      // Insert data into the conveniados table
      const { error } = await supabase
        .from('conveniados')
        .insert(conveniadoData);
        
      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "O conveniado foi cadastrado e está aguardando aprovação.",
      });
      
      reset();
    } catch (error: any) {
      console.error("Error inserting data:", error);
      
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao cadastrar o conveniado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          let parsedData: ImportConveniadoData[] = [];
          
          // Detect file format based on extension
          const fileFormat = file.name.toLowerCase().endsWith('.xml') ? 'xml' : 'csv';
          setImportFormat(fileFormat as 'csv' | 'xml');
          
          if (fileFormat === 'xml') {
            // Simple XML parsing (in real implementation, use proper XML parser)
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(content, "text/xml");
            const conveniados = xmlDoc.getElementsByTagName("conveniado");
            
            for (let i = 0; i < conveniados.length; i++) {
              const conv = conveniados[i];
              parsedData.push({
                id: `import-${i}`,
                nome: conv.getElementsByTagName("nome")[0]?.textContent || '',
                sobrenome: conv.getElementsByTagName("sobrenome")[0]?.textContent || '',
                cpf: conv.getElementsByTagName("cpf")[0]?.textContent || '',
                creci: conv.getElementsByTagName("creci")[0]?.textContent || undefined,
                status: 'pendente',
                email: conv.getElementsByTagName("email")[0]?.textContent || '',
                telefone: conv.getElementsByTagName("telefone")[0]?.textContent || '',
                cidade: conv.getElementsByTagName("cidade")[0]?.textContent || '',
                placa_principal: conv.getElementsByTagName("placa_principal")[0]?.textContent || undefined,
                placa_secundaria: conv.getElementsByTagName("placa_secundaria")[0]?.textContent || undefined,
              });
            }
          } else {
            // CSV parsing (simple implementation, in real world use proper CSV parser)
            const rows = content.split('\n');
            const headers = rows[0].split(',').map(h => h.trim());
            
            for (let i = 1; i < rows.length; i++) {
              if (!rows[i].trim()) continue;
              
              const values = rows[i].split(',').map(v => v.trim());
              const row: any = {};
              
              headers.forEach((header, index) => {
                row[header.toLowerCase()] = values[index] || '';
              });
              
              parsedData.push({
                id: `import-${i}`,
                nome: row.nome || '',
                sobrenome: row.sobrenome || '',
                cpf: row.cpf || '',
                creci: row.creci || undefined,
                status: 'pendente',
                email: row.email || '',
                telefone: row.telefone || '',
                cidade: row.cidade || '',
                placa_principal: row.placa_principal || undefined,
                placa_secundaria: row.placa_secundaria || undefined,
              });
            }
          }
          
          // Basic field validation
          const validations: ImportValidationData[] = [];
          const requiredFields = ['nome', 'sobrenome', 'cpf', 'email', 'telefone', 'cidade'];
          
          const firstRow = parsedData[0] || {};
          Object.keys(firstRow).forEach(key => {
            if (key === 'id' || key === 'status') return;
            
            const isValid = requiredFields.includes(key) 
              ? parsedData.every(row => !!(row as any)[key])
              : true;
              
            validations.push({
              fieldName: key,
              targetField: key,
              isValid
            });
          });
          
          setImportData(parsedData);
          setValidationData(validations);
          setShowImportDialog(true);
        } catch (error) {
          console.error("Error parsing file:", error);
          toast({
            title: "Erro ao processar arquivo",
            description: "O arquivo não pôde ser processado. Verifique o formato e tente novamente.",
            variant: "destructive",
          });
        }
      };
      
      fileReader.readAsText(file);
    }
  };

  const handleImportConfirm = async () => {
    try {
      setIsSubmitting(true);
      
      // In a real application, this would send the data to the backend
      // Format import data to match the database schema
      const conveniados = importData.map(item => ({
        nome: item.nome,
        sobrenome: item.sobrenome,
        cpf: item.cpf,
        creci: item.creci || null,
        email: item.email,
        telefone: item.telefone,
        cidade: item.cidade || '',
        placa_principal: item.placa_principal || null,
        placa_secundaria: item.placa_secundaria || null,
        status: 'pendente' as StatusType
      }));
      
      // Insert data into the conveniados table
      const { error } = await supabase
        .from('conveniados')
        .insert(conveniados);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Importação realizada com sucesso",
        description: `${importData.length} conveniados foram importados.`,
      });
      
      setShowImportDialog(false);
    } catch (error: any) {
      console.error("Error importing data:", error);
      toast({
        title: "Erro na importação",
        description: error.message || "Ocorreu um erro ao importar os conveniados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async (format: 'csv' | 'xml') => {
    try {
      let data: string;
      let fileName: string;
      let mimeType: string;
      
      // Fetch all conveniados from the database
      const { data: conveniados, error } = await supabase
        .from('conveniados')
        .select('*');
        
      if (error) throw error;
      
      if (format === 'csv') {
        // Create CSV
        const headers = ['id', 'nome', 'sobrenome', 'cpf', 'creci', 'status', 'email', 'telefone', 'cidade', 'placa_principal', 'placa_secundaria'];
        const csvRows = [
          headers.join(','),
          ...conveniados.map(item => {
            return [
              item.id,
              item.nome,
              item.sobrenome,
              item.cpf,
              item.creci || '',
              item.status,
              item.email,
              item.telefone,
              item.cidade,
              item.placa_principal || '',
              item.placa_secundaria || ''
            ].join(',');
          })
        ];
        
        data = csvRows.join('\n');
        fileName = 'conveniados.csv';
        mimeType = 'text/csv';
      } else {
        // Create XML
        const xmlRows = conveniados.map(item => {
          return `  <conveniado>
    <id>${item.id}</id>
    <nome>${item.nome}</nome>
    <sobrenome>${item.sobrenome}</sobrenome>
    <cpf>${item.cpf}</cpf>
    <creci>${item.creci || ''}</creci>
    <status>${item.status}</status>
    <email>${item.email}</email>
    <telefone>${item.telefone}</telefone>
    <cidade>${item.cidade}</cidade>
    <placa_principal>${item.placa_principal || ''}</placa_principal>
    <placa_secundaria>${item.placa_secundaria || ''}</placa_secundaria>
  </conveniado>`;
        });
        
        data = `<?xml version="1.0" encoding="UTF-8"?>
<conveniados>
${xmlRows.join('\n')}
</conveniados>`;
        fileName = 'conveniados.xml';
        mimeType = 'application/xml';
      }
      
      // Create and trigger download
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação realizada com sucesso",
        description: `Os dados foram exportados para ${fileName}.`,
      });
    } catch (error: any) {
      console.error("Error exporting data:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Cadastrar Conveniado</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Nome*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.nome ? 'border-wp-error' : ''}`}
                {...register('nome', { required: "Nome é obrigatório" })}
              />
              {errors.nome && <p className="text-wp-error text-sm">{errors.nome.message}</p>}
            </div>
            
            {/* Sobrenome */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Sobrenome*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.sobrenome ? 'border-wp-error' : ''}`}
                {...register('sobrenome', { required: "Sobrenome é obrigatório" })}
              />
              {errors.sobrenome && <p className="text-wp-error text-sm">{errors.sobrenome.message}</p>}
            </div>
            
            {/* Telefone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Telefone*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.telefone ? 'border-wp-error' : ''}`}
                placeholder="(00) 00000-0000"
                {...register('telefone', { required: "Telefone é obrigatório" })}
              />
              {errors.telefone && <p className="text-wp-error text-sm">{errors.telefone.message}</p>}
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">E-mail*</label>
              <input
                type="email"
                className={`wp-input w-full ${errors.email ? 'border-wp-error' : ''}`}
                {...register('email', { 
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido"
                  } 
                })}
              />
              {errors.email && <p className="text-wp-error text-sm">{errors.email.message}</p>}
            </div>
            
            {/* Cidade */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Cidade*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.cidade ? 'border-wp-error' : ''}`}
                {...register('cidade', { required: "Cidade é obrigatória" })}
              />
              {errors.cidade && <p className="text-wp-error text-sm">{errors.cidade.message}</p>}
            </div>
            
            {/* CPF */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">CPF*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.cpf ? 'border-wp-error' : ''}`}
                placeholder="000.000.000-00"
                {...register('cpf', { required: "CPF é obrigatório" })}
              />
              {errors.cpf && <p className="text-wp-error text-sm">{errors.cpf.message}</p>}
            </div>
            
            {/* CRECI */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Número CRECI</label>
              <input
                type="text"
                className="wp-input w-full"
                {...register('creci')}
              />
            </div>
            
            {/* Placa Principal */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Placa do Seu Carro - Principal</label>
              <input
                type="text"
                className="wp-input w-full"
                placeholder="AAA0A00"
                {...register('placaPrincipal')}
              />
            </div>
            
            {/* Placa Secundária */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Placa do Seu Carro - Secundário</label>
              <input
                type="text"
                className="wp-input w-full"
                placeholder="AAA0A00"
                {...register('placaSecundaria')}
              />
            </div>
          </div>
          
          <div className="wp-notice-warning">
            <p className="font-medium">Atenção</p>
            <p className="text-sm">Após o cadastro, o conveniado ficará com status pendente de aprovação até que a documentação seja verificada.</p>
          </div>
          
          <div className="mt-5 flex justify-between items-center border-t pt-5">
            <div className="font-medium">Importar/Exportar Conveniados</div>
            <div className="flex space-x-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv,.xml" 
                style={{ display: 'none' }}
              />
              <Button 
                variant="outline"
                onClick={handleImportClick}
                className="flex gap-2 items-center"
              >
                <FileUp size={16} />
                Importar
              </Button>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('csv')}
                  className="flex gap-2 items-center"
                >
                  <FileDown size={16} />
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('xml')}
                  className="flex gap-2 items-center"
                >
                  <FileDown size={16} />
                  XML
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="wp-button-secondary mr-2"
              onClick={() => reset()}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="wp-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Import Data Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Importar Conveniados</DialogTitle>
            <DialogDescription>
              Verifique os dados a serem importados e confirme o mapeamento dos campos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <h4 className="font-medium">Validação de Campos</h4>
            
            <div className="space-y-2">
              {validationData.map((validation, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-2 rounded-md ${validation.isValid ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}
                >
                  <div className="flex items-center gap-2">
                    {validation.isValid ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <AlertCircle size={18} className="text-yellow-500" />
                    )}
                    <span className="font-medium">{validation.fieldName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Mapear para:</span>
                    <select 
                      className="border rounded-md p-1 bg-white"
                      value={validation.targetField}
                      onChange={(e) => {
                        const newValidationData = [...validationData];
                        newValidationData[idx] = {
                          ...validation,
                          targetField: e.target.value
                        };
                        setValidationData(newValidationData);
                      }}
                    >
                      <option value="nome">Nome</option>
                      <option value="sobrenome">Sobrenome</option>
                      <option value="cpf">CPF</option>
                      <option value="creci">CRECI</option>
                      <option value="email">Email</option>
                      <option value="telefone">Telefone</option>
                      <option value="cidade">Cidade</option>
                      <option value="placa_principal">Placa Principal</option>
                      <option value="placa_secundaria">Placa Secundária</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <h4 className="font-medium mt-4">Pré-visualização dos dados ({importData.length} registros)</h4>
            <div className="overflow-x-auto max-h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Sobrenome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importData.slice(0, 5).map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.sobrenome}</TableCell>
                      <TableCell>{item.cpf}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.telefone}</TableCell>
                      <TableCell>{item.cidade}</TableCell>
                    </TableRow>
                  ))}
                  {importData.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        + {importData.length - 5} outros registros
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Importando...' : `Importar ${importData.length} Registros`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CadastroConveniado;
