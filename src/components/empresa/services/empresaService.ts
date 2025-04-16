
import { supabase } from "@/integrations/supabase/client";
import { EmpresaData } from "../types";

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
    
    return data || [];
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
    
    if (filters.nicho) {
      query = query.eq('nicho', filters.nicho);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    // Add pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return { 
      data: data || [], 
      count: count || 0
    };
  } catch (error) {
    console.error("Error fetching paginated companies:", error);
    return { data: [], count: 0 };
  }
};
