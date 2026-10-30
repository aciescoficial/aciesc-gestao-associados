
import { useState } from 'react';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { useToast } from '@/hooks/use-toast';
import { interessadoService } from '../services/interessadoAprovacaoService';

export const useRejectDialog = (onSuccess: () => Promise<void>) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<AssociadoInteresse | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { toast } = useToast();

  const openRejectDialog = (interesse: AssociadoInteresse) => {
    setSelectedInterest(interesse);
    setRejectReason('');
    setIsRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setIsRejectDialogOpen(false);
    setSelectedInterest(null);
    setRejectReason('');
  };

  const confirmReject = async () => {
    if (!selectedInterest) return;
    
    setIsRejecting(true);
    try {
      const result = await interessadoService.rejeitarInteressado(
        selectedInterest.id, 
        rejectReason || 'Sem informações adicionais.'
      );
      
      if (result.success) {
        toast({
          title: 'Interessado rejeitado',
          description: 'O cadastro foi removido da lista de pendências.',
        });
        
        await onSuccess();
      } else {
        toast({
          title: 'Erro na rejeição',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro na rejeição',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsRejecting(false);
      setIsRejectDialogOpen(false);
    }
  };

  return {
    isRejecting,
    selectedInterest,
    isRejectDialogOpen,
    rejectReason,
    setRejectReason,
    openRejectDialog,
    closeRejectDialog,
    confirmReject,
  };
};
