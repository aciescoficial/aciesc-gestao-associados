
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ImportAssociadoData, ImportValidationData } from '../../types';
import { importAssociados } from '../../services/importService';
import { useAssociadoImport } from '../../hooks/useAssociadoImport';
import { useAuth } from '@/components/auth/AuthProvider';
import { logOperation } from '@/components/audit/services/logOperationService';

export const useImportAssociados = () => {
  const [importData, setImportData] = useState<ImportAssociadoData[]>([]);
  const [validationData, setValidationData] = useState<ImportValidationData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const { parseImportFile } = useAssociadoImport();

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await parseImportFile(file, setImportData, setValidationData);
    } catch (error) {
      console.error("Error parsing import file:", error);
      toast({
        title: "Erro ao processar arquivo",
        description: "Não foi possível processar o arquivo CSV. Verifique o formato.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmImport = async (criarUsuarios: boolean = true) => {
    if (importData.length === 0) {
      toast({
        title: "Sem dados para importar",
        description: "Não há dados para importar. Selecione um arquivo CSV válido.",
        variant: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save user preference for next time
      localStorage.setItem('importarCriarUsuarios', String(criarUsuarios));

      // Perform import
      const count = await importAssociados(importData, criarUsuarios);
      
      if (count > 0) {
        // Log successful operation
        await logOperation({
          eventType: 'import',
          entityType: 'associado',
          format: 'csv',
          recordCount: count,
          details: `Importação de ${count} associados${criarUsuarios ? ' com criação de usuários' : ''}`
        });
        
        toast({
          title: "Importação concluída",
          description: `${count} associados foram importados com sucesso${criarUsuarios ? ' e usuários foram criados' : ''}.`,
        });
        
        // Reset state and redirect
        setImportData([]);
        setValidationData([]);
        navigate("/associados/pesquisar");
      } else {
        toast({
          title: "Nenhum associado importado",
          description: "Não foi possível importar os associados. Verifique os logs para mais detalhes.",
          variant: "warning",
        });
      }
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro durante a importação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetImport = () => {
    setImportData([]);
    setValidationData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    importData,
    validationData,
    isSubmitting,
    fileInputRef,
    isAdmin,
    handleImportClick,
    handleFileChange,
    handleConfirmImport,
    resetImport,
    setValidationData,
    navigate
  };
};
