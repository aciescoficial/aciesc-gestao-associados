
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAssociatedEntities = () => {
  const [associados, setAssociados] = useState<Array<{id: string, cpf: string, nome: string, sobrenome: string}>>([]);
  const [empresas, setEmpresas] = useState<Array<{id: string, cnpj: string, nome_fantasia: string}>>([]);
  const [loadingAssociados, setLoadingAssociados] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  const fetchAssociados = useCallback(async () => {
    setLoadingAssociados(true);
    try {
      // Fetch only associates without linked users
      const { data, error } = await supabase
        .from('associados')
        .select(`
          id, 
          cpf, 
          nome, 
          sobrenome,
          user!left (id)
        `)
        .eq('status', 'ativo')
        .is('user.id', null);
        
      if (error) throw error;

      // Filter out associates that already have users
      const availableAssociados = data?.filter(associado => !associado.user) || [];
      setAssociados(availableAssociados.map(({ user, ...rest }) => rest));
    } catch (error) {
      console.error("Error fetching associados:", error);
    } finally {
      setLoadingAssociados(false);
    }
  }, []);

  const fetchEmpresas = useCallback(async () => {
    setLoadingEmpresas(true);
    try {
      // Fetch only companies without linked users
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          id, 
          cnpj, 
          nome_fantasia,
          user!left (id)
        `)
        .eq('status', 'ativo')
        .is('user.id', null);
        
      if (error) throw error;

      // Filter out companies that already have users
      const availableEmpresas = data?.filter(empresa => !empresa.user) || [];
      setEmpresas(availableEmpresas.map(({ user, ...rest }) => rest));
    } catch (error) {
      console.error("Error fetching empresas:", error);
    } finally {
      setLoadingEmpresas(false);
    }
  }, []);

  return {
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas
  };
};
