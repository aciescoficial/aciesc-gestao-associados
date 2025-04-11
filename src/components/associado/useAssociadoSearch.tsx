
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Associado, AssociadoStatus } from './AssociadoSearchResult';

export const useAssociadoSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cpf' | 'creci'>('nome');
  const [statusFilter, setStatusFilter] = useState<AssociadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState<string>('todas');
  const [cidades, setCidades] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Associado[]>([]);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Campo de busca vazio",
        description: "Por favor, insira um termo para realizar a busca.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      let query = supabase.from('associados').select('*');
      
      if (searchType === 'nome') {
        query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
      } else if (searchType === 'cpf') {
        query = query.ilike('cpf', `%${searchTerm}%`);
      } else if (searchType === 'creci') {
        query = query.ilike('creci', `%${searchTerm}%`);
      }
      
      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter as AssociadoStatus);
      }
      
      if (cidadeFilter !== 'todas') {
        query = query.eq('cidade', cidadeFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;

      if (!data || data.length === 0) {
        setResults([]);
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontrados associados com os critérios informados.",
        });
        return;
      }
      
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
    handleSearch
  };
};
