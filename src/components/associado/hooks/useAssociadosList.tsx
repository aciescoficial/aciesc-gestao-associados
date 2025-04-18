
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AssociadoStatus } from '../types';

export interface AssociadoListItem {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  rg?: string;
  email: string;
  telefone: string;
  cidade: string;
  creci?: string;
  placa_principal?: string;
  placa_secundaria?: string;
  status: AssociadoStatus;
  created_at: string;
}

type SearchType = 'nome' | 'cpf' | 'creci' | 'placa';

export const useAssociadosList = () => {
  const [associados, setAssociados] = useState<AssociadoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('nome');
  const [statusFilter, setStatusFilter] = useState<AssociadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState<string>('todas');
  const [cidades, setCidades] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  // Fetch available cities for filter dropdown
  const fetchCidades = async () => {
    try {
      const { data, error } = await supabase
        .from('associados')
        .select('cidade')
        .order('cidade');
      
      if (error) throw error;
      
      const cidadesData = data as Array<{ cidade: string }> || [];
      const uniqueCidades = Array.from(new Set(cidadesData.map(item => item.cidade)));
      setCidades(uniqueCidades);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchAssociados = async () => {
    setLoading(true);
    try {
      // Build the query with filters
      let query = supabase
        .from('associados')
        .select('*', { count: 'exact' });

      // Apply status filter if not 'todos'
      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter as AssociadoStatus);
      }
      
      // Apply city filter if provided and not 'todas'
      if (cidadeFilter !== 'todas') {
        query = query.eq('cidade', cidadeFilter);
      }

      // Apply search term filter if provided
      if (searchTerm) {
        if (searchType === 'nome') {
          query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
        } else if (searchType === 'cpf') {
          query = query.ilike('cpf', `%${searchTerm}%`);
        } else if (searchType === 'creci') {
          query = query.ilike('creci', `%${searchTerm}%`);
        } else if (searchType === 'placa') {
          // Add search by vehicle plate
          query = query.or(`placa_principal.ilike.%${searchTerm}%,placa_secundaria.ilike.%${searchTerm}%`);
        }
      }

      // Add pagination if not showing all
      if (itemsPerPage !== -1) {
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        query = query
          .order('created_at', { ascending: false })
          .range(from, to);
      } else {
        // If showing all, just order them
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setAssociados((data || []) as AssociadoListItem[]);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching associados:', error);
      toast({
        title: 'Erro ao carregar associados',
        description: 'Não foi possível carregar a lista de associados.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociados();
  }, [currentPage, statusFilter, cidadeFilter, itemsPerPage]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchAssociados();
  };

  return {
    associados,
    loading,
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    statusFilter,
    setStatusFilter,
    cidadeFilter,
    setCidadeFilter,
    cidades,
    currentPage,
    setCurrentPage,
    totalCount,
    itemsPerPage,
    setItemsPerPage,
    handleSearch,
    fetchAssociados
  };
};
