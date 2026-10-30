import { supabase } from '@/integrations/supabase/client';
import { checkPaymentStatus } from './associadoPaymentService';
import { logOperation } from '@/components/audit/services/logOperationService';

/**
 * Verifica o status de um pagamento específico
 * @param pagamentoId ID do pagamento a ser verificado
 * @returns Resultado da verificação
 */
export const verificarStatusPagamento = async (
  pagamentoId: string
): Promise<{ success: boolean; isPaid: boolean; message: string }> => {
  try {
    // 1. Buscar dados do pagamento
    const { data: pagamento, error } = await supabase
      .from('pagamentos_associado')
      .select('*, associado:associado_id(*)')
      .eq('id', pagamentoId)
      .single();
      
    if (error) {
      console.error('Erro ao buscar dados do pagamento:', error);
      return { success: false, isPaid: false, message: `Erro ao buscar pagamento: ${error.message}` };
    }
    
    if (!pagamento) {
      return { success: false, isPaid: false, message: 'Pagamento não encontrado' };
    }
    
    // 2. Verificar status via API de pagamento
    if (pagamento.origem === 'asaas' && pagamento.origem) {
      try {
        // Usamos o campo origem para armazenar o ID do pagamento
        const paymentId = pagamento.origem; 
        const statusResult = await checkPaymentStatus(paymentId);
        const isPaid = statusResult.isPaid;
        
        // 3. Atualizar status do pagamento
        if (isPaid && pagamento.status !== 'pago') {
          await supabase
            .from('pagamentos_associado')
            .update({ 
              status: 'pago', 
              data_confirmacao: new Date().toISOString() 
            })
            .eq('id', pagamentoId);
          
          // 4. Atualizar status do associado se necessário
          if (pagamento.associado && pagamento.associado.status === 'pendente') {
            await supabase
              .from('associados')
              .update({ 
                status: 'ativo',
                data_ultimo_pagamento: new Date().toISOString(),
                validade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
              })
              .eq('id', pagamento.associado_id);
            
            // 5. Log da operação
            await logOperation({
              eventType: 'payment_confirmed',
              entityType: 'pagamento',
              details: `Pagamento ${pagamento.id} confirmado. Associado ${pagamento.associado_id} ativado.`,
              recordCount: 1
            });
          }
          
          return { 
            success: true, 
            isPaid: true, 
            message: 'Pagamento confirmado e status atualizado com sucesso!' 
          };
        }
        
        return { 
          success: true, 
          isPaid: statusResult.isPaid, 
          message: `Status do pagamento: ${statusResult.status}` 
        };
      } catch (apiError: any) {
        console.error('Erro na API de pagamento:', apiError);
        return { 
          success: false, 
          isPaid: false, 
          message: `Erro ao verificar status via API: ${apiError.message}` 
        };
      }
    } else if (pagamento.origem === 'stripe' && pagamento.origem) {
      // Implementar verificação via Stripe
      try {
        // Usamos o campo origem para armazenar o ID do pagamento
        const sessionId = pagamento.origem;
        
        const { data: resultadoVerificacao, error: verificacaoError } = await supabase.functions.invoke('stripe-payment-check', {
          body: {
            sessionId: sessionId
          }
        });
        
        if (verificacaoError) {
          throw verificacaoError;
        }
        
        const isPaid = resultadoVerificacao.status === 'paid';
        
        // Atualizar status do pagamento
        if (isPaid && pagamento.status !== 'pago') {
          await supabase
            .from('pagamentos_associado')
            .update({ 
              status: 'pago', 
              data_confirmacao: new Date().toISOString() 
            })
            .eq('id', pagamentoId);
          
          // Atualizar status do associado se necessário
          if (pagamento.associado && pagamento.associado.status === 'pendente') {
            await supabase
              .from('associados')
              .update({ 
                status: 'ativo',
                data_ultimo_pagamento: new Date().toISOString(),
                validade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
              })
              .eq('id', pagamento.associado_id);
            
            await logOperation({
              eventType: 'payment_confirmed',
              entityType: 'pagamento',
              details: `Pagamento Stripe ${pagamento.id} confirmado. Associado ${pagamento.associado_id} ativado.`,
              recordCount: 1
            });
          }
          
          return { 
            success: true, 
            isPaid: true, 
            message: 'Pagamento confirmado e status atualizado com sucesso!' 
          };
        }
        
        return { 
          success: true, 
          isPaid: isPaid, 
          message: `Status do pagamento: ${resultadoVerificacao.status}` 
        };
        
      } catch (stripeError: any) {
        console.error('Erro na verificação do Stripe:', stripeError);
        return { 
          success: false, 
          isPaid: false, 
          message: `Erro ao verificar status via Stripe: ${stripeError.message}` 
        };
      }
    }
    
    return { 
      success: false, 
      isPaid: false, 
      message: 'Não foi possível verificar o pagamento: método de pagamento não suportado' 
    };
  } catch (error: any) {
    console.error('Erro na verificação de pagamento:', error);
    return { 
      success: false, 
      isPaid: false, 
      message: `Erro inesperado: ${error.message}` 
    };
  }
};

/**
 * Verifica todos os pagamentos pendentes
 * @returns Resultado da verificação em massa
 */
export const verificarTodosPagamentosPendentes = async (): Promise<{
  success: boolean;
  total: number;
  atualizados: number;
  message: string;
}> => {
  try {
    // 1. Buscar todos os pagamentos pendentes
    const { data: pagamentosPendentes, error } = await supabase
      .from('pagamentos_associado')
      .select('id')
      .eq('status', 'pendente');
      
    if (error) {
      throw error;
    }
    
    const total = pagamentosPendentes?.length || 0;
    let atualizados = 0;
    
    // 2. Verificar cada pagamento
    for (const pagamento of pagamentosPendentes || []) {
      const resultado = await verificarStatusPagamento(pagamento.id);
      if (resultado.isPaid) {
        atualizados++;
      }
    }
    
    return {
      success: true,
      total,
      atualizados,
      message: `Verificação concluída. ${atualizados} de ${total} pagamentos foram confirmados.`
    };
  } catch (error: any) {
    console.error('Erro na verificação em massa:', error);
    return {
      success: false,
      total: 0,
      atualizados: 0,
      message: `Erro na verificação: ${error.message}`
    };
  }
};

export const pagamentoVerificacaoService = {
  verificarStatusPagamento,
  verificarTodosPagamentosPendentes
};
