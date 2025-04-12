
import { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { MenuPermission, SaveLoadingState } from '../types';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, Users, Shield, Building, 
  DollarSign, CreditCard, MessageSquare, Settings 
} from 'lucide-react';

export const usePermissionData = () => {
  const [menuPermissions, setMenuPermissions] = useState<Record<UserRole, MenuPermission[]>>({
    admin: [],
    user: [],
    empresa: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [saveLoading, setSaveLoading] = useState<SaveLoadingState>({});

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
            { id: 'approve_associado', description: 'Aprovar interessados', enabled: true },
            { id: 'generate_card', description: 'Gerar carteirinha', enabled: true }
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
            { id: 'suggestions_empresa', description: 'Sugestões de empresas', enabled: true }
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
            { id: 'generate_card', description: 'Gerar carteirinha', enabled: true },
            { id: 'request_card', description: 'Solicitar carteirinha', enabled: true }
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
            { id: 'general_settings', description: 'Configurações gerais', enabled: true },
            { id: 'admin_settings', description: 'Administração', enabled: true },
            { id: 'api_settings', description: 'Integração API', enabled: true },
            { id: 'system_settings', description: 'Sistema', enabled: true }
          ]
        },
        {
          id: 'area_associado',
          name: 'Área do Associado',
          icon: <Users size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'view_payments', description: 'Meus pagamentos', enabled: true },
            { id: 'update_profile', description: 'Atualizar dados', enabled: true },
            { id: 'view_companies', description: 'Empresas conveniadas', enabled: true }
          ]
        },
        {
          id: 'area_empresa',
          name: 'Área da Empresa',
          icon: <Building size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'update_company', description: 'Atualizar dados', enabled: true },
            { id: 'search_members', description: 'Pesquisar associados', enabled: true }
          ]
        },
        {
          id: 'comunicacao',
          name: 'Comunicação',
          icon: <MessageSquare size={16} />,
          enabled: true,
          subPermissions: [
            { id: 'send_messages', description: 'Enviar mensagens', enabled: true }
          ]
        }
      ];

      const adminPermissions = [...defaultMenus];
      
      const userPermissions = defaultMenus.map(menu => ({
        ...menu,
        enabled: ['dashboard', 'area_associado', 'mensagens', 'comunicacao'].includes(menu.id),
        subPermissions: menu.subPermissions.map(perm => ({
          ...perm,
          enabled: ['view_dashboard', 'view_messages', 'view_payments', 'update_profile', 'view_companies', 'send_messages'].includes(perm.id)
        }))
      }));

      const empresaPermissions = defaultMenus.map(menu => ({
        ...menu,
        enabled: ['dashboard', 'area_empresa', 'mensagens', 'comunicacao'].includes(menu.id),
        subPermissions: menu.subPermissions.map(perm => ({
          ...perm,
          enabled: ['view_dashboard', 'update_company', 'search_members', 'view_messages', 'send_messages'].includes(perm.id)
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

  useEffect(() => {
    fetchPermissions();
  }, []);

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

  return {
    menuPermissions,
    loading,
    saveLoading,
    fetchPermissions,
    toggleMenuPermission,
    toggleSubPermission
  };
};
