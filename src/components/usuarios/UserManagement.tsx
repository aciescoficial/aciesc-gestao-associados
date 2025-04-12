
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, RefreshCw, Search } from 'lucide-react';
import UserList from './components/UserList';
import AddUserDialog from './components/AddUserDialog';
import EditUserDialog from './components/EditUserDialog';
import { useUserManagement } from './hooks/useUserManagement';
import { getRoleBadgeColor, getRoleLabel } from './utils/roleUtils';
import { useToast } from '@/hooks/use-toast';

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const {
    loading,
    error,
    searchTerm,
    setSearchTerm,
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
    // New props for associado and empresa link
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas
  } = useUserManagement();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Gerenciamento de Usuários</h1>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {/* Removed the "Carregando..." text */}
          </Button>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>
      
      <div className="wp-card space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, email, CPF ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
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
        associados={associados}
        empresas={empresas}
        loadingAssociados={loadingAssociados}
        loadingEmpresas={loadingEmpresas}
        fetchAssociados={fetchAssociados}
        fetchEmpresas={fetchEmpresas}
      />

      <EditUserDialog
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
    </div>
  );
};

export default UserManagement;
