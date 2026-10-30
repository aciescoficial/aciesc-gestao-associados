
import { useState, useCallback } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserEdit = (onSuccess: (user: User) => void) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [associados, setAssociados] = useState<Array<{id: string, cpf: string, nome: string, sobrenome: string}>>([]);
  const [empresas, setEmpresas] = useState<Array<{id: string, cnpj: string, nome_fantasia: string}>>([]);
  const [loadingAssociados, setLoadingAssociados] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const { toast } = useToast();
  
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

  const handleSelectedUserChange = useCallback((field: string, value: any) => {
    setSelectedUser(prev => {
      if (!prev) return prev;
      
      // Special logic for when we're changing the role
      if (field === 'role') {
        const currentTags = prev.tags || [];
        let newTags = [...currentTags];
        
        // If changing to admin role, remove diretoria_aciesc tag if present
        if (value === 'admin' && currentTags.includes('diretoria_aciesc')) {
          newTags = currentTags.filter(tag => tag !== 'diretoria_aciesc');
          return {
            ...prev,
            [field]: value,
            tags: newTags
          };
        }
        
        // If changing to diretoria role, add diretoria_aciesc tag if not present
        if (value === 'diretoria' && !currentTags.includes('diretoria_aciesc')) {
          newTags = [...currentTags, 'diretoria_aciesc'];
          return {
            ...prev,
            [field]: value,
            tags: newTags
          };
        }
      }
      
      // Special logic for tags
      if (field === 'tags' && Array.isArray(value)) {
        const hasDiretoriaTag = value.includes('diretoria_aciesc');
        const currentRole = prev.role;
        
        // If adding diretoria tag, set role to 'diretoria'
        if (hasDiretoriaTag && currentRole !== 'diretoria') {
          return {
            ...prev,
            [field]: value,
            role: 'diretoria' as UserRole
          };
        }
        
        // If removing diretoria tag and role is diretoria, adjust role based on admin tag
        if (!hasDiretoriaTag && currentRole === 'diretoria') {
          // If has administrador tag, set to admin
          if (value.includes('administrador')) {
            return {
              ...prev,
              [field]: value,
              role: 'admin' as UserRole
            };
          } else if (prev.empresa_id) {
            return {
              ...prev,
              [field]: value,
              role: 'empresa' as UserRole
            };
          } else {
            return {
              ...prev,
              [field]: value,
              role: 'user' as UserRole
            };
          }
        }
      }
      
      // For any other field, just update normally
      return { ...prev, [field]: value };
    });
  }, []);

  const updateUser = useCallback(async () => {
    if (!selectedUser) return false;
    
    try {
      console.log("Updating user:", selectedUser);
      
      // Ensure role and tags are consistent
      let roleToUpdate = selectedUser.role;
      let tagsToUpdate = selectedUser.tags || [];
      
      const hasDiretoriaTag = tagsToUpdate.includes('diretoria_aciesc');
      const hasAdminTag = tagsToUpdate.includes('administrador');
      
      // Make sure role and tags are in sync
      if (roleToUpdate === 'admin' && hasDiretoriaTag) {
        // Admin role cannot have diretoria_aciesc tag
        tagsToUpdate = tagsToUpdate.filter(tag => tag !== 'diretoria_aciesc');
      } else if (roleToUpdate === 'diretoria' && !hasDiretoriaTag) {
        // Diretoria role must have diretoria_aciesc tag
        tagsToUpdate = [...tagsToUpdate, 'diretoria_aciesc'];
      } else if (roleToUpdate !== 'diretoria' && hasDiretoriaTag) {
        // If has diretoria tag but not diretoria role, change role
        roleToUpdate = 'diretoria';
      } else if (roleToUpdate === 'diretoria' && !hasDiretoriaTag) {
        // If role is diretoria but no tag, adjust role based on associations
        if (hasAdminTag) {
          roleToUpdate = 'admin';
        } else if (selectedUser.empresa_id) {
          roleToUpdate = 'empresa';
        } else {
          roleToUpdate = 'user';
        }
      }
      
      // Update user table directly
      const { error: userError } = await supabase
        .from('user')
        .update({
          name: selectedUser.name,
          email: selectedUser.email,
          role: roleToUpdate,
          tags: tagsToUpdate,
          associado_id: selectedUser.associado_id,
          empresa_id: selectedUser.empresa_id,
          active: selectedUser.active
        })
        .eq('id', selectedUser.id);

      if (userError) {
        console.error("Error updating user:", userError);
        toast({
          title: "Erro ao atualizar usuário",
          description: userError.message,
          variant: "destructive"
        });
        return false;
      }
      
      // Return the updated user to the caller with adjusted role and tags
      const updatedUser = {
        ...selectedUser,
        role: roleToUpdate,
        tags: tagsToUpdate
      };
      
      onSuccess(updatedUser);
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso."
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      return false;
    }
  }, [selectedUser, onSuccess, toast]);

  const toggleUserActive = useCallback(async (userId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('user')
        .update({ active })
        .eq('id', userId);

      if (error) {
        console.error("Error toggling user active state:", error);
        toast({
          title: "Erro ao alterar status",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error toggling user active state:", error);
      toast({
        title: "Erro ao alterar status",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

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
