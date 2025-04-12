
import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { validateEmpresaData } from './validationUtils';
import { EmpresaData, ImportError } from './types';
import { logOperation } from '../../audit/auditLogService';
import { useAuth } from '@/components/auth/AuthProvider';

interface UseImportExportProps {
  onImportSuccess: () => void;
}

export const useImportExport = ({ onImportSuccess }: UseImportExportProps) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<EmpresaData[]>([]);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      toast({
        title: 'Permissão negada',
        description: 'Apenas administradores podem importar dados.',
        variant: 'destructive',
      });
      return;
    }
    
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
        const { processedData, errors } = validateEmpresaData(parsedData);
        
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

  const handleExportEmpresas = async () => {
    if (!isAdmin) {
      toast({
        title: 'Permissão negada',
        description: 'Apenas administradores podem exportar dados.',
        variant: 'destructive',
      });
      return;
    }
    
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
        
        // Log export operation
        await logOperation({
          eventType: 'export',
          entityType: 'empresa',
          format: 'csv',
          recordCount: data.length,
          details: `Exportação de ${data.length} empresas em CSV`
        });
        
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
    if (!isAdmin) {
      toast({
        title: 'Permissão negada',
        description: 'Apenas administradores podem importar dados.',
        variant: 'destructive',
      });
      return;
    }
    
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
      
      // Log import operation
      await logOperation({
        eventType: 'import',
        entityType: 'empresa',
        format: 'csv',
        recordCount: importData.length,
        details: `Importação de ${importData.length} empresas via CSV`
      });
      
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

  return {
    isImportDialogOpen,
    setIsImportDialogOpen,
    isExporting,
    isImporting,
    importData,
    importErrors,
    fileInputRef,
    handleFileSelect,
    handleExportEmpresas,
    handleConfirmImport
  };
};
