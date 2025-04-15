
import { supabase } from '@/integrations/supabase/client';
import { Empresa } from '../types/empresa';

/**
 * Get list of partnered companies (empresas conveniadas)
 */
export const getEmpresasConveniadas = async (): Promise<Empresa[]> => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('status', 'ativo')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Empresa[];
  } catch (error) {
    console.error('Error fetching empresas conveniadas:', error);
    throw error;
  }
};

/**
 * Get details of a specific empresa
 */
export const getEmpresaDetails = async (id: string): Promise<Empresa | null> => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as Empresa;
  } catch (error) {
    console.error('Error fetching empresa details:', error);
    throw error;
  }
};
