
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { getAssociadoInteresses, updateInterestStatus } from '../services/associadoInteressesService';

export const useAprovacaoInteresse = () => {
  const [interesses, setInteresses] = useState<AssociadoInteresse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchPendingInterests = async () => {
    try {
      setIsLoading(true);
      const data = await getAssociadoInteresses();
      setInteresses(data);
    } catch (error) {
      console.error('Error fetching pending interests:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os interesses pendentes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPendingInterests();
    }
  }, [isAdmin]);

  const handleApprove = async (id: string, email: string, nome: string, sobrenome: string) => {
    try {
      await updateInterestStatus(id, 'aprovado');
      
      // Generate a signup token valid for 7 days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      const token = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      
      // Save the token to database
      const { error: tokenError } = await supabase
        .from('signup_tokens')
        .insert({
          associado_interesse_id: id,
          token,
          expires_at: expiresAt.toISOString(),
          used: false
        });
      
      if (tokenError) {
        throw tokenError;
      }
      
      // Update local state
      setInteresses(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Interesse aprovado',
        description: `Uma notificação foi enviada para ${nome} ${sobrenome} com instruções para cadastro.`,
      });
    } catch (error) {
      console.error('Error approving interest:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao aprovar o interesse. Tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      await updateInterestStatus(id, 'rejeitado');
      
      // Update local state
      setInteresses(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Interesse rejeitado',
        description: 'O interesse foi rejeitado com sucesso.',
      });
    } catch (error) {
      console.error('Error rejecting interest:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao rejeitar o interesse. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return {
    interesses,
    isLoading,
    isAdmin,
    fetchPendingInterests,
    handleApprove,
    handleReject
  };
};
