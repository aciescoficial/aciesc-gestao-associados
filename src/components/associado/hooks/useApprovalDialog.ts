
import { useState } from 'react';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { useToast } from '@/hooks/use-toast';
import { interessadoService } from '../services/interessadoAprovacaoService';
import { emailNotificationService } from '@/components/comunicacao/services/emailNotificationService';

export const useApprovalDialog = (onSuccess: () => Promise<void>) => {
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);
  const [selectedInterestForApproval, setSelectedInterestForApproval] = useState<AssociadoInteresse | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const { toast } = useToast();

  const openApprovalDialog = (interesse: AssociadoInteresse) => {
    setSelectedInterestForApproval(interesse);
    setIsApprovalDialogOpen(true);
    setApprovalError(null);
  };

  const closeApprovalDialog = () => {
    setIsApprovalDialogOpen(false);
    setSelectedInterestForApproval(null);
    setApprovalError(null);
  };

  const confirmApprove = async (associationTypeId: string) => {
    if (!selectedInterestForApproval) return;
    
    setIsProcessingApproval(true);
    setApprovalError(null);
    
    try {
      const result = await interessadoService.aprovarInteressado(
        selectedInterestForApproval.id, 
        associationTypeId
      );
      
      if (result.success) {
        toast({
          title: 'Interessado aprovado com sucesso!',
          description: 'O cadastro do associado foi criado e um email será enviado.',
        });
        
        if (result.paymentUrl) {
          const emailResult = await emailNotificationService.enviarEmailBoasVindas(
            selectedInterestForApproval.email,
            selectedInterestForApproval.nome,
            selectedInterestForApproval.sobrenome,
            null,
            result.paymentUrl
          );
          
          if (!emailResult.success) {
            toast({
              title: 'Aviso',
              description: 'Associado aprovado, mas houve um erro ao enviar o email de boas-vindas.',
              variant: 'warning',
            });
          }
        }
        
        await onSuccess();
        setIsApprovalDialogOpen(false);
      } else {
        setApprovalError(result.message);
        toast({
          title: 'Erro na aprovação',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido ao processar aprovação';
      setApprovalError(errorMessage);
      toast({
        title: 'Erro na aprovação',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessingApproval(false);
    }
  };

  return {
    isProcessingApproval,
    selectedInterestForApproval,
    isApprovalDialogOpen,
    approvalError,
    openApprovalDialog,
    closeApprovalDialog,
    confirmApprove,
  };
};
