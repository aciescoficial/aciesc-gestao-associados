
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CarteirinhaSolicitacao } from '../types';

interface UseSolicitacoesProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export function useSolicitacoes({ initialPage = 1, itemsPerPage = 10 }: UseSolicitacoesProps = {}) {
  const [solicitacoes, setSolicitacoes] = useState<CarteirinhaSolicitacao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { toast } = useToast();
  
  const fetchSolicitacoes = async () => {
    try {
      setIsLoading(true);
      
      // Calculate pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      // Build the query
      let query = supabase
        .from('carteirinha_solicitacoes')
        .select(`
          *,
          associados (email)
        `, { count: 'exact' }) as any;
      
      // Apply filters if provided
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination and order
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      const { data, count, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match our format
      const formattedData = data?.map((item: any) => ({
        ...item,
        email: item.associados?.email
      }));
      
      setSolicitacoes(formattedData as CarteirinhaSolicitacao[] || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as solicitações de carteirinha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, [currentPage, statusFilter]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setCurrentPage(1); // Reset to first page on new search
    fetchSolicitacoes();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const updateSolicitacao = async (id: string, data: Partial<CarteirinhaSolicitacao>) => {
    try {
      const { error } = await supabase
        .from('carteirinha_solicitacoes')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id) as any;
      
      if (error) throw error;
      
      toast({
        title: "Solicitação atualizada",
        description: "Os dados da solicitação foram atualizados com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a solicitação.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    solicitacoes,
    isLoading,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleSearch,
    handlePageChange,
    updateSolicitacao,
    fetchSolicitacoes
  };
}
