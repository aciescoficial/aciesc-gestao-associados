
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaData } from '@/components/empresa/types';
import { CompanySearchFormValues } from '@/components/empresa/components/search/schema';
import { handleError } from '@/utils/errorHandling';

interface UseUnifiedCompanySearchProps {
  initialFilters?: Partial<CompanySearchFormValues>;
  pageSize?: number;
}

export const useUnifiedCompanySearch = ({ 
  initialFilters = {},
  pageSize = 10 
}: UseUnifiedCompanySearchProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const searchCompanies = async (params: CompanySearchFormValues, page: number = 1) => {
    console.log('Searching with params:', params, 'page:', page);
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('empresas')
        .select('*', { count: 'exact' });

      // Apply status filter
      if (params.status !== 'todos') {
        query = query.eq('status', params.status);
      }

      // Apply search filters
      if (params.searchTerm && params.searchTerm.trim() !== '') {
        if (params.searchType === 'nome') {
          query = query.or(`nome_fantasia.ilike.%${params.searchTerm}%,razao_social.ilike.%${params.searchTerm}%`);
        } else if (params.searchType === 'cnpj') {
          query = query.ilike('cnpj', `%${params.searchTerm}%`);
        } else if (params.searchType === 'nicho') {
          query = query.ilike('nicho', `%${params.searchTerm}%`);
        }
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setResults(data || []);
      setTotalCount(count || 0);
      setCurrentPage(page);

      if ((data || []).length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Tente outros termos de busca.",
        });
      }
    } catch (error) {
      handleError(error, "Ocorreu um erro ao realizar a busca.", "searchCompanies");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setResults([]);
    setTotalCount(0);
    setCurrentPage(1);
  };

  const refreshResults = () => {
    if (results.length > 0) {
      searchCompanies({ ...initialFilters } as CompanySearchFormValues, currentPage);
    }
  };

  return {
    isLoading,
    results,
    totalCount,
    currentPage,
    pageSize,
    searchCompanies,
    resetSearch,
    refreshResults
  };
};
