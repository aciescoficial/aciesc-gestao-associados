
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { CarteirinhaSolicitacao, CarteirinhaStatus } from '../types';

const PAGE_SIZE = 10;

export function useSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<CarteirinhaSolicitacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast } = useToast();

  const fetchSolicitacoes = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Calcula os índices para paginação
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      // Constrói a query com filtros - usando type casting para contornar erros de tipo
      let query = (supabase
        .from('carteirinha_solicitacoes') as any)
        .select('*', { count: 'exact' });
      
      // Aplica filtro de status se selecionado
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      // Aplica filtro de busca se preenchido
      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
      }
      
      // Aplica range para paginação
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      // Atualiza os estados e aplica casting seguro
      if (data) {
        setSolicitacoes(data as unknown as CarteirinhaSolicitacao[]);
      }
      
      if (count !== null) {
        setTotalCount(count);
        setTotalPages(Math.ceil(count / PAGE_SIZE));
      }
    } catch (error: any) {
      console.error('Erro ao carregar solicitações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as solicitações de carteirinha.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, toast]);
  
  // Carrega as solicitações quando os filtros ou página mudam
  useEffect(() => {
    fetchSolicitacoes();
  }, [fetchSolicitacoes]);

  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handler para busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Volta para a primeira página ao realizar uma busca
    fetchSolicitacoes();
  };

  // Handler para atualização de status
  const updateSolicitacao = async (id: string, data: Partial<CarteirinhaSolicitacao>): Promise<boolean> => {
    try {
      // Usa type casting para contornar erros de tipo no Supabase
      const { error } = await (supabase
        .from('carteirinha_solicitacoes') as any)
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualiza a lista de solicitações
      await fetchSolicitacoes();
      
      toast({
        title: 'Sucesso',
        description: 'Solicitação atualizada com sucesso.',
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar solicitação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a solicitação.',
        variant: 'destructive',
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
