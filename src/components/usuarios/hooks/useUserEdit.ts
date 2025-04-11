
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
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          role: mapToDbRole(selectedUser.role)
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
      // In a real implementation with Supabase, you might:
      // 1. Update a field in the profiles table that tracks active status
      // 2. Or potentially use Supabase Auth admin APIs to disable the user

      // For now we'll assume there's an "active" field in profiles we can update
      const { error } = await supabase
        .from('profiles')
        .update({ active }) 
        .eq('id', userId);
        
      if (error) throw error;
      
      // Notify of success
      toast({
        title: active ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário foi ${active ? "ativado" : "desativado"} com sucesso.`
      });
      
      // Update the local state
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({...selectedUser, active});
      }
      
      // Call the success callback with dummy data to trigger a refresh
      onSuccess({
        id: userId,
        active,
        name: '',
        email: '',
        role: 'user',
        createdAt: new Date()
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
