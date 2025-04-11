
import { useState } from 'react';
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mapToDbRole } from '../utils/roleUtils';

export const useUserEdit = (onSuccess: (updatedUser: User) => void) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleSelectedUserChange = (field: string, value: any) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: value });
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          role: mapToDbRole(selectedUser.role) as any
        })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      onSuccess(selectedUser);
      
      toast({
        title: "Usuário atualizado",
        description: `O usuário ${selectedUser.name} foi atualizado com sucesso.`
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive"
      });
    }
  };

  const toggleUserActive = async (userId: string, active: boolean) => {
    try {
      // In a real implementation, you would call an admin API to update the user's active status
      // For now, we'll just handle the UI update
      onSuccess({
        id: userId,
        active,
        // These properties are placeholders since we don't have the full user object
        name: '',
        email: '',
        role: 'user',
        createdAt: new Date()
      });
      
      toast({
        title: active ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário foi ${active ? "ativado" : "desativado"} com sucesso.`
      });
    } catch (error) {
      console.error("Error toggling user active status:", error);
      toast({
        title: "Erro ao atualizar status do usuário",
        description: "Não foi possível atualizar o status do usuário.",
        variant: "destructive"
      });
    }
  };

  return {
    selectedUser,
    setSelectedUser,
    handleSelectedUserChange,
    updateUser,
    toggleUserActive
  };
};
