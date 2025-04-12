
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission, UserRole } from './types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Settings, Wrench, Play, BookOpen, Calendar, Award, Users, Contact, MessageSquare, LayoutDashboard, Filter, DollarSign, Building, CreditCard, FileText, Shield, Image, Rocket } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface MenuPermission {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  subPermissions: {
    id: string;
    description: string;
    enabled: boolean;
  }[];
}

const PermissionPanel: React.FC = () => {
  const [menuPermissions, setMenuPermissions] = useState<Record<UserRole, MenuPermission[]>>({
    admin: [],
    user: [],
    empresa: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [saveLoading, setSaveLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const defaultMenus: MenuPermission[] = [
        {
          id: 'dashboard',
          name: 'Dashboard',
          icon: <LayoutDashboard size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'view_dashboard', description: 'Visualizar dashboard', enabled: true }
          ]
        },
        {
          id: 'usuarios',
          name: 'Usuários',
          icon: <Users size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'view_users', description: 'Visualizar usuários', enabled: true },
            { id: 'manage_users', description: 'Gerenciar usuários', enabled: true }
          ]
        },
        {
          id: 'permissoes',
          name: 'Permissões',
          icon: <Shield size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'view_permissions', description: 'Visualizar permissões', enabled: true },
            { id: 'manage_permissions', description: 'Gerenciar permissões', enabled: true }
          ]
        },
        {
          id: 'associados',
          name: 'Associados',
          icon: <Users size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'register_associado', description: 'Cadastrar associado', enabled: true },
            { id: 'search_associado', description: 'Pesquisar associado', enabled: true },
            { id: 'list_associado', description: 'Listar associados', enabled: true }
          ]
        },
        {
          id: 'empresas',
          name: 'Empresas',
          icon: <Building size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'register_empresa', description: 'Cadastrar empresa', enabled: true },
            { id: 'search_empresa', description: 'Pesquisar empresa', enabled: true },
            { id: 'pending_empresa', description: 'Aprovações pendentes', enabled: true }
          ]
        },
        {
          id: 'financeiro',
          name: 'Financeiro',
          icon: <DollarSign size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'view_summary', description: 'Visualizar resumo', enabled: true },
            { id: 'manage_associados', description: 'Gerenciar associados', enabled: true },
            { id: 'manage_integration', description: 'Gerenciar integração', enabled: true },
            { id: 'view_reports', description: 'Visualizar relatórios', enabled: true }
          ]
        },
        {
          id: 'carteirinhas',
          name: 'Carteirinhas',
          icon: <CreditCard size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'generate_card', description: 'Gerar carteirinha', enabled: true }
          ]
        },
        {
          id: 'mensagens',
          name: 'Mensagens',
          icon: <MessageSquare size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'view_messages', description: 'Visualizar mensagens', enabled: true },
            { id: 'send_messages', description: 'Enviar mensagens', enabled: true }
          ]
        },
        {
          id: 'configuracoes',
          name: 'Configurações',
          icon: <Settings size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'manage_settings', description: 'Gerenciar configurações', enabled: true }
          ]
        },
      ];

      const adminPermissions = [...defaultMenus];
      
      const userPermissions = defaultMenus.map(menu => ({
        ...menu,
        enabled: ['dashboard', 'mensagens'].includes(menu.id),
        subPermissions: menu.subPermissions.map(perm => ({
          ...perm,
          enabled: ['view_dashboard', 'view_messages'].includes(perm.id)
        }))
      }));

      const empresaPermissions = defaultMenus.map(menu => ({
        ...menu,
        enabled: ['dashboard', 'mensagens'].includes(menu.id),
        subPermissions: menu.subPermissions.map(perm => ({
          ...perm,
          enabled: ['view_dashboard', 'view_messages'].includes(perm.id)
        }))
      }));

      setMenuPermissions({
        admin: adminPermissions,
        user: userPermissions,
        empresa: empresaPermissions
      });
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      toast({
        title: "Erro ao carregar permissões",
        description: "Não foi possível carregar as permissões.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMenuPermission = async (role: UserRole, menuId: string, enabled: boolean) => {
    const permKey = `${role}-${menuId}`;
    setSaveLoading(prev => ({ ...prev, [permKey]: true }));
    
    try {
      console.log(`${role} ${enabled ? 'agora tem' : 'não tem mais'} acesso ao menu ${menuId}`);
      
      setMenuPermissions(prev => ({
        ...prev,
        [role]: prev[role].map(menu => {
          if (menu.id === menuId) {
            const updatedSubPermissions = !enabled 
              ? menu.subPermissions.map(subPerm => ({ ...subPerm, enabled: false }))
              : menu.subPermissions;
              
            return { 
              ...menu, 
              enabled, 
              subPermissions: updatedSubPermissions 
            };
          }
          return menu;
        })
      }));
      
      toast({
        title: "Permissão atualizada",
        description: `${role} ${enabled ? 'agora tem' : 'não tem mais'} acesso ao menu ${menuId}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
      toast({
        title: "Erro ao atualizar permissão",
        description: "Não foi possível salvar a alteração.",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(prev => ({ ...prev, [permKey]: false }));
    }
  };

  const toggleSubPermission = async (role: UserRole, menuId: string, subPermId: string, enabled: boolean) => {
    const permKey = `${role}-${menuId}-${subPermId}`;
    setSaveLoading(prev => ({ ...prev, [permKey]: true }));
    
    try {
      console.log(`${role} ${enabled ? 'agora tem' : 'não tem mais'} permissão ${subPermId}`);
      
      setMenuPermissions(prev => ({
        ...prev,
        [role]: prev[role].map(menu => {
          if (menu.id === menuId) {
            const menuEnabled = enabled ? true : menu.enabled;
            
            return { 
              ...menu, 
              enabled: menuEnabled,
              subPermissions: menu.subPermissions.map(subPerm => {
                if (subPerm.id === subPermId) {
                  return { ...subPerm, enabled };
                }
                return subPerm;
              }) 
            };
          }
          return menu;
        })
      }));
      
      toast({
        title: "Permissão atualizada",
        description: `${role} ${enabled ? 'agora tem' : 'não tem mais'} permissão para ${subPermId}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
      toast({
        title: "Erro ao atualizar permissão",
        description: "Não foi possível salvar a alteração.",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(prev => ({ ...prev, [permKey]: false }));
    }
  };

  const renderPermissionSection = (role: UserRole, menu: MenuPermission) => {
    const permKey = `${role}-${menu.id}`;
    const isLoading = saveLoading[permKey] || false;
    
    return (
      <div key={`${role}-${menu.id}`} className="py-4 border-b last:border-b-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={menu.enabled}
              onCheckedChange={(checked) => toggleMenuPermission(role, menu.id, checked)}
              disabled={role === 'admin'}
              id={`${role}-${menu.id}-switch`}
            />
            <div className="flex items-center gap-2">
              {menu.icon}
              <span className="font-medium">{menu.name}</span>
            </div>
          </div>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        
        <div className="ml-10 space-y-2">
          {menu.subPermissions.map((subPerm) => {
            const subPermKey = `${role}-${menu.id}-${subPerm.id}`;
            const isSubLoading = saveLoading[subPermKey] || false;
            
            return (
              <div key={subPermKey} className="flex items-center gap-2">
                <Checkbox 
                  id={subPermKey}
                  checked={menu.enabled && subPerm.enabled}
                  onCheckedChange={(checked) => toggleSubPermission(role, menu.id, subPerm.id, !!checked)}
                  disabled={role === 'admin' || !menu.enabled}
                />
                <label 
                  htmlFor={subPermKey}
                  className={`text-sm ${!menu.enabled ? 'text-muted-foreground' : ''}`}
                >
                  {subPerm.description}
                </label>
                {isSubLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
          <div>
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="admin">Administrador</TabsTrigger>
                <TabsTrigger value="user">Associado</TabsTrigger>
                <TabsTrigger value="empresa">Empresa</TabsTrigger>
              </TabsList>
              
              <TabsContent value="admin">
                <div className="p-4 rounded-md bg-muted/50 mb-4">
                  <p className="text-muted-foreground">Administradores têm acesso total ao sistema. Essas permissões não podem ser modificadas.</p>
                </div>
                <div className="space-y-1">
                  {menuPermissions.admin.map((menu) => renderPermissionSection('admin', menu))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="user">
                <div className="space-y-1">
                  {menuPermissions.user.map((menu) => renderPermissionSection('user', menu))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="empresa">
                <div className="space-y-1">
                  {menuPermissions.empresa.map((menu) => renderPermissionSection('empresa', menu))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionPanel;
