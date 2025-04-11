
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type ConveniadoStatus = 'pendente' | 'ativo' | 'inativo';

export interface Conveniado {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  telefone: string;
  cidade: string;
  creci?: string;
  placa_principal?: string;
  placa_secundaria?: string;
  status: ConveniadoStatus;
  created_at: string;
}

export const useConveniadoSearch = () => {
  const [conveniados, setConveniados] = useState<Conveniado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConveniadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState<string>('');
  const [cidades, setCidades] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  const fetchCidades = async () => {
    try {
      // Using associados table since conveniados table seems to be missing
      const { data, error } = await supabase
        .from('associados')
        .select('cidade')
        .order('cidade');
      
      if (error) throw error;
      
      // Type assertion to safely use the data
      const associadosData = data as Array<{ cidade: string }> || [];
      const uniqueCidades = Array.from(new Set(associadosData.map(item => item.cidade)));
      setCidades(uniqueCidades);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchConveniados = async () => {
    setLoading(true);
    try {
      // Using associados table as a temporary replacement for conveniados
      let query = supabase
        .from('associados')
        .select('*', { count: 'exact' });

      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter as ConveniadoStatus);
      }
      
      if (cidadeFilter) {
        query = query.eq('cidade', cidadeFilter);
      }

      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%,creci.ilike.%${searchTerm}%`);
      }

      if (itemsPerPage !== -1) {
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        query = query
          .order('created_at', { ascending: false })
          .range(from, to);
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setConveniados((data || []) as Conveniado[]);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching conveniados:', error);
      toast({
        title: 'Erro ao carregar conveniados',
        description: 'Não foi possível carregar a lista de conveniados.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConveniados();
  }, [currentPage, statusFilter, cidadeFilter, itemsPerPage]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchConveniados();
  };

  return {
    conveniados,
    loading,
    searchTerm,
    setSearchTerm,
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
    fetchConveniados
  };
};
