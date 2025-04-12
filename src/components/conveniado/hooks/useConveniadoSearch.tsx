
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type ConveniadoStatus = 'ativo' | 'pendente' | 'inativo';

interface Conveniado {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  telefone: string;
  creci?: string;
  cidade: string;
  status: ConveniadoStatus;
  placa_principal?: string;
  placa_secundaria?: string;
  created_at: string;
}

export const useConveniadoSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConveniadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState('todas');
  const [cidades, setCidades] = useState<string[]>([]);
  const [conveniados, setConveniados] = useState<Conveniado[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchCidades = async () => {
    try {
      const { data, error } = await supabase
        .from('conveniados')
        .select('cidade')
        .order('cidade');
      
      if (error) throw error;
      
      const conveniadosData = data as { cidade: string }[];
      const uniqueCidades = Array.from(new Set(conveniadosData.map(item => item.cidade)))
        .filter(city => city) // Filter out null/undefined
        .sort();
      
      setCidades(uniqueCidades);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchConveniados = async () => {
    setLoading(true);
    
    try {
      let query = supabase.from('conveniados').select('*', { count: 'exact' });
      
      // Apply search term filter if provided
      if (searchTerm.trim()) {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%,creci.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%,placa_principal.ilike.%${searchTerm}%,placa_secundaria.ilike.%${searchTerm}%`);
      }
      
      // Apply status filter if not 'todos'
      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply city filter if not 'todas'
      if (cidadeFilter !== 'todas') {
        query = query.eq('cidade', cidadeFilter);
      }
      
      // Add pagination if itemsPerPage is not -1 (which means "show all")
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
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchConveniados();
  };

  useEffect(() => {
    fetchConveniados();
  }, [currentPage, itemsPerPage, statusFilter, cidadeFilter]);

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
