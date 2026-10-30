
import { supabase } from '@/integrations/supabase/client';
import { AssociadoInteresse } from '../types/associadoInteresse';

interface GetInteressesOptions {
  status?: string;
  searchTerm?: string;
  searchField?: 'nome' | 'email';
}

export async function getAssociadoInteresses(options: GetInteressesOptions = {}): Promise<AssociadoInteresse[]> {
  const { status = 'pendente', searchTerm, searchField } = options;
  
  try {
    console.log('Starting to fetch interests with options:', options);
    
    let query = supabase
      .from('associado_interesse')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('Initial query created');
    
    if (status !== 'todos') {
      console.log('Applying status filter:', status);
      query = query.eq('status', status);
    }
    
    if (searchTerm && searchField) {
      console.log('Applying search filter:', { searchField, searchTerm });
      if (searchField === 'nome') {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
      } else if (searchField === 'email') {
        query = query.ilike('email', `%${searchTerm}%`);
      }
    }
    
    console.log('Executing query...');
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching interests:', error);
      throw error;
    }

    console.log('Query successful. Raw data:', data);
    
    if (!data || data.length === 0) {
      console.log('No data returned from query');
      return [];
    }

    // Map database response to our interface type
    const mappedData: AssociadoInteresse[] = data.map(item => ({
      id: item.id,
      nome: item.nome,
      sobrenome: item.sobrenome,
      cpf: item.cpf,
      email: item.email,
      celular: item.celular,
      cidade: item.cidade,
      estado: item.estado,
      creci: item.creci,
      motivo_interesse: item.motivo_interesse,
      motivo_rejeicao: null, // Default to null if not present
      status: item.status as 'pendente' | 'aprovado' | 'rejeitado',
      created_at: item.created_at,
      updated_at: item.updated_at,
      pagamento_url: item.pagamento_url,
      pagamento_confirmado: item.pagamento_confirmado || false,
      pagamento_data: item.pagamento_data,
      payment_proof_url: null // Default to null if not present
    }));

    console.log('Data mapped successfully. Returning:', mappedData);
    return mappedData;
    
  } catch (error) {
    console.error('Critical error in getAssociadoInteresses:', error);
    throw error;
  }
}

