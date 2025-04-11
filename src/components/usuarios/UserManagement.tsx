
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, UserRole } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, RefreshCw, Search } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole,
    password: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          role,
          avatar_url,
          phone,
          created_at,
          updated_at
        `)
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        // Convert legacy roles to new simplified structure if needed
        const formattedUsers: User[] = data.map(profile => {
          // Map legacy roles to new simplified structure
          let role: UserRole;
          const dbRole = profile.role as string;
          
          // Handle role mapping to our defined UserRole type
          if (['associado', 'diretoria'].includes(dbRole)) {
            role = 'user';
          } else if (dbRole === 'conveniado' || dbRole === 'empresa') {
            role = 'empresa';
          } else if (dbRole === 'admin' || dbRole === 'user') {
            role = dbRole as UserRole;
          } else {
            // Default fallback
            role = 'user';
          }
          
          return {
            id: profile.id,
            name: profile.name || '',
            email: `${profile.name?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            role: role,
            active: true,
            createdAt: new Date(profile.created_at)
          };
        });
        
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role,
          }
        }
      });

      if (authError) throw authError;
      
      if (authData && authData.user) {
        const createdUser: User = {
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          active: true,
          createdAt: new Date()
        };
        
        setUsers([...users, createdUser]);
        setIsAddUserDialogOpen(false);
        setNewUser({
          name: '',
          email: '',
          role: 'user',
          password: ''
        });
        
        toast({
          title: "Usuário criado",
          description: `O usuário ${createdUser.name} foi criado com sucesso.`
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Erro ao criar usuário",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Não foi possível criar o usuário.",
        variant: "destructive"
      });
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: selectedUser.name,
          role: selectedUser.role
        })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      );
      
      setUsers(updatedUsers);
      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
      
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
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, active } : user
      );
      
      setUsers(updatedUsers);
      
      toast({
        title: active ? "Usuário ativado" : "Usuário desativado",
        description: `O usuário foi ${active ? "ativado" : "desativado"} com sucesso.`
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'empresa':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'user':
        return 'Associado';
      case 'empresa':
        return 'Empresa';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Gerenciamento de Usuários</h1>
        <div className="flex gap-2">
          <Button onClick={() => fetchUsers()} variant="outline">
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
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableCaption>Lista de usuários do sistema</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Carregando usuários...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={`font-normal ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch
                          checked={user.active}
                          onCheckedChange={(checked) => toggleUserActive(user.id, checked)}
                        />
                        <span className="ml-2">{user.active ? 'Ativo' : 'Inativo'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditUserDialogOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para criar um novo usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuário</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({...newUser, role: value as UserRole})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Associado</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => addUser()}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Modifique os dados do usuário abaixo.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Tipo de Usuário</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value as UserRole})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Associado</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={selectedUser.active}
                  onCheckedChange={(checked) => setSelectedUser({...selectedUser, active: checked})}
                />
                <Label htmlFor="edit-active">Usuário ativo</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => updateUser()}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
