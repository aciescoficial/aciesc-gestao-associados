
import { supabase } from '@/integrations/supabase/client';
import { generateAssociadoPayment } from './associadoPaymentService';
import { emailNotificationService } from '@/components/comunicacao/services/emailNotificationService';
import { logOperation } from '@/components/audit/services/logOperationService';

/**
 * Cria uma nova cobrança de renovação para um associado
 * @param associadoId ID do associado
 * @returns Resultado da operação
 */
export const criarCobrancaRenovacao = async (
  associadoId: string
): Promise<{ success: boolean; message: string; paymentUrl?: string }> => {
  try {
    // 1. Buscar dados do associado
    const { data: associado, error: errorAssociado } = await supabase
      .from('associados')
      .select('*')
      .eq('id', associadoId)
      .single();
      
    if (errorAssociado || !associado) {
      console.error('Erro ao buscar dados do associado:', errorAssociado);
      return { 
        success: false, 
        message: `Associado não encontrado: ${errorAssociado?.message || 'ID inválido'}` 
      };
    }
    
    // 2. Buscar tipo de associação (placeholder, deve ser melhorado para buscar o tipo específico)
    const associationTypeId = '11111111-1111-1111-1111-111111111111'; // Placeholder
    
    // 3. Gerar link de pagamento
    try {
      const paymentResult = await generateAssociadoPayment({
        associadoInteresseId: associado.id, // Usando ID do associado como referência
        associationTypeId: associationTypeId,
        email: associado.email,
        nome: associado.nome,
        sobrenome: associado.sobrenome,
        cpf: associado.cpf
      });
      
      // 4. Criar registro de pagamento para o ano seguinte
      const dataVencimento = new Date();
      // Se já tiver uma validade definida, usa ela como base para definir o próximo vencimento
      if (associado.validade) {
        dataVencimento.setTime(new Date(associado.validade).getTime());
      } else {
        // Caso não tenha data de validade, usa 1 ano a partir de agora
        dataVencimento.setFullYear(dataVencimento.getFullYear() + 1);
      }
      
      const anoReferencia = dataVencimento.getFullYear();
      
      // Verificar se já existe uma cobrança para este período
      const { data: cobrancaExistente, error: errorCobranca } = await supabase
        .from('pagamentos_associado')
        .select('id')
        .eq('associado_id', associadoId)
        .eq('ano_referencia', anoReferencia)
        .maybeSingle();
        
      if (errorCobranca) {
        console.warn('Erro ao verificar cobranças existentes:', errorCobranca);
      }
      
      // Se já existir uma cobrança, apenas retorna a URL de pagamento
      if (cobrancaExistente) {
        return {
          success: true,
          message: 'Uma cobrança para este período já existe. Link de pagamento gerado.',
          paymentUrl: paymentResult.paymentUrl
        };
      }
      
      // 5. Registrar o pagamento pendente no banco
      const { error: errorPagamento } = await supabase
        .from('pagamentos_associado')
        .insert({
          associado_id: associadoId,
          valor: 150.00, // Placeholder - deve ser obtido do tipo de associação
          data_pagamento: new Date().toISOString(),
          status: 'pendente',
          metodo: 'boleto',
          origem: 'asaas',
          origem_id: paymentResult.paymentId,
          descricao: `Renovação associação ACIESC - ${anoReferencia}`,
          ano_referencia: anoReferencia
        });
      
      if (errorPagamento) {
        console.error('Erro ao registrar pagamento:', errorPagamento);
        return {
          success: false,
          message: `Erro ao registrar pagamento: ${errorPagamento.message}`
        };
      }
      
      // 6. Log da operação
      await logOperation({
        eventType: 'renewal_created',
        entityType: 'pagamento',
        details: `Criada cobrança de renovação para o associado ${associado.nome} ${associado.sobrenome} (${anoReferencia})`,
        recordCount: 1
      });
      
      return {
        success: true,
        message: 'Cobrança de renovação criada com sucesso!',
        paymentUrl: paymentResult.paymentUrl
      };
    } catch (paymentError: any) {
      console.error('Erro ao gerar pagamento:', paymentError);
      return {
        success: false,
        message: `Erro ao gerar link de pagamento: ${paymentError.message}`
      };
    }
  } catch (error: any) {
    console.error('Erro ao criar cobrança de renovação:', error);
    return {
      success: false,
      message: `Erro inesperado: ${error.message}`
    };
  }
};

/**
 * Verifica associados próximos do vencimento e envia lembretes
 * @param diasAntecedencia Quantidade de dias antes do vencimento para enviar lembretes
 * @returns Resultado da operação
 */
export const enviarLembretesRenovacao = async (
  diasAntecedencia: number = 30
): Promise<{ success: boolean; enviados: number; message: string }> => {
  try {
    // 1. Calcular data limite para vencimento
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() + diasAntecedencia);
    
    // 2. Buscar associados com vencimento próximo
    const { data: associadosParaRenovar, error } = await supabase
      .from('associados')
      .select('id, nome, sobrenome, email, validade')
      .eq('status', 'ativo')
      .lte('validade', dataLimite.toISOString())
      .gte('validade', hoje.toISOString());
      
    if (error) {
      console.error('Erro ao buscar associados para renovação:', error);
      return {
        success: false,
        enviados: 0,
        message: `Erro na consulta: ${error.message}`
      };
    }
    
    if (!associadosParaRenovar || associadosParaRenovar.length === 0) {
      return {
        success: true,
        enviados: 0,
        message: 'Nenhum associado encontrado para renovação no período especificado.'
      };
    }
    
    // 3. Processar cada associado
    let enviados = 0;
    
    for (const associado of associadosParaRenovar) {
      try {
        // Criar cobrança de renovação
        const cobrancaResult = await criarCobrancaRenovacao(associado.id);
        
        if (cobrancaResult.success && cobrancaResult.paymentUrl) {
          // Enviar email de lembrete
          const emailResult = await emailNotificationService.enviarLembretePagamento(
            associado.email,
            associado.nome,
            cobrancaResult.paymentUrl,
            associado.validade
          );
          
          if (emailResult.success) {
            enviados++;
          } else {
            console.error(`Erro ao enviar email para ${associado.email}:`, emailResult.message);
          }
        } else {
          console.error(`Erro ao criar cobrança para ${associado.email}:`, cobrancaResult.message);
        }
      } catch (associadoError: any) {
        console.error(`Erro ao processar associado ${associado.id}:`, associadoError);
        // Continua para o próximo associado
      }
    }
    
    // 4. Log da operação
    await logOperation({
      eventType: 'renewal_reminders_sent',
      entityType: 'associado',
      details: `Enviados ${enviados} lembretes de renovação de associação`,
      recordCount: enviados
    });
    
    return {
      success: true,
      enviados,
      message: `Enviados ${enviados} lembretes de ${associadosParaRenovar.length} associados elegíveis.`
    };
  } catch (error: any) {
    console.error('Erro ao enviar lembretes de renovação:', error);
    return {
      success: false,
      enviados: 0,
      message: `Erro inesperado: ${error.message}`
    };
  }
};

/**
 * Exporta as funções de gerenciamento de renovações
 */
export const renovacaoService = {
  criarCobrancaRenovacao,
  enviarLembretesRenovacao
};
