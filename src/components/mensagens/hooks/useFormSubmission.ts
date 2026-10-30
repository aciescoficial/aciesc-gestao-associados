
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MensagemFormValues } from '../schema';
import { useMensagensSubmit } from './useMensagensSubmit';
import { UseFormReset } from 'react-hook-form';

export const useFormSubmission = (reset: UseFormReset<MensagemFormValues>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { submitMensagem } = useMensagensSubmit();

  const onSubmit = useCallback(async (values: MensagemFormValues) => {
    // Validate if recipients are selected
    if (values.destinatario === 'usuario' && 
        values.emailDestinatario === '' && 
        (!values.selectedUsers || values.selectedUsers.length === 0)) {
      toast.error('Selecione pelo menos um destinatário');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await submitMensagem(values);
      reset();
      toast.success('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [reset, submitMensagem]);

  return { onSubmit, isLoading };
};
