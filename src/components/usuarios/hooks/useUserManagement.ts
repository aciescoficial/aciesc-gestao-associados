
import { useDialogState } from './useDialogState';
import { User } from '../types';
import { useUserFetch } from './useUserFetch';
import { useUserCreate } from './useUserCreate';
import { useUserEdit } from './useUserEdit';
import { useToast } from '@/hooks/use-toast';

export const useUserManagement = () => {
  const addUserDialog = useDialogState(false);
  const editUserDialog = useDialogState(false);
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
    addUserDialog.close();
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
    editUserDialog.close();
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
    isAddUserDialogOpen: addUserDialog.isOpen,
    setIsAddUserDialogOpen: addUserDialog.setIsOpen,
    newUser,
    handleNewUserChange,
    addUser,
    
    // Edit user dialog state
    isEditUserDialogOpen: editUserDialog.isOpen,
    setIsEditUserDialogOpen: editUserDialog.setIsOpen,
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
    fetchEmpresas: fetchCreateEmpresas,
    editAssociados,
    editEmpresas,
    editLoadingAssociados,
    editLoadingEmpresas,
    fetchEditAssociados,
    fetchEditEmpresas
  };
};
