
import { useState } from 'react';
import { getAssociadoInteresses } from '../services/associadoInteressesService';
import { useToast } from '@/hooks/use-toast';
import { AssociadoInteresse } from '../types/associadoInteresse';

export const useSearchInteresse = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pendente');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchField, setSearchField] = useState<'nome' | 'email'>('nome');
  const { toast } = useToast();

  const fetchInteresses = async () => {
    try {
      console.log('Fetching interests...');
      setIsLoading(true);
      
      const data = await getAssociadoInteresses({
        status: statusFilter,
        searchTerm: searchTerm.trim() || undefined,
        searchField: searchTerm.trim() ? searchField : undefined
      });
      
      console.log('Successfully fetched interests:', data);
      return data;
      
    } catch (error: any) {
      console.error('Error fetching interests:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: error.message || 'Não foi possível carregar os interesses.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    fetchInteresses,
  };
};
