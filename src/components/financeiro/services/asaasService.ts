
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, AssociationType } from '../types';

interface AsaasPaymentLinkResponse {
  id: string;
  url: string;
}

export const generatePaymentLink = async (associationType: AssociationType): Promise<string> => {
  try {
    // Default to the first payment method if multiple are available
    const billingType = mapToBillingType(associationType.payment_methods[0]);
    
    const { data, error } = await supabase.functions.invoke('asaas-integration', {
      body: {
        path: 'create-payment-link',
        name: `Associação ACIESC - ${associationType.title}`,
        description: associationType.description || `Pagamento para ${associationType.title}`,
        value: associationType.value,
        billingType: billingType,
        chargeType: associationType.max_installments && associationType.max_installments > 1 ? 'INSTALLMENT' : 'DETACHED',
        dueDateLimitDays: 5,
        maxInstallmentCount: associationType.max_installments || 1
      }
    });

    if (error) {
      console.error('Error generating payment link:', error);
      throw new Error(`Erro ao gerar link de pagamento: ${error.message}`);
    }

    return data.url;
  } catch (error) {
    console.error('Error calling Asaas API:', error);
    throw error;
  }
};

export const generateSubscriptionLink = async (associationType: AssociationType): Promise<string> => {
  try {
    const billingType = mapToBillingType(associationType.payment_methods[0]);
    
    const { data, error } = await supabase.functions.invoke('asaas-integration', {
      body: {
        path: 'create-payment-link',
        name: `Assinatura ACIESC - ${associationType.title}`,
        description: associationType.description || `Assinatura para ${associationType.title}`,
        value: associationType.value,
        billingType: billingType,
        chargeType: 'RECURRENT',
        subscriptionCycle: 'MONTHLY'
      }
    });

    if (error) {
      console.error('Error generating subscription link:', error);
      throw new Error(`Erro ao gerar link de assinatura: ${error.message}`);
    }

    return data.url;
  } catch (error) {
    console.error('Error calling Asaas API:', error);
    throw error;
  }
};

// Map our payment method types to Asaas billing types
const mapToBillingType = (paymentMethod: PaymentMethod): string => {
  switch (paymentMethod) {
    case 'cartao':
      return 'CREDIT_CARD';
    case 'pix':
      return 'PIX';
    case 'boleto':
      return 'BOLETO';
    default:
      return 'UNDEFINED';
  }
};
