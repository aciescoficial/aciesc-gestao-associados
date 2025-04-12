
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { AssociadoFormData, StatusType } from '../types';
import { logOperation } from '@/components/audit/auditLogService';

/**
 * Create and update operations for associados
 */

export const saveAssociado = async (data: AssociadoFormData) => {
  try {
    const associadoData = {
      nome: data.nome,
      sobrenome: data.sobrenome,
      telefone: data.celular,
      email: data.email,
      cidade: data.cidade,
      cpf: data.cpf,
      creci: data.creci || null,
      data_nascimento: data.dataNascimento || null,
      rua: data.rua || null,
      numero: data.numero || null,
      complemento: data.complemento || null,
      bairro: data.bairro || null,
      estado: data.estado || null,
      cep: data.cep || null,
      placa_principal: data.placaPrincipal || null,
      placa_secundaria: data.placaSecundaria || null,
      valor_pago: data.valorPago || null,
      data_ultimo_pagamento: data.dataUltimoPagamento || null,
      valor_devido: data.valorDevido || null,
      tipo_pagamento: data.tipoPagamento || null,
      tipo_associado: data.tipoAssociado || null,
      validade: data.validade || null,
      status: 'pendente' as StatusType
    };
    
    const { data: associadoResult, error } = await supabase
      .from('associados')
      .insert(associadoData)
      .select('id')
      .single();
      
    if (error) {
      console.error("Supabase error details:", error);
      throw error;
    }
    
    // Log the manual creation of an associate
    await logOperation({
      eventType: 'create',
      entityType: 'associado',
      details: `Associado ${data.nome} ${data.sobrenome} (CPF: ${data.cpf}) cadastrado manualmente`,
      recordCount: 1
    });
    
    return associadoResult;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao salvar associado:", errorMsg);
    throw error;
  }
};
