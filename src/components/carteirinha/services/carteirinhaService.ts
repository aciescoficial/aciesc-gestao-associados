
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

export async function getCarteirinhaConfig(): Promise<{ fee: number, paymentGateway: 'asaas' | 'stripe' }> {
  const { data, error } = await supabase
    .from('system_config')
    .select('*')
    .in('key', ['ID_CARD_FEE', 'PAYMENT_GATEWAY']);
    
  if (error) throw error;
  
  const feeConfig = data?.find(item => item.key === 'ID_CARD_FEE');
  const gatewayConfig = data?.find(item => item.key === 'PAYMENT_GATEWAY');
  
  return {
    fee: feeConfig ? parseFloat(feeConfig.value) : 15.00,
    paymentGateway: (gatewayConfig?.value as 'asaas' | 'stripe') || 'asaas'
  };
}

export async function updateCarteirinhaConfig(config: { fee?: number, paymentGateway?: 'asaas' | 'stripe' }): Promise<void> {
  const { fee, paymentGateway } = config;
  
  if (fee !== undefined) {
    await supabase
      .from('system_config')
      .upsert({ key: 'ID_CARD_FEE', value: fee.toString() })
      .eq('key', 'ID_CARD_FEE');
  }
  
  if (paymentGateway) {
    await supabase
      .from('system_config')
      .upsert({ key: 'PAYMENT_GATEWAY', value: paymentGateway })
      .eq('key', 'PAYMENT_GATEWAY');
  }
}
