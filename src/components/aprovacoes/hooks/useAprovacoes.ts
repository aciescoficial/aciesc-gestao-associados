
import { useState, useEffect } from 'react';
import { useLoadingState } from '@/hooks/useLoadingState';
import { PendenteData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAprovacoes = () => {
  const [pendentes, setPendentes] = useState<PendenteData[]>([]);
  const [statusFilter, setStatusFilter] = useState<'pendente' | 'ativo' | 'inativo' | 'todos'>('pendente');
  const { isLoading, withLoading } = useLoadingState();

  const fetchPendentes = async () => {
    return withLoading(async () => {
      try {
        // Create base queries with status filters if not 'todos'
        let empresasQuery = supabase.from('empresas').select('*');
        let associadosQuery = supabase.from('associados').select('*');
        
        // Apply status filter if not showing all
        if (statusFilter !== 'todos') {
          empresasQuery = empresasQuery.eq('status', statusFilter);
          associadosQuery = associadosQuery.eq('status', statusFilter);
        }
        
        // Execute both queries in parallel
        const [empresasResponse, associadosResponse] = await Promise.all([
          empresasQuery,
          associadosQuery
        ]);

        if (empresasResponse.error) {
          console.error("Error fetching empresas:", empresasResponse.error);
          throw empresasResponse.error;
        }

        if (associadosResponse.error) {
          console.error("Error fetching associados:", associadosResponse.error);
          throw associadosResponse.error;
        }

        // Format empresas data
        const formattedEmpresas: PendenteData[] = (empresasResponse.data || []).map(empresa => ({
          id: empresa.id,
          tipo: 'empresa',
          nome: empresa.nome_fantasia || empresa.razao_social,
          documento: empresa.cnpj,
          dataCadastro: empresa.created_at,
          email: empresa.email,
          telefone: empresa.telefone,
          status: empresa.status
        }));

        // Format associados data
        const formattedAssociados: PendenteData[] = (associadosResponse.data || []).map(associado => ({
          id: associado.id,
          tipo: 'associado',
          nome: `${associado.nome} ${associado.sobrenome}`,
          documento: associado.cpf,
          dataCadastro: associado.created_at,
          email: associado.email,
          telefone: associado.telefone,
          status: associado.status
        }));

        // Combine and sort by creation date
        const allPendentes = [...formattedEmpresas, ...formattedAssociados]
          .sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());

        setPendentes(allPendentes);
        return allPendentes;
      } catch (error) {
        console.error("Error in fetchPendentes:", error);
        setPendentes([]);
        throw error;
      }
    }, "Erro ao carregar aprovações");
  };

  useEffect(() => {
    fetchPendentes();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    await withLoading(async () => {
      const pendente = pendentes.find(p => p.id === id);
      if (!pendente) {
        throw new Error("Item não encontrado");
      }

      let error = null;
      
      if (pendente.tipo === 'empresa') {
        const { error: updateError } = await supabase
          .from('empresas')
          .update({ status: 'ativo' })
          .eq('id', id);
          
        error = updateError;
      } else if (pendente.tipo === 'associado') {
        const { error: updateError } = await supabase
          .from('associados')
          .update({ status: 'ativo' })
          .eq('id', id);
          
        error = updateError;
      }

      if (error) {
        console.error(`Error approving ${pendente.tipo}:`, error);
        toast({
          title: "Erro na aprovação",
          description: `Não foi possível aprovar ${pendente.tipo}: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Aprovado com sucesso",
        description: `${pendente.tipo === 'empresa' ? 'Empresa' : 'Associado'} aprovado com sucesso!`,
        variant: "default"
      });

      // Update local state and refresh data
      await fetchPendentes();
    }, "Erro ao aprovar cadastro");
  };

  const handleReject = async (id: string) => {
    await withLoading(async () => {
      const pendente = pendentes.find(p => p.id === id);
      if (!pendente) {
        throw new Error("Item não encontrado");
      }

      let error = null;
      
      if (pendente.tipo === 'empresa') {
        const { error: updateError } = await supabase
          .from('empresas')
          .update({ status: 'inativo' })
          .eq('id', id);
          
        error = updateError;
      } else if (pendente.tipo === 'associado') {
        const { error: updateError } = await supabase
          .from('associados')
          .update({ status: 'inativo' })
          .eq('id', id);
          
        error = updateError;
      }

      if (error) {
        console.error(`Error rejecting ${pendente.tipo}:`, error);
        toast({
          title: "Erro na rejeição",
          description: `Não foi possível rejeitar ${pendente.tipo}: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }
      
      toast({
        title: "Rejeitado com sucesso",
        description: `${pendente.tipo === 'empresa' ? 'Empresa' : 'Associado'} rejeitado com sucesso!`,
        variant: "default"
      });

      // Update local state and refresh data
      await fetchPendentes();
    }, "Erro ao rejeitar cadastro");
  };

  return {
    pendentes,
    isLoading,
    handleApprove,
    handleReject,
    fetchPendentes,
    statusFilter,
    setStatusFilter
  };
};
