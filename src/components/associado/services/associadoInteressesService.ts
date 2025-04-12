
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
  // including the payment_proof_url property which might be in the interface
  return data?.map(item => ({
    ...item,
    // Add any required properties from AssociadoInteresse that might be missing
    payment_proof_url: null, // Add this property if it's required by the interface
    ...((item as any).payment_proof_url ? { payment_proof_url: (item as any).payment_proof_url } : {})
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
