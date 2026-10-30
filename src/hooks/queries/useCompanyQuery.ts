
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaData } from '@/components/empresa/types';
import { CompanySearchFormValues } from '@/components/empresa/components/search/schema';
import { handleError } from '@/utils/errorHandling';

export const useCompanyQuery = (searchParams: CompanySearchFormValues | null, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['companies', searchParams, page, pageSize],
    queryFn: async () => {
      if (!searchParams) return { data: [], count: 0 };

      try {
        let query = supabase
          .from('empresas')
          .select('*', { count: 'exact' });

        if (searchParams.status !== 'todos') {
          query = query.eq('status', searchParams.status);
        }

        if (searchParams.searchTerm && searchParams.searchTerm.trim() !== '') {
          if (searchParams.searchType === 'nome') {
            query = query.or(`nome_fantasia.ilike.%${searchParams.searchTerm}%,razao_social.ilike.%${searchParams.searchTerm}%`);
          } else if (searchParams.searchType === 'cnpj') {
            query = query.ilike('cnpj', `%${searchParams.searchTerm}%`);
          } else if (searchParams.searchType === 'nicho') {
            query = query.ilike('nicho', `%${searchParams.searchTerm}%`);
          }
        }

        // Aplicar paginação
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await query.range(from, to);

        if (error) throw error;

        return { 
          data: data as EmpresaData[], 
          count: count || 0 
        };
      } catch (error) {
        handleError(error, "Ocorreu um erro ao realizar a busca.", "useCompanyQuery");
        return { data: [], count: 0 };
      }
    },
    enabled: !!searchParams,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
