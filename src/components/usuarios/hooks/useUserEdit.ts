
import { useState } from 'react';
import { User } from '../types';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mapToDbRole } from '../utils/roleUtils';

export const useUserEdit = (onSuccess: (updatedUser: User) => void) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectedUserChange = (field: string, value: any) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: value });
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      // Map the role properly
      const dbRole = mapToDbRole(selectedUser.role);
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          role: dbRole as any // Use type assertion to bypass TypeScript check
          // Note: 'active' is not included here as it's not in the profiles table
        })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      onSuccess(selectedUser);
      
      toast({
        title: "Usuário atualizado",
        description: `O usuário ${selectedUser.name} foi atualizado com sucesso.`
      });
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      
      toast({
        title: "Erro ao atualizar usuário",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserActive = async (userId: string, active: boolean) => {
    setIsLoading(true);
    try {
      // Buscar informações do usuário para garantir que temos todos os dados
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError) throw userError;
      
      // Implementar soft delete ou flag de status na tabela de perfis
      // Por enquanto, apenas atualizamos o estado local
      
      // Notify of success
      toast({
        title: active ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário foi ${active ? "ativado" : "desativado"} com sucesso.`
      });
      
      // Update the local state
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({...selectedUser, active});
      }
      
      // Call the success callback with the updated data
      onSuccess({
        id: userId,
        active,
        name: userData?.name || selectedUser?.name || '',
        email: selectedUser?.email || '',
        role: (userData?.role as any) || selectedUser?.role || 'user',
        createdAt: userData?.created_at ? new Date(userData.created_at) : new Date()
      });
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      
      toast({
        title: "Erro ao atualizar status do usuário",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedUser,
    setSelectedUser,
    isLoading,
    handleSelectedUserChange,
    updateUser,
    toggleUserActive
  };
};
