
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import UserList from './components/UserList';
import UserFilters from './components/UserFilters';
import AddUserDialog from './components/AddUserDialog';
import EditUserDialog from './components/EditUserDialog';
import { useUserManagement } from './hooks/useUserManagement';
import { getRoleBadgeColor, getRoleLabel } from './utils/roleUtils';

const UserManagement: React.FC = () => {
  const {
    loading,
    filters,
    updateFilters,
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
    fetchUsers
  } = useUserManagement();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Gerenciamento de Usuários</h1>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>
      
      <div className="wp-card space-y-4">
        <UserFilters 
          filters={filters}
          onUpdateFilters={updateFilters}
        />
        
        <UserList 
          loading={loading}
          filteredUsers={filteredUsers}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsEditUserDialogOpen(true);
          }}
          onToggleActive={toggleUserActive}
          getRoleBadgeColor={getRoleBadgeColor}
          getRoleLabel={getRoleLabel}
        />
      </div>

      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onOpenChange={setIsAddUserDialogOpen}
        newUser={newUser}
        onNewUserChange={handleNewUserChange}
        onAddUser={addUser}
      />

      <EditUserDialog
        isOpen={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
        selectedUser={selectedUser}
        onSelectedUserChange={handleSelectedUserChange}
        onUpdateUser={updateUser}
      />
    </div>
  );
};

export default UserManagement;
