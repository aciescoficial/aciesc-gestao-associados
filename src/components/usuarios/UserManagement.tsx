
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserManagement } from './hooks/useUserManagement';
import { useUserActions } from './hooks/useUserActions';
import { User } from './types';
import UserManagementHeader from './components/UserManagementHeader';
import UserManagementContent from './components/UserManagementContent';
import UserModals from './components/UserModals';
import AddUserDialog from './components/AddUserDialog';
import EditUserDialogContainer from './components/EditUserDialogContainer';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UserManagement: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    filteredUsers,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    selectedUser,
    setSelectedUser,
    newUser,
    handleNewUserChange,
    handleSelectedUserChange,
    addUser,
    updateUser,
    toggleUserActive,
    fetchUsers,
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas,
    connectionStatus,
    deleteUser
  } = useUserManagement();

  const {
    selectedUserForAction,
    isPasswordDialogOpen,
    setIsPasswordDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleToggleActive,
    handleChangePassword,
    handleDelete
  } = useUserActions(toggleUserActive, fetchUsers);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  useEffect(() => {
    // Load associado and empresa data on component mount for faster user experience
    fetchAssociados();
    fetchEmpresas();
  }, [fetchAssociados, fetchEmpresas]);

  const handleRefresh = () => {
    toast({
      title: "Atualizando dados",
      description: "Buscando informações mais recentes...",
    });
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {connectionStatus === false && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Conexão offline</AlertTitle>
          <AlertDescription>
            Você está trabalhando offline. Algumas funcionalidades podem estar limitadas até que a conexão seja restabelecida.
          </AlertDescription>
        </Alert>
      )}
      
      <UserManagementHeader 
        loading={loading}
        handleRefresh={handleRefresh}
        openAddDialog={() => setIsAddUserDialogOpen(true)}
        connectionStatus={connectionStatus}
      />
      
      <UserManagementContent
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        filteredUsers={filteredUsers}
        connectionStatus={connectionStatus}
        handleRefresh={handleRefresh}
        handleEdit={handleEdit}
        handleToggleActive={handleToggleActive}
        handleChangePassword={handleChangePassword}
        handleDelete={handleDelete}
        isMobile={isMobile}
      />

      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        newUser={newUser}
        onNewUserChange={handleNewUserChange}
        onAddUser={addUser}
        associados={associados}
        empresas={empresas}
        loadingAssociados={loadingAssociados}
        loadingEmpresas={loadingEmpresas}
        fetchAssociados={fetchAssociados}
        fetchEmpresas={fetchEmpresas}
      />

      <EditUserDialogContainer
        isOpen={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
        selectedUser={selectedUser}
        onSelectedUserChange={handleSelectedUserChange}
        onUpdateUser={updateUser}
        associados={associados}
        empresas={empresas}
        loadingAssociados={loadingAssociados}
        loadingEmpresas={loadingEmpresas}
        fetchAssociados={fetchAssociados}
        fetchEmpresas={fetchEmpresas}
      />

      <UserModals
        selectedUser={selectedUserForAction}
        isPasswordDialogOpen={isPasswordDialogOpen}
        setIsPasswordDialogOpen={setIsPasswordDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        deleteUser={deleteUser}
        onDeleteSuccess={fetchUsers}
      />
    </div>
  );
};

export default UserManagement;
