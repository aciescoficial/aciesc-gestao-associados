
import React, { useState } from 'react';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { User, UserRole } from './types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      name: 'Admin User', 
      email: 'admin@aciesc.com.br', 
      role: 'admin', 
      active: true,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Normal User',
      email: 'user@aciesc.com.br',
      role: 'normal',
      active: true,
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Conveniado User',
      email: 'conveniado@aciesc.com.br',
      role: 'conveniado',
      active: false,
      createdAt: new Date()
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'normal' as UserRole,
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setIsOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Usuário excluído com sucesso!');
    }
  };

  const handleToggleActive = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id !== userId) return user;
      return { ...user, active: !user.active };
    }));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast.success(`Usuário ${user.active ? 'desativado' : 'ativado'} com sucesso!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (editingUser) {
      // Editing existing user
      setUsers(users.map(user => {
        if (user.id !== editingUser.id) return user;
        return { 
          ...user,
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
      }));
      toast.success('Usuário atualizado com sucesso!');
    } else {
      // Creating new user
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        active: true,
        createdAt: new Date()
      };
      setUsers([...users, newUser]);
      toast.success('Usuário criado com sucesso!');
    }
    
    setIsOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'normal',
      password: '',
      confirmPassword: ''
    });
  };

  const openNewUserDialog = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'normal',
      password: '',
      confirmPassword: ''
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="wp-header">Gerenciamento de Usuários</h1>
        <button 
          className="wp-button flex items-center gap-2" 
          onClick={openNewUserDialog}
        >
          <Plus size={16} />
          Novo Usuário
        </button>
      </div>
      
      <div className="wp-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' 
                      ? 'bg-blue-100 text-blue-800' 
                      : user.role === 'conveniado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' 
                      ? 'Administrador' 
                      : user.role === 'normal' 
                        ? 'Normal' 
                        : 'Conveniado'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell>
                  {user.createdAt.toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash size={16} />
                    </button>
                    <button 
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => handleToggleActive(user.id)}
                    >
                      {user.active ? <X size={16} /> : <Check size={16} />}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="wp-input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="wp-input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Usuário</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="wp-input w-full"
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="normal">Normal</option>
                  <option value="conveniado">Conveniado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="wp-input w-full"
                  required={!editingUser}
                  placeholder={editingUser ? "(Deixe em branco para manter a mesma senha)" : ""}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="wp-input w-full"
                  required={!editingUser}
                  placeholder={editingUser ? "(Deixe em branco para manter a mesma senha)" : ""}
                />
              </div>
            </div>
            
            <DialogFooter>
              <button 
                type="button" 
                className="wp-button-secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="wp-button">
                {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
