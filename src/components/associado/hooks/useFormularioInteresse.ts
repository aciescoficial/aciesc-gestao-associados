
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FormInteresseData } from '../schemas/formInteresseSchema';

export const useFormularioInteresse = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: FormInteresseData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting interesse form with data:', data);
      
      // 1. Insert the interesse record
      const { data: interesse, error: insertError } = await supabase
        .from('associado_interesse')
        .insert({
          nome: data.nome,
          sobrenome: data.sobrenome,
          cpf: data.cpf,
          creci: data.creci,
          email: data.email,
          celular: data.celular,
          cidade: data.cidade,
          estado: data.estado,
          motivo_interesse: data.motivoInteresse,
          status: 'aprovado' // Auto-approved
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      console.log('Interesse record created:', interesse);
      
      // 2. Generate payment link
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('asaas-payment', {
        body: {
          customer: {
            name: `${data.nome} ${data.sobrenome}`,
            email: data.email,
            cpfCnpj: data.cpf
          },
          value: 0, // Will be fetched from association type
          description: `Associação ACIESC`,
          solicitacaoId: interesse.id,
          associationTypeId: data.associationTypeId
        }
      });
      
      if (paymentError) throw paymentError;
      
      console.log('Payment generated:', paymentData);
      
      if (!paymentData || !paymentData.invoiceUrl) {
        throw new Error('Falha ao gerar link de pagamento');
      }
      
      // 3. Update the interesse record with payment URL
      const { error: updateError } = await supabase
        .from('associado_interesse')
        .update({
          pagamento_url: paymentData.invoiceUrl
        })
        .eq('id', interesse.id);
        
      if (updateError) {
        console.error('Error updating interesse with payment URL:', updateError);
        // Continue anyway since we have the payment URL
      }
      
      // 4. Create user account
      try {
        const { error: userError } = await supabase.functions.invoke('create-user', {
          body: {
            associadoId: interesse.id,
            email: data.email,
            nome: data.nome,
            sobrenome: data.sobrenome,
            cpf: data.cpf
          }
        });
        
        if (userError) {
          console.warn('Error creating user, but continuing:', userError);
          // Continue anyway as this is not critical for the user flow
        }
      } catch (userCreationError) {
        console.error('Exception in user creation:', userCreationError);
        // Continue anyway as this is not critical for the user flow
      }
      
      // Set payment URL for the success screen
      setPaymentUrl(paymentData.invoiceUrl);
      setSubmitted(true);
      
      toast({
        title: "Formulário enviado com sucesso",
        description: "Prossiga para o pagamento para completar seu cadastro.",
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao enviar formulário",
        description: error.message || "Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setPaymentUrl(null);
  };

  return {
    isSubmitting,
    submitted,
    paymentUrl,
    handleSubmit,
    resetForm
  };
};
