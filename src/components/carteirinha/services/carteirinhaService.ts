
import { supabase } from '@/integrations/supabase/client';
import { CarteirinhaSolicitacao } from '../types';

export async function createCarteirinhaSolicitacao(data: Omit<CarteirinhaSolicitacao, 'id' | 'created_at' | 'updated_at'>): Promise<CarteirinhaSolicitacao> {
  const { data: result, error } = await supabase
    .from('carteirinha_solicitacoes')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

export async function getCarteirinhaSolicitacoes(options: { 
  status?: string,
  associado_id?: string,
  page?: number, 
  pageSize?: number 
} = {}): Promise<{ solicitacoes: CarteirinhaSolicitacao[], count: number }> {
  const { status, associado_id, page = 1, pageSize = 10 } = options;
  
  let query = supabase
    .from('carteirinha_solicitacoes')
    .select('*', { count: 'exact' });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (associado_id) {
    query = query.eq('associado_id', associado_id);
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  const { data, error, count } = await query
    .range(start, end)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return { 
    solicitacoes: data as CarteirinhaSolicitacao[], 
    count: count || 0 
  };
}

export async function updateCarteirinhaSolicitacao(id: string, data: Partial<CarteirinhaSolicitacao>): Promise<CarteirinhaSolicitacao> {
  const { data: result, error } = await supabase
    .from('carteirinha_solicitacoes')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

export async function getCarteirinhaConfig(): Promise<{ 
  fee: number, 
  paymentGateway: 'asaas' | 'stripe',
  graficaEndereco: string,
  aciescEndereco: string,
  permiteRetirada: boolean,
  permiteEntrega: boolean
}> {
  const { data, error } = await supabase
    .from('system_config')
    .select('*')
    .in('key', [
      'ID_CARD_FEE', 
      'PAYMENT_GATEWAY',
      'GRAFICA_ENDERECO',
      'ACIESC_ENDERECO',
      'PERMITE_RETIRADA',
      'PERMITE_ENTREGA'
    ]);
    
  if (error) throw error;
  
  const feeConfig = data?.find(item => item.key === 'ID_CARD_FEE');
  const gatewayConfig = data?.find(item => item.key === 'PAYMENT_GATEWAY');
  const graficaConfig = data?.find(item => item.key === 'GRAFICA_ENDERECO');
  const aciescConfig = data?.find(item => item.key === 'ACIESC_ENDERECO');
  const permiteRetiradaConfig = data?.find(item => item.key === 'PERMITE_RETIRADA');
  const permiteEntregaConfig = data?.find(item => item.key === 'PERMITE_ENTREGA');
  
  return {
    fee: feeConfig ? parseFloat(feeConfig.value) : 15.00,
    paymentGateway: (gatewayConfig?.value as 'asaas' | 'stripe') || 'asaas',
    graficaEndereco: graficaConfig?.value || 'Rua das Impressões, 123',
    aciescEndereco: aciescConfig?.value || 'Avenida Principal, 456',
    permiteRetirada: permiteRetiradaConfig ? permiteRetiradaConfig.value === 'true' : true,
    permiteEntrega: permiteEntregaConfig ? permiteEntregaConfig.value === 'true' : true
  };
}

export async function updateCarteirinhaConfig(config: { 
  fee?: number, 
  paymentGateway?: 'asaas' | 'stripe',
  graficaEndereco?: string,
  aciescEndereco?: string,
  permiteRetirada?: boolean,
  permiteEntrega?: boolean
}): Promise<void> {
  const { 
    fee, 
    paymentGateway,
    graficaEndereco,
    aciescEndereco,
    permiteRetirada,
    permiteEntrega
  } = config;
  
  // Prepare updates array
  const updates = [];
  
  if (fee !== undefined) {
    updates.push({ key: 'ID_CARD_FEE', value: fee.toString() });
  }
  
  if (paymentGateway) {
    updates.push({ key: 'PAYMENT_GATEWAY', value: paymentGateway });
  }
  
  if (graficaEndereco !== undefined) {
    updates.push({ key: 'GRAFICA_ENDERECO', value: graficaEndereco });
  }
  
  if (aciescEndereco !== undefined) {
    updates.push({ key: 'ACIESC_ENDERECO', value: aciescEndereco });
  }
  
  if (permiteRetirada !== undefined) {
    updates.push({ key: 'PERMITE_RETIRADA', value: permiteRetirada.toString() });
  }
  
  if (permiteEntrega !== undefined) {
    updates.push({ key: 'PERMITE_ENTREGA', value: permiteEntrega.toString() });
  }
  
  if (updates.length > 0) {
    await supabase
      .from('system_config')
      .upsert(updates);
  }
}

export async function verifyCarteirinhaPayment(solicitacaoId: string): Promise<{ paid: boolean, status: string }> {
  try {
    const { data, error } = await supabase
      .from('carteirinha_solicitacoes')
      .select('status, pagamento_id')
      .eq('id', solicitacaoId)
      .single();
    
    if (error) throw error;
    
    // Check if status is already indicating payment (or free pickup)
    if (data.status === 'aguardando_producao' || 
        data.status === 'em_producao' || 
        data.status === 'pronta_entrega' || 
        data.status === 'concluida') {
      return { paid: true, status: data.status };
    }
    
    // If there's a payment ID, check with the payment gateway
    if (data.pagamento_id) {
      // Get the payment gateway first
      const { data: configData } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'PAYMENT_GATEWAY')
        .single();
      
      const paymentGateway = configData?.value || 'asaas';
      
      if (paymentGateway === 'asaas') {
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('asaas-payment-check', {
          body: { paymentId: data.pagamento_id }
        });
        
        if (paymentError) throw paymentError;
        
        // If payment is confirmed, update the status
        if (paymentData.status === 'CONFIRMED' || paymentData.status === 'RECEIVED') {
          await updateCarteirinhaSolicitacao(solicitacaoId, {
            status: 'aguardando_producao'
          });
          
          return { paid: true, status: 'aguardando_producao' };
        }
      } else if (paymentGateway === 'stripe') {
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('stripe-payment-check', {
          body: { sessionId: data.pagamento_id }
        });
        
        if (paymentError) throw paymentError;
        
        // If payment is paid, update the status
        if (paymentData.status === 'paid') {
          await updateCarteirinhaSolicitacao(solicitacaoId, {
            status: 'aguardando_producao'
          });
          
          return { paid: true, status: 'aguardando_producao' };
        }
      }
    }
    
    return { paid: false, status: data.status };
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    throw error;
  }
}
