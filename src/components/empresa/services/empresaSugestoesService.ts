
import { supabase } from '@/integrations/supabase/client';

export interface EmpresaSugestao {
  id: string;
  nome_empresa: string;
  cidade: string;
  estado: string;
  telefone: string;
  instagram?: string;
  site?: string;
  contato: string;
  motivo: string;
  produtos: string;
  status: string;
  created_at: string;
}

export const empresaSugestoesService = {
  async createSugestao(data: Omit<EmpresaSugestao, 'id' | 'status' | 'created_at'>) {
    const { data: sugestao, error } = await supabase
      .from('empresa_sugestoes')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return sugestao;
  },

  async listSugestoes(page: number = 1, pageSize: number = 10) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('empresa_sugestoes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('empresa_sugestoes')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }
};
