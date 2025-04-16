import { supabase } from '@/integrations/supabase/client';

interface AssociadoPaymentParams {
  associadoInteresseId: string;
  associationTypeId: string;
  email: string;
  nome: string;
  sobrenome: string;
  cpf: string;
}

/**
 * Generate payment for associate based on association type
 */
export const generateAssociadoPayment = async ({
  associadoInteresseId,
  associationTypeId,
  email,
  nome,
  sobrenome,
  cpf
}: AssociadoPaymentParams): Promise<{ paymentUrl: string; paymentId: string }> => {
  try {
    // Get association type details
    const { data: associationType, error: typeError } = await supabase
      .from('association_types')
      .select('*')
      .eq('id', associationTypeId)
      .single();
      
    if (typeError) throw typeError;
    
    // Create payment in Asaas
    const { data, error } = await supabase.functions.invoke('asaas-payment', {
      body: {
        customer: {
          name: `${nome} ${sobrenome}`,
          email,
          cpfCnpj: cpf
        },
        value: associationType.value,
        description: `Associação ACIESC - ${associationType.title}`,
        solicitacaoId: associadoInteresseId
      }
    });

    if (error) throw error;
    
    // Update the interesse record with payment info
    const { error: updateError } = await supabase
      .from('associado_interesse')
      .update({
        pagamento_url: data.invoiceUrl,
        status: 'aprovado'
      })
      .eq('id', associadoInteresseId);
      
    if (updateError) throw updateError;
    
    // Create an entry in pagamentos_associado
    const anoAtual = new Date().getFullYear();
    
    // Once the associado record is created, this payment will be linked
    // But for now, we just store the data for reference
    const { error: paymentError } = await supabase
      .from('pagamentos_associado')
      .insert({
        valor: associationType.value,
        data_pagamento: new Date().toISOString(),
        status: 'pendente',
        metodo: associationType.payment_methods[0] || 'boleto',
        origem: 'asaas',
        descricao: `Associação ACIESC - ${associationType.title}`,
        ano_referencia: anoAtual,
        // associado_id will be updated once the associado record is created
      });
    
    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      // Continue anyway since this is just for record keeping
    }
    
    return {
      paymentUrl: data.invoiceUrl,
      paymentId: data.id
    };
  } catch (error) {
    console.error('Error generating payment:', error);
    throw error;
  }
};

/**
 * Check payment status with payment provider
 */
export const checkPaymentStatus = async (paymentId: string): Promise<{
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
  isPaid: boolean;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('asaas-payment-check', {
      body: {
        paymentId
      }
    });

    if (error) throw error;
    
    // Check if payment is in one of the "paid" statuses
    const isPaid = ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(data.status);
    
    return {
      status: data.status,
      isPaid
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};
