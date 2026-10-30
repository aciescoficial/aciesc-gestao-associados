
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
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { User, UserRole, UserTag } from '../types';
import { getTagBadgeColor } from '../utils/roleUtils';
import { Edit, Key, Trash2 } from 'lucide-react';
import { useAdminPermission } from '@/hooks/use-admin-permission';

interface UserListProps {
  loading: boolean;
  filteredUsers: User[];
  onEdit: (user: User) => void;
  onChangePassword: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleActive: (userId: string, active: boolean) => void;
  getRoleBadgeColor: (role: UserRole) => string;
  getRoleLabel: (role: UserRole) => string;
  isMobile?: boolean;
}

const UserList: React.FC<UserListProps> = ({
  loading,
  filteredUsers,
  onEdit,
  onChangePassword,
  onDelete,
  onToggleActive,
  getRoleBadgeColor,
  getRoleLabel,
  isMobile = false
}) => {
  const { isAdmin } = useAdminPermission();
  
  // Helper function to determine effective role based on tags and role
  const getEffectiveRole = (user: User): UserRole => {
    // Se o usuário tem a tag diretoria_aciesc, ele deve ser mostrado como diretoria
    if (user.tags?.includes('diretoria_aciesc')) {
      return 'diretoria';
    }
    
    return user.role;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableCaption>Lista de usuários do sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className={isMobile ? "hidden md:table-cell" : ""}>Email</TableHead>
            <TableHead className={isMobile ? "hidden sm:table-cell" : ""}>Tipo</TableHead>
            <TableHead className={isMobile ? "hidden lg:table-cell" : ""}>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <LoadingSpinner size="medium" text="Carregando usuários..." />
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => {
              // Usar o papel efetivo para exibição
              const effectiveRole = getEffectiveRole(user);
              
              return (
                <TableRow 
                  key={user.id} 
                  className="transition-colors hover:bg-muted/40 group"
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className={isMobile ? "hidden md:table-cell" : ""}>{user.email}</TableCell>
                  <TableCell className={isMobile ? "hidden sm:table-cell" : ""}>
                    <Badge className={`font-normal ${getRoleBadgeColor(effectiveRole)}`}>
                      {getRoleLabel(effectiveRole)}
                    </Badge>
                  </TableCell>
                  <TableCell className={isMobile ? "hidden lg:table-cell" : ""}>
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
                        className="transition-opacity opacity-70 group-hover:opacity-100"
                      />
                      <span className="ml-2">{user.active ? 'Ativo' : 'Inativo'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user)}
                        title="Editar cadastro"
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChangePassword(user)}
                        title="Alterar senha"
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                      >
                        <Key className="h-4 w-4" />
                        <span className="sr-only">Senha</span>
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(user)}
                          title="Excluir usuário"
                          className="opacity-70 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;

