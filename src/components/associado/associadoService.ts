
import { supabase } from "@/integrations/supabase/client";
import { AssociadoFormData, ImportAssociadoData, StatusType } from './types';

export const saveAssociado = async (data: AssociadoFormData) => {
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
  
  // Use type assertion to tell TypeScript this is a valid table
  const { data: associadoResult, error } = await supabase
    .from('associados' as any)
    .insert(associadoData)
    .select('id')
    .single();
    
  if (error) {
    console.error("Supabase error details:", error);
    throw error;
  }
  
  return associadoResult;
};

export const uploadFoto = async (id: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${id}.${fileExt}`;
  
  const { error } = await supabase
    .storage
    .from('associados')
    .upload(fileName, file);
    
  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const importAssociados = async (data: ImportAssociadoData[]) => {
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
  
  // Use type assertion to tell TypeScript this is a valid table
  const { error } = await supabase
    .from('associados' as any)
    .insert(associados);
    
  if (error) {
    throw error;
  }
  
  return associados.length;
};

export const exportAssociados = async () => {
  // Use type assertion to tell TypeScript this is a valid table
  const { data: associados, error } = await supabase
    .from('associados' as any)
    .select('*');
    
  if (error) throw error;
  
  return associados;
};
