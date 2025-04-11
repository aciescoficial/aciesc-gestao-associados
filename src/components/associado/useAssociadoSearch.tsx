
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Associado, AssociadoStatus } from './types';

export const useAssociadoSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cpf' | 'creci'>('nome');
  const [statusFilter, setStatusFilter] = useState<AssociadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState<string>('todas');
  const [cidades, setCidades] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Associado[]>([]);
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
        .from('associados')
        .select('cidade')
        .order('cidade');
      
      if (error) throw error;
      
      const associadosData = data as { cidade: string }[];
      const uniqueCidades = Array.from(new Set(associadosData.map(item => item.cidade) || []));
      setCidades(uniqueCidades);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchAssociados = async (isSearchAction: boolean = false) => {
    // If it's a new search action, reset to page 1
    if (isSearchAction) {
      setCurrentPage(1);
    }

    setIsSearching(true);
    
    try {
      let query = supabase.from('associados').select('*', { count: 'exact' });
      
      // Apply search term if specified
      if (searchTerm.trim()) {
        if (searchType === 'nome') {
          query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
        } else if (searchType === 'cpf') {
          query = query.ilike('cpf', `%${searchTerm}%`);
        } else if (searchType === 'creci') {
          query = query.ilike('creci', `%${searchTerm}%`);
        }
      }
      
      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter as AssociadoStatus);
      }
      
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

      if (!data || data.length === 0) {
        setResults([]);
        if (searchTerm.trim()) {  // Only show toast if there was a search term
          toast({
            title: "Nenhum resultado encontrado",
            description: "Não foram encontrados associados com os critérios informados.",
          });
        }
        return;
      }
      
      setTotalCount(count || 0);
      
      // Now fetch profile information for avatar URLs
      const associadoIds = data.map(item => item.id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .in('id', associadoIds);
        
      if (profilesError) throw profilesError;
      
      // Map the data to include profile avatar_url
      const associadosWithAvatars = data.map(associado => {
        const profile = profilesData?.find(p => p.id === associado.id);
        return {
          ...associado,
          avatar_url: profile?.avatar_url || null
        } as Associado;
      });
      
      setResults(associadosWithAvatars);
      
    } catch (error) {
      console.error('Error searching associados:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchAssociados(true);
  };

  // Fetch associados when filters or pagination changes
  useEffect(() => {
    fetchAssociados();
  }, [currentPage, itemsPerPage]);

  return {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    statusFilter,
    setStatusFilter,
    cidadeFilter,
    setCidadeFilter,
    cidades,
    isSearching,
    results,
    handleSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalCount,
    fetchAssociados
  };
};
