
import { supabase } from '@/integrations/supabase/client';
import { AssociadoInteresse } from '../types/associadoInteresse';

interface GetInteressesOptions {
  status?: string;
  searchTerm?: string;
  searchField?: 'nome' | 'email';
}

/**
 * Get associado interests with optional filtering
 */
export async function getAssociadoInteresses(options: GetInteressesOptions = {}): Promise<AssociadoInteresse[]> {
  const { status = 'pendente', searchTerm, searchField } = options;
  
  let query = supabase
    .from('associado_interesse')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Only filter by status if it's not "todos"
  if (status !== 'todos') {
    query = query.eq('status', status);
  }
  
  // Apply search filter if provided
  if (searchTerm && searchField) {
    if (searchField === 'nome') {
      // Search in both nome and sobrenome
      query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
    } else if (searchField === 'email') {
      query = query.ilike('email', `%${searchTerm}%`);
    }
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Ensure the data matches the AssociadoInteresse type
  return (data || []) as AssociadoInteresse[];
}

/**
 * Update interest status (approve/reject)
 */
export async function updateInterestStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('associado_interesse')
    .update({ status })
    .eq('id', id);
  
  if (error) throw error;
}
