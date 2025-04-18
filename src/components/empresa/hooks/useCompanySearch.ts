
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaData } from '../types';

interface SearchParams {
  searchTerm: string;
  searchType: 'nome' | 'cnpj' | 'nicho';
  status: 'ativo' | 'inativo' | 'todos';
}

export const useCompanySearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const { toast } = useToast();

  const searchCompanies = async (params: SearchParams) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('empresas')
        .select('*');

      // Apply status filter
      if (params.status !== 'todos') {
        query = query.eq('status', params.status);
      }

      // Apply search filters
      if (params.searchTerm) {
        if (params.searchType === 'nome') {
          query = query.or(`nome_fantasia.ilike.%${params.searchTerm}%,razao_social.ilike.%${params.searchTerm}%`);
        } else if (params.searchType === 'cnpj') {
          query = query.ilike('cnpj', `%${params.searchTerm}%`);
        } else if (params.searchType === 'nicho') {
          query = query.ilike('nicho', `%${params.searchTerm}%`);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      setResults(data || []);

      if ((data || []).length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Tente outros termos de busca.",
        });
      }
    } catch (error: any) {
      console.error('Error searching companies:', error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    results,
    searchCompanies
  };
};
