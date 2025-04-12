
import { supabase } from '@/integrations/supabase/client';

export interface CarteirinhaConfig { 
  fee: number, 
  paymentGateway: 'asaas' | 'stripe',
  graficaEndereco: string,
  aciescEndereco: string,
  permiteRetirada: boolean,
  permiteEntrega: boolean
}

export async function getCarteirinhaConfig(): Promise<CarteirinhaConfig> {
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

export async function updateCarteirinhaConfig(config: Partial<CarteirinhaConfig>): Promise<void> {
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
