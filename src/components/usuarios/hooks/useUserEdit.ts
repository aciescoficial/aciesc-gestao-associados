
import { useState, useCallback } from 'react';
import { User, UserRole, UserTag } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { mapToDbRole } from '../utils/roleUtils';

export const useUserEdit = (onSuccess: (user: User) => void) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [associados, setAssociados] = useState<Array<{id: string, cpf: string, nome: string, sobrenome: string}>>([]);
  const [empresas, setEmpresas] = useState<Array<{id: string, cnpj: string, nome_fantasia: string}>>([]);
  const [loadingAssociados, setLoadingAssociados] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  const fetchAssociados = useCallback(async () => {
    setLoadingAssociados(true);
    try {
      const { data, error } = await supabase
        .from('associados')
        .select('id, cpf, nome, sobrenome')
        .eq('status', 'ativo');
        
      if (error) throw error;
      setAssociados(data || []);
    } catch (error) {
      console.error("Error fetching associados:", error);
    } finally {
      setLoadingAssociados(false);
    }
  }, []);

  const fetchEmpresas = useCallback(async () => {
    setLoadingEmpresas(true);
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, cnpj, nome_fantasia')
        .eq('status', 'ativo');
        
      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error("Error fetching empresas:", error);
    } finally {
      setLoadingEmpresas(false);
    }
  }, []);

  const handleSelectedUserChange = (field: string, value: any) => {
    if (!selectedUser) return;
    setSelectedUser({ ...selectedUser, [field]: value });
  };

  const updateUser = useCallback(async () => {
    if (!selectedUser) return false;

    try {
      // Update the user's metadata and profile
      const dbRole = mapToDbRole(selectedUser.role as UserRole);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          email: selectedUser.email,
          role: dbRole,
          tags: selectedUser.tags || [],
          active: selectedUser.active,
          associado_id: selectedUser.associado_id,
          empresa_id: selectedUser.empresa_id
        })
        .eq('id', selectedUser.id);

      if (profileError) throw profileError;

      onSuccess(selectedUser);
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  }, [selectedUser, onSuccess]);

  const toggleUserActive = useCallback(async (userId: string, active: boolean) => {
    try {
      // Also update the active status in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ active })
        .eq('id', userId);

      if (profileError) throw profileError;

      return true;
    } catch (error) {
      console.error("Error toggling user active status:", error);
      return false;
    }
  }, []);

  return {
    selectedUser,
    setSelectedUser,
    handleSelectedUserChange,
    updateUser,
    toggleUserActive,
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas
  };
};
