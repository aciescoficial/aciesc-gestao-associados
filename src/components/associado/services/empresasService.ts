
import { supabase } from '@/integrations/supabase/client';

export interface EmpresaConveniada {
  id: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  cidade: string;
  desconto: string;
  nicho: string;
  logo_url?: string;
  created_at: string;
}

// Função para buscar as últimas empresas cadastradas
export const buscarUltimasEmpresas = async (limite: number = 3): Promise<EmpresaConveniada[]> => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('id, nome_fantasia, razao_social, cnpj, cidade, desconto, nicho, logo_url, created_at')
      .eq('status', 'ativo')
      .order('created_at', { ascending: false })
      .limit(limite);
      
    if (error) throw error;
    return data as EmpresaConveniada[];
  } catch (error) {
    console.error('Erro ao buscar últimas empresas:', error);
    return [];
  }
};

// Função para listar todas as empresas com paginação
export const listarEmpresasConveniadas = async (
  pagina: number = 1,
  itensPorPagina: number = 10
): Promise<{ dados: EmpresaConveniada[], total: number }> => {
  try {
    // Calcular o início da paginação
    const inicio = (pagina - 1) * itensPorPagina;
    
    // Buscar o total para calcular paginação
    const { count: total, error: countError } = await supabase
      .from('empresas')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'ativo');
      
    if (countError) throw countError;
    
    // Buscar os registros paginados
    const { data, error } = await supabase
      .from('empresas')
      .select('id, nome_fantasia, razao_social, cnpj, cidade, desconto, nicho, logo_url, created_at')
      .eq('status', 'ativo')
      .order('nome_fantasia', { ascending: true })
      .range(inicio, inicio + itensPorPagina - 1);
      
    if (error) throw error;
    
    return {
      dados: data as EmpresaConveniada[],
      total: total || 0
    };
    
  } catch (error) {
    console.error('Erro ao listar empresas conveniadas:', error);
    return { dados: [], total: 0 };
  }
};
