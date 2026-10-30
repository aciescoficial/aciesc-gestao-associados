
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { getAssociadoInteresses } from '../services/associadoInteressesService';

export const useInteresseSearch = () => {
  const [interessados, setInteressados] = useState<AssociadoInteresse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'nome' | 'email'>('nome');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadInteressados = async () => {
    setLoading(true);
    try {
      const data = await getAssociadoInteresses({ 
        status: 'pendente',
        searchTerm,
        searchField
      });
      setInteressados(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar interessados',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadInteressados();
  };

  return {
    interessados,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    loading,
    handleSearch,
    loadInteressados
  };
};
