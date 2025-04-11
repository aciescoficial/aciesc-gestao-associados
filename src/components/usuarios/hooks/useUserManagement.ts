
import { useDialogState } from './useDialogState';
import { User } from '../types';
import { useUserFetch } from './useUserFetch';
import { useUserCreate } from './useUserCreate';
import { useUserEdit } from './useUserEdit';

export const useUserManagement = () => {
  const addUserDialog = useDialogState(false);
  const editUserDialog = useDialogState(false);
  
  const { 
    users, 
    filteredUsers, 
    loading, 
    searchTerm, 
    setSearchTerm,
    fetchUsers 
  } = useUserFetch();

  const handleUserCreated = (newUser: User) => {
    addUserDialog.close();
  };

  const { 
    newUser, 
    handleNewUserChange, 
    addUser 
  } = useUserCreate(handleUserCreated);

  const handleUserUpdated = (updatedUser: User) => {
    editUserDialog.close();
  };

  const {
    selectedUser,
    setSelectedUser,
    handleSelectedUserChange,
    updateUser,
    toggleUserActive
  } = useUserEdit(handleUserUpdated);

  return {
    // User list state
    loading,
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
    fetchUsers
  };
};
