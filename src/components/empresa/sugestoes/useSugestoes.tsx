
import { useEffect, useState } from 'react';
import { empresaSugestoesService, EmpresaSugestao } from '../services/empresaSugestoesService';
import { useToast } from '@/hooks/use-toast';

export const useSugestoes = (itemsPerPage: number = 5) => {
  const [sugestoes, setSugestoes] = useState<EmpresaSugestao[]>([]);
  const [filteredSugestoes, setFilteredSugestoes] = useState<EmpresaSugestao[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSugestoes = async () => {
    try {
      setIsLoading(true);
      const { data, count } = await empresaSugestoesService.listSugestoes(currentPage, itemsPerPage);
      setSugestoes(data);
      setFilteredSugestoes(data);
      setTotalPages(Math.ceil(count / itemsPerPage));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: 'Erro ao carregar sugestões',
        description: 'Não foi possível carregar a lista de sugestões',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSugestoes();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (searchTerm || selectedDate) {
      let filtered = [...sugestoes];
      
      if (searchTerm) {
        filtered = filtered.filter(
          (sugestao) =>
            sugestao.nome_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sugestao.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sugestao.cidade.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedDate) {
        filtered = filtered.filter(sugestao => {
          // Convert Supabase timestamp to YYYY-MM-DD for comparison
          const createdDate = new Date(sugestao.created_at).toISOString().split('T')[0];
          return createdDate === selectedDate;
        });
      }
      
      setFilteredSugestoes(filtered);
      setCurrentPage(1);
    } else {
      setFilteredSugestoes(sugestoes);
    }
  }, [searchTerm, selectedDate, sugestoes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await empresaSugestoesService.updateStatus(id, newStatus);
      await fetchSugestoes();
      toast({
        title: 'Status atualizado',
        description: 'O status da sugestão foi atualizado com sucesso',
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Não foi possível atualizar o status da sugestão',
        variant: 'destructive',
      });
    }
  };

  return {
    searchTerm,
    selectedDate,
    currentPage,
    currentItems: filteredSugestoes,
    filteredSugestoes,
    totalPages,
    isLoading,
    handleSearch,
    setSelectedDate,
    setCurrentPage,
    handleStatusUpdate
  };
};
