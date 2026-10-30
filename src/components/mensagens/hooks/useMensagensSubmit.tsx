import { useCallback } from 'react';
import { toast } from 'sonner';
import { MensagemFormValues } from '../schema';
import { useMessages } from './useMessages';
import { supabase } from '@/integrations/supabase/client';
import { MessagePriority } from '../types';
import { UserRole } from '@/components/usuarios/types';

export const useMensagensSubmit = () => {
  const { addMessage } = useMessages();
  
  // Function to send email via Supabase Edge Function
  const sendEmailMessage = async (values: MensagemFormValues, recipients: string[]): Promise<void> => {
    if (recipients.length === 0) {
      toast.error('Nenhum destinatário selecionado');
      return;
    }
    
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          recipients,
          subject: values.assunto,
          body: values.mensagem,
          send_copy: values.enviarCopia
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success(`Email enviado para ${recipients.length} destinatários`);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.error('Falha ao enviar email. Verifique se o sistema está configurado corretamente.');
      throw error;
    }
  };
  
  // Function to send system message
  const sendSystemMessage = async (values: MensagemFormValues, recipients: string[]): Promise<void> => {
    if (recipients.length === 0) {
      toast.error('Nenhum destinatário selecionado');
      return;
    }
    
    try {
      // Determine priority based on subject
      let priority: 'normal' | 'high' | 'urgent' = 'normal';
      const lowercaseAssunto = values.assunto.toLowerCase();
      
      if (lowercaseAssunto.includes('urgente') || lowercaseAssunto.includes('importante')) {
        priority = 'high';
      } else if (lowercaseAssunto.includes('emergência') || lowercaseAssunto.includes('crítico')) {
        priority = 'urgent';
      }

      const { data: recipientUsers, error: recipientError } = await supabase
        .from('user')
        .select('id')
        .in('email', recipients);

      if (recipientError) {
        throw recipientError;
      }

      const recipientIds = recipientUsers.map(user => user.id);
      
      // Use the addMessage function from useMessages hook
      await addMessage({
        title: values.assunto,
        content: values.mensagem,
        priority,
        recipient_ids: recipientIds
      });
      
      toast.success(`Mensagem enviada para ${recipients.length} destinatários`);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Falha ao enviar mensagem.');
      throw error;
    }
  };
  
  // Function to get recipients based on message configuration
  const getRecipients = async (values: MensagemFormValues): Promise<string[]> => {
    try {
      // Single email recipient
      if (values.destinatario === 'usuario' && values.emailDestinatario) {
        return [values.emailDestinatario];
      }
      
      // Multiple selected users
      if (values.destinatario === 'usuario' && values.selectedUsers && values.selectedUsers.length > 0) {
        const { data, error } = await supabase
          .from('user')
          .select('email')
          .in('id', values.selectedUsers)
          .eq('active', true);
          
        if (error) {
          throw error;
        }
        
        return data.map(user => user.email).filter(Boolean) as string[];
      }
      
      // Group of users
      if (values.destinatario === 'grupo' && values.grupoDestinatarios) {
        let query = supabase
          .from('user')
          .select('email')
          .eq('active', true);
          
        // Filter by role based on group
        if (values.grupoDestinatarios !== 'todos') {
          // Map the UI group values to actual database role values
          let role: UserRole | undefined;
          
          switch (values.grupoDestinatarios) {
            case 'associados':
              role = 'user';
              break;
            case 'empresas':
              role = 'empresa';
              break;
            case 'diretoria':
              role = 'diretoria';
              break;
            // For 'todos', we don't add a role filter
          }
          
          // Only add the role filter if we have a valid role
          if (role) {
            query = query.eq('role', role);
          }
        }
        
        // Additional tag filter if specified
        if (values.userTag && values.userTag !== 'todos') {
          query = query.contains('tags', [values.userTag]);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        return data.map(user => user.email).filter(Boolean) as string[];
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao obter destinatários:', error);
      throw error;
    }
  };
  
  // Main submission function
  const submitMensagem = useCallback(async (values: MensagemFormValues): Promise<void> => {
    // Log for debugging
    console.log('Enviando mensagem:', values);
    
    try {
      // Get recipients based on form values
      const recipients = await getRecipients(values);
      
      if (recipients.length === 0) {
        toast.error('Não foi possível determinar os destinatários da mensagem');
        return;
      }
      
      // Send the appropriate message type
      if (values.tipoEnvio === 'email') {
        await sendEmailMessage(values, recipients);
      } else {
        await sendSystemMessage(values, recipients);
      }
      
      // Log success
      console.log('Mensagem enviada com sucesso para:', recipients);
    } catch (error) {
      console.error('Erro ao processar envio:', error);
      throw error;
    }
  }, [addMessage]);

  return { submitMensagem };
};

export default useMensagensSubmit;
