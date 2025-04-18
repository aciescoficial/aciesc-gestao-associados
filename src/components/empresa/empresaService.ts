import { supabase } from '@/integrations/supabase/client';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { EmpresaData } from './types';

// Fetch all pending companies
export const fetchPendingEmpresas = async () => {
  console.log("Fetching pending empresas");
  
  try {
    // Explicitly log the query we're about to execute
    console.log("Executing query: SELECT * FROM empresas WHERE status = 'pendente' ORDER BY created_at DESC");
    
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('status', 'pendente')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching pending empresas:", error);
      throw error;
    }
    
    console.log("Fetched pending empresas:", data?.length || 0, "items");
    console.log("First item sample (if available):", data && data.length > 0 ? data[0] : "No data");
    
    return data || [];
  } catch (error) {
    console.error("Exception fetching pending empresas:", error);
    throw error;
  }
};

// Update company status (approve or reject)
export const updateEmpresaStatus = async (id: string, status: 'ativo' | 'inativo') => {
  try {
    console.log(`Updating empresa ${id} status to ${status}`);
    
    const { error } = await supabase
      .from('empresas')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating empresa status:", error);
      throw error;
    }
    
    console.log(`Successfully updated empresa ${id} status to ${status}`);
    return true;
  } catch (error) {
    console.error("Exception updating empresa status:", error);
    throw error;
  }
};

// Get paginated companies for the listing view
export const getCompaniesPaginated = async (
  page: number = 1,
  pageSize: number = 10,
  filters: { searchTerm?: string } = {}
) => {
  try {
    let query = supabase
      .from('empresas')
      .select('*', { count: 'exact' });
    
    // Apply search filter if provided
    if (filters.searchTerm) {
      query = query.or(
        `nome_fantasia.ilike.%${filters.searchTerm}%,` +
        `razao_social.ilike.%${filters.searchTerm}%,` +
        `cnpj.ilike.%${filters.searchTerm}%`
      );
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    console.error("Error fetching paginated companies:", error);
    throw error;
  }
};

// Other empresa service functions can be added here...
