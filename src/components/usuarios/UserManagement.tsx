
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, RefreshCw, Search, AlertCircle, WifiOff, Database } from 'lucide-react';
import UserList from './components/UserList';
import AddUserDialog from './components/AddUserDialog';
import EditUserDialog from './components/EditUserDialog';
import { useUserManagement } from './hooks/useUserManagement';
import { getRoleBadgeColor, getRoleLabel } from './utils/roleUtils';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    // Associado and empresa data
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas,
    connectionStatus
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

  const handleRefresh = () => {
    toast({
      title: "Atualizando dados",
      description: "Buscando informações mais recentes...",
    });
    fetchUsers();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Gerenciamento de Usuários</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Carregando..." : "Atualizar"}
          </Button>
          <Button 
            onClick={() => setIsAddUserDialogOpen(true)}
            disabled={loading || connectionStatus === false}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>
      
      <div className="wp-card space-y-4">
        {/* Mostrar alerta de status de conexão se houver problemas */}
        {connectionStatus === false && (
          <Alert variant="destructive" className="mb-4">
            <WifiOff className="h-4 w-4 mr-2" />
            <AlertTitle>Problema de conexão</AlertTitle>
            <AlertDescription>
              Não foi possível estabelecer conexão com o banco de dados. Verifique sua conexão com a internet e tente novamente.
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={handleRefresh}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Campo de busca */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, email, CPF ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
            disabled={loading}
          />
        </div>
        
        {/* Mensagem de erro */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Erro ao carregar usuários</AlertTitle>
            <AlertDescription>
              {error.message}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={handleRefresh}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Estado de carregamento */}
        {loading && filteredUsers.length === 0 ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full col-span-2" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mostrar se não há dados mas não está carregando */}
            {!loading && filteredUsers.length === 0 ? (
              <div className="text-center py-10">
                <Database className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">Nenhum usuário encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 
                    "Nenhum usuário corresponde à sua pesquisa." : 
                    "Não foram encontrados usuários no sistema."}
                </p>
              </div>
            ) : (
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
            )}
          </>
        )}
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
