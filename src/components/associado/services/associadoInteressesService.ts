
import { supabase } from '@/integrations/supabase/client';
import { AssociadoInteresse } from '../AprovacaoInteresse';

/**
 * Get all pending associado interests
 */
export async function getAssociadoInteresses(): Promise<AssociadoInteresse[]> {
  const { data, error } = await supabase
    .from('associado_interesse')
    .select('*')
    .eq('status', 'pendente')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Map the data to ensure it conforms to AssociadoInteresse type
  // including the payment_proof_url property which was missing
  return data?.map(item => ({
    ...item,
    payment_proof_url: item.payment_proof_url || null
  })) || [];
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
