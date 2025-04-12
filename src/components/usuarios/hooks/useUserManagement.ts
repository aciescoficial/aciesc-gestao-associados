
import { useDialogState } from './useDialogState';
import { User } from '../types';
import { useUserFetch } from './useUserFetch';
import { useUserCreate } from './useUserCreate';
import { useUserEdit } from './useUserEdit';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export const useUserManagement = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { 
    users, 
    filteredUsers, 
    loading, 
    error,
    searchTerm, 
    setSearchTerm,
    fetchUsers 
  } = useUserFetch();

  const handleUserCreated = async (newUser: User) => {
    toast({
      title: "Usuário criado",
      description: "O usuário foi criado com sucesso."
    });
    setIsAddUserDialogOpen(false);
    await fetchUsers(); // Refresh the user list
  };

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

  const handleUserUpdated = async (updatedUser: User) => {
    toast({
      title: "Usuário atualizado",
      description: "O usuário foi atualizado com sucesso."
    });
    setIsEditUserDialogOpen(false);
    await fetchUsers(); // Refresh the user list
  };

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

  return {
    // User list state
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    
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

    // Associated entities
    associados: createAssociados,
    empresas: createEmpresas,
    loadingAssociados: createLoadingAssociados,
    loadingEmpresas: createLoadingEmpresas,
    fetchAssociados: fetchCreateAssociados,
    fetchEmpresas: fetchCreateEmpresas
  };
};
