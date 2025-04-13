
import { useCallback } from 'react';
import { toast } from 'sonner';
import { MensagemFormValues } from '../schema';

export const useMensagensSubmit = () => {
  // Função para enviar a mensagem
  const submitMensagem = useCallback(async (values: MensagemFormValues): Promise<void> => {
    // Log para depuração
    console.log('Enviando mensagem:', values);
    
    // Simulando um envio com atraso
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Se chegou aqui, o envio foi bem sucedido
    toast.success('Mensagem enviada com sucesso!');
    
    // Aqui iria o código para enviar a mensagem através de uma API
    // Em produção, poderia ser um fetch, axios, etc para um endpoint real
    
    return Promise.resolve();
  }, []);

  return { submitMensagem };
};

export default useMensagensSubmit;
