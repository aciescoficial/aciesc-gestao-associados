
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSidebarState } from '@/hooks/use-sidebar-state';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarSubmenu from './SidebarSubmenu';
import { 
  Home, 
  Users, 
  Building, 
  FileText,
  DollarSign, 
  Settings,
  Search,
  UserPlus,
  CheckSquare,
  CreditCard,
  Shield,
  UserCog,
  UserCheck,
  BarChart,
  MessageSquare,
  ClipboardList,
  Inbox,
  FileCheck
} from 'lucide-react';

interface MenuItem {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  header?: string;
  roles?: string[];
  requiredTags?: string[];
  submenu?: Omit<MenuItem, 'header' | 'submenu'>[];
}

interface SidebarMenuItemsProps {
  location: {
    pathname: string;
  };
}

const SidebarMenuItems: React.FC<SidebarMenuItemsProps> = ({ location }) => {
  const { userRole, userTags, isAdmin, hasFinanceiroAccess } = useAuth();
  const { toggleMenu, isMenuExpanded } = useSidebarState();
  
  const allMenuItems: MenuItem[] = [
    { icon: Home, label: "Dashboard", path: "/dashboard", roles: ['admin', 'user', 'empresa'] },
    { 
      header: "Admin", 
      roles: ['admin'],
      submenu: [
        { icon: UserCog, label: "Usuários", path: "/usuarios", roles: ['admin'] },
        { icon: Shield, label: "Permissões", path: "/usuarios/permissoes", roles: ['admin'] },
        { icon: CheckSquare, label: "Aprovações Pendentes", path: "/aprovacoes", roles: ['admin'] },
      ]
    },
    { 
      header: "Associados", 
      roles: ['admin'],
      submenu: [
        { icon: FileCheck, label: "Aprovar Interessados", path: "/associados/aprovacao", roles: ['admin'] },
        { icon: UserPlus, label: "Cadastrar", path: "/associados/cadastro", roles: ['admin'] },
        { icon: Search, label: "Pesquisar", path: "/associados/pesquisa", roles: ['admin', 'user'] },
        { icon: Users, label: "Listar Todos", path: "/associados/listar", roles: ['admin'] },
        { icon: CreditCard, label: "Gerar Carteirinha", path: "/carteirinhas", roles: ['admin'] },
      ]
    },
    { 
      header: "Empresas", 
      roles: ['admin'],
      submenu: [
        { icon: Building, label: "Cadastrar", path: "/empresas/cadastro", roles: ['admin'] },
        { icon: Search, label: "Pesquisar", path: "/empresas/pesquisa", roles: ['admin'] },
        { icon: Inbox, label: "Sugestões", path: "/empresas/sugestoes", roles: ['admin'] },
      ]
    },
    { 
      header: "Financeiro", 
      roles: ['admin'],
      requiredTags: ['financeiro'],
      submenu: [
        { icon: BarChart, label: "Resumo", path: "/financeiro", roles: ['admin'], requiredTags: ['financeiro'] },
        { icon: UserCheck, label: "Associados", path: "/financeiro/associados", roles: ['admin'], requiredTags: ['financeiro'] },
        { icon: DollarSign, label: "Integrações", path: "/financeiro/integracao", roles: ['admin'], requiredTags: ['financeiro'] },
        { icon: FileText, label: "Relatórios", path: "/financeiro/relatorios", roles: ['admin'], requiredTags: ['financeiro'] },
      ]
    },
    { 
      header: "Configurações", 
      roles: ['admin'],
      submenu: [
        { icon: Settings, label: "Configurações", path: "/configuracoes", roles: ['admin'] },
      ]
    },
    { 
      header: "Área do Associado", 
      roles: ['user'],
      submenu: [
        { icon: CreditCard, label: "Meus Pagamentos", path: "/meus-pagamentos", roles: ['user'] },
        { icon: CreditCard, label: "Solicitar Carteirinha", path: "/solicitar-carteirinha", roles: ['user'] },
        { icon: ClipboardList, label: "Atualizar Dados", path: "/perfil", roles: ['user'] },
        { icon: Building, label: "Empresas Conveniadas", path: "/empresas-conveniadas", roles: ['user'] },
      ]
    },
    { 
      header: "Área da Empresa", 
      roles: ['empresa'],
      submenu: [
        { icon: ClipboardList, label: "Atualizar Dados", path: "/perfil", roles: ['empresa'] },
      ]
    },
    { 
      header: "Comunicação", 
      roles: ['admin', 'user', 'empresa'],
      submenu: [
        { icon: MessageSquare, label: "Mensagens", path: "/mensagens", roles: ['admin', 'user', 'empresa'] },
      ]
    },
  ];
  
  // Filter menu items based on user role and required tags
  const menuItems = allMenuItems.filter(item => {
    // Check if user has the appropriate role
    if (item.roles && userRole) {
      if (!item.roles.includes(userRole) && !isAdmin) {
        return false;
      }
    }
    
    // Check if menu item has required tags
    if (item.requiredTags && item.requiredTags.includes('financeiro')) {
      return hasFinanceiroAccess;
    }
    
    return true;
  });
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const renderMenu = (item: MenuItem) => {
    // Filter submenu items based on user role and required tags
    if (item.submenu) {
      const filteredSubmenu = item.submenu.filter(subItem => {
        // Check if user has appropriate role
        if (subItem.roles && userRole) {
          if (!subItem.roles.includes(userRole) && !isAdmin) {
            return false;
          }
        }
        
        // Check if submenu item has required tags
        if (subItem.requiredTags && subItem.requiredTags.includes('financeiro')) {
          return hasFinanceiroAccess;
        }
        
        return true;
      });
      
      // Don't render the header if it has no valid submenu items
      if (filteredSubmenu.length === 0) {
        return null;
      }
      
      // Update the item with filtered submenu
      item = { ...item, submenu: filteredSubmenu };
    }
    
    if (item.header) {
      return (
        <SidebarSubmenu
          key={item.header}
          header={item.header}
          submenu={item.submenu || []}
          isExpanded={isMenuExpanded(item.header)}
          toggleMenu={() => toggleMenu(item.header!)}
          isActive={isActive}
        />
      );
    }
    
    return (
      <SidebarMenuItem
        key={item.path}
        icon={item.icon}
        label={item.label}
        path={item.path}
        isActive={isActive(item.path!)}
      />
    );
  };

  return (
    <>
      {menuItems.map(renderMenu)}
    </>
  );
};

export default SidebarMenuItems;
