
import { useDialogState } from './useDialogState';
import { User } from '../types';
import { useUserFetch } from './useUserFetch';
import { useUserCreate } from './useUserCreate';
import { useUserEdit } from './useUserEdit';
import { useToast } from '@/hooks/use-toast';
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/components/audit/services/logOperationService';
import { useAuth } from '@/components/auth/AuthProvider';

export const useUserManagement = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const { 
    users, 
    filteredUsers, 
    loading, 
    error,
    searchTerm, 
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    fetchUsers,
    connectionStatus 
  } = useUserFetch();

  const handleUserCreated = useCallback((newUser: User) => {
    setIsAddUserDialogOpen(false);
    fetchUsers(); // Refresh the user list
  }, [fetchUsers]);

  const { 
    newUser, 
    handleNewUserChange, 
    addUser,
    associados: createAssociados,
    empresas: createEmpresas,
    loadingAssociados: createLoadingAssociados,
    loadingEmpresas: createLoadingEmpresas,
    fetchAssociados: fetchCreateAssociados,
    fetchEmpresas: fetchCreateEmpresas
  } = useUserCreate(handleUserCreated);

  const handleUserUpdated = useCallback((updatedUser: User) => {
    setIsEditUserDialogOpen(false);
    fetchUsers(); // Refresh the user list
  }, [fetchUsers]);

  const {
    selectedUser,
    setSelectedUser,
    handleSelectedUserChange,
    updateUser,
    toggleUserActive,
    associados: editAssociados,
    empresas: editEmpresas,
    loadingAssociados: editLoadingAssociados,
    loadingEmpresas: editLoadingEmpresas,
    fetchAssociados: fetchEditAssociados,
    fetchEmpresas: fetchEditEmpresas
  } = useUserEdit(handleUserUpdated);

  // User deletion logic with improved error handling and logging
  const deleteUser = useCallback(async (userId: string, deleteAssociado: boolean = false) => {
    console.log("Attempting to delete user:", userId, "with deleteAssociado:", deleteAssociado);
    
    if (!currentUser?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar autenticado para realizar esta operação.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // First get basic user info for logging purposes
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('email, name')
        .eq('id', userId)
        .single();
      
      if (userError && userError.code !== 'PGRST116') {
        console.error("Error fetching user data for deletion:", userError);
      }
      
      // Call the edge function to delete the user
      const response = await fetch(`${process.env.SUPABASE_URL || 'https://wpcstzjczfgbfwgzwktf.supabase.co'}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          requestingUserId: currentUser.id,
          deleteAssociado: deleteAssociado
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Falha ao excluir usuário');
      }
      
      // Log locally too for immediate feedback
      await logOperation({
        eventType: 'delete',
        entityType: 'user',
        details: `Usuário ${userData?.name || ''} (${userData?.email || userId}) excluído${deleteAssociado ? ' junto com associado vinculado' : ''}`,
        recordCount: 1,
      });
      
      toast({
        title: "Usuário excluído",
        description: result.message || `O usuário foi excluído com sucesso${deleteAssociado ? ' junto com o associado vinculado' : ''}.`,
        variant: "default"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error in deleteUser:", error);
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      return false;
    }
  }, [toast, currentUser]);

  return {
    // User list state
    loading,
    error,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    filteredUsers,
    connectionStatus,
    
    // Add user dialog state
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    newUser,
    handleNewUserChange,
    addUser,
    
    // Edit user dialog state
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    selectedUser,
    setSelectedUser,
    handleSelectedUserChange,
    updateUser,
    
    // User actions
    toggleUserActive,
    fetchUsers,
    deleteUser,

    // Associated entities
    associados: createAssociados,
    empresas: createEmpresas,
    loadingAssociados: createLoadingAssociados,
    loadingEmpresas: createLoadingEmpresas,
    fetchAssociados: fetchCreateAssociados,
    fetchEmpresas: fetchCreateEmpresas
  };
};
