
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { AssociadoFormData, ImportAssociadoData, StatusType } from './types';
import { useToast } from '@/hooks/use-toast';
import { logOperation } from '@/components/audit/auditLogService';

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

export const uploadFoto = async (id: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}.${fileExt}`;
    
    // Verificar se o bucket existe
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    let bucketExists = false;
    if (buckets) {
      bucketExists = buckets.some(bucket => bucket.name === 'associados');
    }
    
    // Criar bucket se não existir
    if (!bucketExists) {
      await supabase
        .storage
        .createBucket('associados', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
        });
    }
    
    const { error } = await supabase
      .storage
      .from('associados')
      .upload(fileName, file, {
        upsert: true
      });
      
    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
    
    // Get public URL
    const { data: publicUrl } = supabase
      .storage
      .from('associados')
      .getPublicUrl(fileName);
      
    return publicUrl.publicUrl;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao fazer upload da foto:", errorMsg);
    throw error;
  }
};

export const importAssociados = async (data: ImportAssociadoData[]) => {
  try {
    const associados = data.map(item => ({
      nome: item.nome,
      sobrenome: item.sobrenome,
      cpf: item.cpf,
      creci: item.creci || null,
      email: item.email,
      telefone: item.celular,
      cidade: item.cidade || '',
      placa_principal: item.placaPrincipal || null,
      placa_secundaria: item.placaSecundaria || null,
      data_nascimento: item.dataNascimento || null,
      validade: item.validade || null,
      rua: item.rua || null,
      numero: item.numero || null,
      complemento: item.complemento || null,
      bairro: item.bairro || null,
      estado: item.estado || null,
      cep: item.cep || null,
      valor_pago: item.valorPago || null,
      data_ultimo_pagamento: item.dataUltimoPagamento || null,
      valor_devido: item.valorDevido || null,
      tipo_pagamento: item.tipoPagamento || null,
      tipo_associado: item.tipoAssociado || null,
      status: 'pendente' as StatusType
    }));
    
    // Inserir em lotes de 100 para evitar problemas com limites de tamanho
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < associados.length; i += batchSize) {
      const batch = associados.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('associados')
        .insert(batch);
        
      if (error) {
        throw error;
      }
      
      insertedCount += batch.length;
    }
    
    return insertedCount;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao importar associados:", errorMsg);
    throw error;
  }
};

export const exportAssociados = async () => {
  try {
    const { data: associados, error } = await supabase
      .from('associados')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return associados;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao exportar associados:", errorMsg);
    throw error;
  }
};

export const getAssociadoById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('associados')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error(`Erro ao buscar associado com ID ${id}:`, errorMsg);
    throw error;
  }
};
