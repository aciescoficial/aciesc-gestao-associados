
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission, UserRole } from './types';
import { Check, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PermissionPanel: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      // In a real app, fetch permissions from your API/backend
      // For demonstration, we'll use some mock data
      setPermissions([
        {
          id: '1',
          name: 'view_conveniados',
          description: 'Visualizar conveniados',
          module: 'conveniados',
          defaultRoles: ['admin', 'diretoria', 'associado']
        },
        {
          id: '2',
          name: 'edit_conveniados',
          description: 'Editar conveniados',
          module: 'conveniados',
          defaultRoles: ['admin', 'diretoria']
        },
        {
          id: '3',
          name: 'view_empresas',
          description: 'Visualizar empresas',
          module: 'empresas',
          defaultRoles: ['admin', 'diretoria']
        },
        {
          id: '4',
          name: 'edit_financeiro',
          description: 'Editar dados financeiros',
          module: 'financeiro',
          defaultRoles: ['admin']
        }
      ]);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast({
        title: "Erro ao carregar permissões",
        description: "Não foi possível carregar as permissões.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (permission: Permission, role: UserRole, hasPermission: boolean) => {
    try {
      // In a real app, save to your API/backend
      console.log(`${role} ${hasPermission ? 'now has' : 'no longer has'} ${permission.name} permission`);
      
      toast({
        title: "Permissão atualizada",
        description: `${role} ${hasPermission ? 'agora tem' : 'não tem mais'} permissão para ${permission.description}`,
      });
    } catch (error) {
      console.error("Error updating permission:", error);
      toast({
        title: "Erro ao atualizar permissão",
        description: "Não foi possível salvar a alteração.",
        variant: "destructive"
      });
    }
  };

  const hasPermission = (permission: Permission, role: UserRole) => {
    return permission.defaultRoles.includes(role);
  };

  const renderPermissionsTable = (role: UserRole) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Permissão</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.filter(p => p.module === 'conveniados').map(permission => (
          <TableRow key={`${permission.id}-${role}-conveniados`}>
            <TableCell>{permission.name}</TableCell>
            <TableCell>{permission.description}</TableCell>
            <TableCell>
              <Checkbox 
                checked={hasPermission(permission, role)}
                onCheckedChange={(checked) => updatePermission(permission, role, !!checked)}
                disabled={role === 'admin'} // Admin always has all permissions
              />
            </TableCell>
          </TableRow>
        ))}

        {permissions.filter(p => p.module === 'empresas').map(permission => (
          <TableRow key={`${permission.id}-${role}-empresas`}>
            <TableCell>{permission.name}</TableCell>
            <TableCell>{permission.description}</TableCell>
            <TableCell>
              <Checkbox 
                checked={hasPermission(permission, role)}
                onCheckedChange={(checked) => updatePermission(permission, role, !!checked)}
                disabled={role === 'admin'} // Admin always has all permissions
              />
            </TableCell>
          </TableRow>
        ))}

        {permissions.filter(p => p.module === 'financeiro').map(permission => (
          <TableRow key={`${permission.id}-${role}-financeiro`}>
            <TableCell>{permission.name}</TableCell>
            <TableCell>{permission.description}</TableCell>
            <TableCell>
              <Checkbox 
                checked={hasPermission(permission, role)}
                onCheckedChange={(checked) => updatePermission(permission, role, !!checked)}
                disabled={role === 'admin'} // Admin always has all permissions
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Gerenciamento de Permissões</h1>
        <Button onClick={fetchPermissions} disabled={loading}>
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
      </div>
      
      <div className="wp-card">
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="admin">Administrador</TabsTrigger>
            <TabsTrigger value="diretoria">Diretoria</TabsTrigger>
            <TabsTrigger value="conveniado">Conveniado</TabsTrigger>
            <TabsTrigger value="associado">Associado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin">
            <div className="p-4 rounded-md bg-muted/50 mb-4">
              <p className="text-muted-foreground">Administradores têm acesso total ao sistema. Essas permissões não podem ser modificadas.</p>
            </div>
            {renderPermissionsTable('admin')}
          </TabsContent>
          
          <TabsContent value="diretoria">
            {renderPermissionsTable('diretoria')}
          </TabsContent>
          
          <TabsContent value="conveniado">
            {renderPermissionsTable('conveniado')}
          </TabsContent>

          <TabsContent value="associado">
            {renderPermissionsTable('associado')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PermissionPanel;
