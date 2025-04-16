import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { EmpresaFormData } from '../EmpresaForm';
import { EmpresaData } from '../types';
import { mapToEmpresaData, mapToEmpresaFormData } from '../utils/dataTransformers';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

/**
 * Get latest registered companies
 */
export const getLatestCompanies = async (limit: number = 3): Promise<EmpresaData[]> => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data ? data.map(mapToEmpresaData) : [];
  } catch (error) {
    console.error("Error fetching latest companies:", error);
    return [];
  }
};

/**
 * Get all companies with pagination
 */
export const getCompaniesPaginated = async (
  page: number = 1,
  pageSize: number = 10, 
  filters: {
    searchTerm?: string;
    cidade?: string;
    nicho?: string;
    status?: string;
  } = {}
): Promise<{ data: EmpresaData[]; count: number }> => {
  try {
    // Create query
    let query = supabase
      .from('empresas')
      .select('*', { count: 'exact' });
    
    // Apply filters if available
    if (filters.searchTerm) {
      query = query.or(`nome_fantasia.ilike.%${filters.searchTerm}%,razao_social.ilike.%${filters.searchTerm}%,cnpj.ilike.%${filters.searchTerm}%`);
    }
    
    if (filters.cidade) {
      query = query.eq('cidade', filters.cidade);
    }
    
    if (filters.nicho && filters.nicho !== 'todos') {
      query = query.eq('nicho', filters.nicho as NichoType);
    }
    
    if (filters.status && filters.status !== 'todos') {
      query = query.eq('status', filters.status as StatusType);
    }
    
    // Add pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return { 
      data: data ? data.map(mapToEmpresaData) : [], 
      count: count || 0
    };
  } catch (error) {
    console.error("Error fetching paginated companies:", error);
    return { data: [], count: 0 };
  }
};

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

/**
 * Update the status of a company
 */
export async function updateEmpresaStatus(empresaId: string, status: 'ativo' | 'pendente' | 'inativo'): Promise<boolean> {
  const { error } = await supabase
    .from('empresas')
    .update({ status })
    .eq('id', empresaId);
  
  if (error) {
    console.error('Error updating company status:', error);
    throw error;
  }
  
  return true;
}

/**
 * Fetch companies with pending status
 */
export async function fetchPendingEmpresas() {
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('status', 'pendente')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching pending companies:', error);
    throw error;
  }
  
  return data || [];
}
