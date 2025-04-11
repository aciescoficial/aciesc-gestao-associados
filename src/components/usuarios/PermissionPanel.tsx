
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission, UserRole } from './types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const PermissionPanel: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [saveLoading, setSaveLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      // In a real app with Supabase, we would fetch permissions from a permissions table
      // For demonstration, we'll use the same mock data but with better structure
      
      // Example of how we would fetch from a permissions table:
      // const { data, error } = await supabase
      //   .from('permissions')
      //   .select('*')
      //   .order('module, name');
      // if (error) throw error;
      // setPermissions(data || []);
      
      // For now, using the mock data with simplified roles:
      setPermissions([
        {
          id: '1',
          name: 'view_associados',
          description: 'Visualizar associados',
          module: 'associados',
          roles: ['admin', 'user']
        },
        {
          id: '2',
          name: 'edit_associados',
          description: 'Editar associados',
          module: 'associados',
          roles: ['admin']
        },
        {
          id: '3',
          name: 'view_empresas',
          description: 'Visualizar empresas',
          module: 'empresas',
          roles: ['admin']
        },
        {
          id: '4',
          name: 'edit_financeiro',
          description: 'Editar dados financeiros',
          module: 'financeiro',
          roles: ['admin']
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
    const permissionKey = `${permission.id}-${role}`;
    setSaveLoading(prev => ({ ...prev, [permissionKey]: true }));
    
    try {
      // In a real app with Supabase, we would update a role_permissions junction table
      // For demonstration, we'll just log and show a toast
      
      // Example of how we would update permissions:
      // if (hasPermission) {
      //   // Add permission to role
      //   const { error } = await supabase
      //     .from('role_permissions')
      //     .insert({ role, permission_id: permission.id });
      //   if (error) throw error;
      // } else {
      //   // Remove permission from role
      //   const { error } = await supabase
      //     .from('role_permissions')
      //     .delete()
      //     .eq('role', role)
      //     .eq('permission_id', permission.id);
      //   if (error) throw error;
      // }
      
      // For demonstration purposes:
      console.log(`${role} ${hasPermission ? 'now has' : 'no longer has'} ${permission.name} permission`);
      
      // Update local state to reflect changes
      setPermissions(prevPermissions => 
        prevPermissions.map(p => {
          if (p.id === permission.id) {
            const updatedRoles = hasPermission
              ? [...p.roles, role].filter((v, i, a) => a.indexOf(v) === i) // Add role uniquely
              : p.roles.filter(r => r !== role); // Remove role
            
            return { ...p, roles: updatedRoles };
          }
          return p;
        })
      );
      
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
    } finally {
      setSaveLoading(prev => ({ ...prev, [permissionKey]: false }));
    }
  };

  const hasPermission = (permission: Permission, role: UserRole) => {
    return permission.roles.includes(role);
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
        {permissions
          .filter(p => p.module === 'associados')
          .map(permission => {
            const permissionKey = `${permission.id}-${role}`;
            return (
              <TableRow key={`${permission.id}-${role}-associados`}>
                <TableCell>{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>
                  {saveLoading[permissionKey] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Checkbox 
                      checked={hasPermission(permission, role)}
                      onCheckedChange={(checked) => updatePermission(permission, role, !!checked)}
                      disabled={role === 'admin'} // Admin always has all permissions
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}

        {/* Continue with other modules, same pattern */}
        {permissions.filter(p => p.module === 'empresas').map(permission => {
          const permissionKey = `${permission.id}-${role}`;
          return (
            <TableRow key={`${permission.id}-${role}-empresas`}>
              <TableCell>{permission.name}</TableCell>
              <TableCell>{permission.description}</TableCell>
              <TableCell>
                {saveLoading[permissionKey] ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Checkbox 
                    checked={hasPermission(permission, role)}
                    onCheckedChange={(checked) => updatePermission(permission, role, !!checked)}
                    disabled={role === 'admin'} // Admin always has all permissions
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}

        {permissions.filter(p => p.module === 'financeiro').map(permission => {
          const permissionKey = `${permission.id}-${role}`;
          return (
            <TableRow key={`${permission.id}-${role}-financeiro`}>
              <TableCell>{permission.name}</TableCell>
              <TableCell>{permission.description}</TableCell>
              <TableCell>
                {saveLoading[permissionKey] ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Checkbox 
                    checked={hasPermission(permission, role)}
                    onCheckedChange={(checked) => updatePermission(permission, role, !!checked)}
                    disabled={role === 'admin'} // Admin always has all permissions
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Gerenciamento de Permissões</h1>
        <Button onClick={fetchPermissions} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : (
            "Atualizar"
          )}
        </Button>
      </div>
      
      <div className="wp-card">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Carregando permissões...</span>
          </div>
        ) : (
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="admin">Administrador</TabsTrigger>
              <TabsTrigger value="user">Associado</TabsTrigger>
              <TabsTrigger value="empresa">Empresa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin">
              <div className="p-4 rounded-md bg-muted/50 mb-4">
                <p className="text-muted-foreground">Administradores têm acesso total ao sistema. Essas permissões não podem ser modificadas.</p>
              </div>
              {renderPermissionsTable('admin')}
            </TabsContent>
            
            <TabsContent value="user">
              {renderPermissionsTable('user')}
            </TabsContent>
            
            <TabsContent value="empresa">
              {renderPermissionsTable('empresa')}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default PermissionPanel;
