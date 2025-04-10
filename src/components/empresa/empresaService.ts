
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { EmpresaFormData } from './EmpresaForm';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

export interface ImportEmpresaData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  nicho: NichoType;
  desconto: string;
  produtos: string;
  logoUrl?: string;
  capaUrl?: string;
  videoUrl?: string;
}

export const saveEmpresa = async (data: EmpresaFormData) => {
  const empresaData = {
    razao_social: data.razaoSocial,
    nome_fantasia: data.nomeFantasia,
    cnpj: data.cnpj,
    responsavel: data.responsavel,
    telefone: data.telefone,
    email: data.email,
    endereco: data.endereco,
    cidade: data.cidade,
    cep: data.cep,
    site: data.site || null,
    instagram: data.instagram || null,
    whatsapp: data.whatsapp || null,
    nicho: data.nicho,
    desconto: data.desconto,
    produtos: data.produtos,
    logo_url: data.logoUrl || null,
    capa_url: data.capaUrl || null,
    video_url: data.videoUrl || null,
    status: 'pendente' as StatusType
  };
  
  const { data: empresaResult, error } = await supabase
    .from('empresas')
    .insert(empresaData)
    .select('id')
    .single();
    
  if (error) {
    console.error("Supabase error details:", error);
    throw error;
  }
  
  return empresaResult;
};

export const importEmpresas = async (data: ImportEmpresaData[]) => {
  const empresas = data.map(item => ({
    razao_social: item.razaoSocial,
    nome_fantasia: item.nomeFantasia,
    cnpj: item.cnpj,
    responsavel: item.responsavel,
    telefone: item.telefone,
    email: item.email,
    endereco: item.endereco,
    cidade: item.cidade,
    cep: item.cep,
    site: item.site || null,
    instagram: item.instagram || null,
    whatsapp: item.whatsapp || null,
    nicho: item.nicho,
    desconto: item.desconto,
    produtos: item.produtos,
    logo_url: item.logoUrl || null,
    capa_url: item.capaUrl || null,
    video_url: item.videoUrl || null,
    status: 'pendente' as StatusType
  }));
  
  const { error } = await supabase
    .from('empresas')
    .insert(empresas);
    
  if (error) {
    throw error;
  }
  
  return empresas.length;
};

export const exportEmpresas = async () => {
  const { data: empresas, error } = await supabase
    .from('empresas')
    .select('*');
    
  if (error) throw error;
  
  return empresas;
};

export const getEmpresaById = async (id: string) => {
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  
  return data;
};

export const updateEmpresa = async (id: string, data: Partial<EmpresaFormData>) => {
  const updateData: any = {};
  
  // Map form data to database schema
  if (data.razaoSocial !== undefined) updateData.razao_social = data.razaoSocial;
  if (data.nomeFantasia !== undefined) updateData.nome_fantasia = data.nomeFantasia;
  if (data.cnpj !== undefined) updateData.cnpj = data.cnpj;
  if (data.responsavel !== undefined) updateData.responsavel = data.responsavel;
  if (data.telefone !== undefined) updateData.telefone = data.telefone;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.endereco !== undefined) updateData.endereco = data.endereco;
  if (data.cidade !== undefined) updateData.cidade = data.cidade;
  if (data.cep !== undefined) updateData.cep = data.cep;
  if (data.site !== undefined) updateData.site = data.site || null;
  if (data.instagram !== undefined) updateData.instagram = data.instagram || null;
  if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp || null;
  if (data.nicho !== undefined) updateData.nicho = data.nicho;
  if (data.desconto !== undefined) updateData.desconto = data.desconto;
  if (data.produtos !== undefined) updateData.produtos = data.produtos;
  if (data.logoUrl !== undefined) updateData.logo_url = data.logoUrl || null;
  if (data.capaUrl !== undefined) updateData.capa_url = data.capaUrl || null;
  if (data.videoUrl !== undefined) updateData.video_url = data.videoUrl || null;
  
  const { data: result, error } = await supabase
    .from('empresas')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return result;
};
