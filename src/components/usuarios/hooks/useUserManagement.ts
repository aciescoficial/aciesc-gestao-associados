
import { useState } from 'react';
import { User } from '../types';
import { useUserFetch } from './useUserFetch';
import { useUserCreate } from './useUserCreate';
import { useUserEdit } from './useUserEdit';

export const useUserManagement = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  
  const { 
    users, 
    filteredUsers, 
    loading, 
    searchTerm, 
    setSearchTerm,
    fetchUsers 
  } = useUserFetch();

  const handleUserCreated = (newUser: User) => {
    setIsAddUserDialogOpen(false);
  };

  const { 
    newUser, 
    handleNewUserChange, 
    addUser 
  } = useUserCreate(handleUserCreated);

  const handleUserUpdated = (updatedUser: User) => {
    setIsEditUserDialogOpen(false);
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
    fetchUsers
  };
};
