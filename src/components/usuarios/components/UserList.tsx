
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { User, UserRole, UserTag } from '../types';
import { getTagBadgeColor } from '../utils/roleUtils';

interface UserListProps {
  loading: boolean;
  filteredUsers: User[];
  onEdit: (user: User) => void;
  onToggleActive: (userId: string, active: boolean) => void;
  getRoleBadgeColor: (role: UserRole) => string;
  getRoleLabel: (role: UserRole) => string;
}

const UserList: React.FC<UserListProps> = ({
  loading,
  filteredUsers,
  onEdit,
  onToggleActive,
  getRoleBadgeColor,
  getRoleLabel
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableCaption>Lista de usuários do sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Carregando usuários...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                  <div className="flex flex-wrap gap-1">
                    {user.tags && user.tags.length > 0 ? (
                      user.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline"
                          className={`text-xs ${getTagBadgeColor(tag)}`}
                        >
                          {tag.replace(/_/g, ' ')}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">Sem tags</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Switch
                      checked={user.active}
                      onCheckedChange={(checked) => onToggleActive(user.id, checked)}
                    />
                    <span className="ml-2">{user.active ? 'Ativo' : 'Inativo'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
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
  );
};

export default UserList;
