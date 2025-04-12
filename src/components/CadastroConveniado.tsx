
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { ConveniadoFormData, ImportConveniadoData, ImportValidationData } from './conveniado/types';
import { DadosPessoaisForm } from './conveniado/DadosPessoaisForm';
import { ContatoForm } from './conveniado/ContatoForm';
import { EnderecoForm } from './conveniado/EnderecoForm';
import { VeiculoForm } from './conveniado/VeiculoForm';
import { FinanceiroForm } from './conveniado/FinanceiroForm';
import { ImportDialog } from './conveniado/ImportDialog';
import { ImportExportActions } from './conveniado/ImportExportActions';
import { 
  saveConveniado, 
  uploadFoto, 
  importConveniados, 
  exportConveniados 
} from './conveniado/conveniadoService';
import { 
  parseCSVFile, 
  parseXMLFile, 
  validateImportData, 
  generateCSVExport, 
  generateXMLExport, 
  downloadFile 
} from './conveniado/fileUtils';
import { logOperation } from './audit/auditLogService';

const CadastroConveniado: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<ImportConveniadoData[]>([]);
  const [validationData, setValidationData] = useState<ImportValidationData[]>([]);
  const [importFormat, setImportFormat] = useState<'csv' | 'xml'>('csv');
  const { isAdmin } = useAuth();
  
  const form = useForm<ConveniadoFormData>();
  const { handleSubmit, reset, setValue, watch } = form;
  const fotoFile = watch('foto');
  
  React.useEffect(() => {
    if (fotoFile && fotoFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(fotoFile[0]);
    }
  }, [fotoFile]);
  
  const onSubmit = async (data: ConveniadoFormData) => {
    setIsSubmitting(true);
    
    try {
      // Save conveniado data
      const conveniadoResult = await saveConveniado(data);
      
      // Upload photo if provided
      if (fotoFile && fotoFile[0]) {
        await uploadFoto(conveniadoResult.id, fotoFile[0]);
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "O conveniado foi cadastrado e está aguardando aprovação.",
      });
      
      reset();
      setFotoPreview(null);
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
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem importar dados.",
        variant: "destructive",
      });
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          let parsedData: ImportConveniadoData[] = [];
          
          const fileFormat = file.name.toLowerCase().endsWith('.xml') ? 'xml' : 'csv';
          setImportFormat(fileFormat as 'csv' | 'xml');
          
          if (fileFormat === 'xml') {
            parsedData = parseXMLFile(content);
          } else {
            parsedData = parseCSVFile(content);
          }
          
          const validations = validateImportData(parsedData);
          
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
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem importar dados.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const count = await importConveniados(importData);
      
      // Log the import operation
      await logOperation({
        eventType: 'import',
        entityType: 'conveniado',
        format: importFormat,
        recordCount: count,
        details: `Importação de ${count} conveniados em ${importFormat.toUpperCase()}`
      });
      
      toast({
        title: "Importação realizada com sucesso",
        description: `${count} conveniados foram importados.`,
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
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem exportar dados.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const conveniados = await exportConveniados();
      let exportData;
      
      if (format === 'csv') {
        exportData = generateCSVExport(conveniados);
      } else {
        exportData = generateXMLExport(conveniados);
      }
      
      downloadFile(exportData.content, exportData.fileName, exportData.mimeType);
      
      // Log the export operation with the correct format
      await logOperation({
        eventType: 'export',
        entityType: 'conveniado',
        format,
        recordCount: conveniados.length,
        details: `Exportação de ${conveniados.length} conveniados em ${format.toUpperCase()}`
      });
      
      toast({
        title: "Exportação realizada com sucesso",
        description: `Os dados foram exportados para ${exportData.fileName}.`,
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

  const removeFoto = () => {
    setValue('foto', undefined);
    setFotoPreview(null);
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is handled by the useEffect watching fotoFile
  };

  const handleCancel = () => {
    reset();
    setFotoPreview(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Cadastrar Conveniado</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DadosPessoaisForm 
            form={form}
            fotoPreview={fotoPreview}
            onFotoUpload={handleFotoUpload}
            onFotoRemove={removeFoto}
          />
          
          <ContatoForm form={form} />
          
          <EnderecoForm form={form} />
          
          <VeiculoForm form={form} />
          
          <FinanceiroForm form={form} />
          
          <div className="wp-notice-warning">
            <p className="font-medium">Atenção</p>
            <p className="text-sm">Após o cadastro, o conveniado ficará com status pendente de aprovação até que a documentação seja verificada.</p>
          </div>
          
          <ImportExportActions 
            onImportClick={handleImportClick}
            onFileChange={handleFileChange}
            onExportCsv={() => handleExport('csv')}
            onExportXml={() => handleExport('xml')}
            fileInputRef={fileInputRef}
            isAdmin={isAdmin}
          />
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="wp-button-secondary mr-2"
              onClick={handleCancel}
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
      
      <ImportDialog 
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        importData={importData}
        validationData={validationData}
        setValidationData={setValidationData}
        isSubmitting={isSubmitting}
        onConfirm={handleImportConfirm}
      />
    </div>
  );
};

export default CadastroConveniado;
