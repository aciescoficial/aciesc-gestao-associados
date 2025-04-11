
import React from 'react';
import { useLocation } from 'react-router-dom';
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
  ChevronDown,
  ChevronRight,
  UserCheck,
  BarChart,
  MessageSquare,
  CreditCard as Payment,
  ClipboardList
} from 'lucide-react';
import { useAuth } from './auth/AuthProvider';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserProfileMenu from './auth/UserProfileMenu';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { useSidebarState } from '@/hooks/use-sidebar-state';

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  header?: string;
  roles?: string[];
  submenu?: Omit<MenuItem, 'header' | 'submenu'>[];
}

const PluginLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isAdmin, userRole } = useAuth();
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
      ]
    },
    { 
      header: "Financeiro", 
      roles: ['admin'],
      submenu: [
        { icon: BarChart, label: "Resumo", path: "/financeiro", roles: ['admin'] },
        { icon: UserCheck, label: "Associados", path: "/financeiro/associados", roles: ['admin'] },
        { icon: DollarSign, label: "Integrações", path: "/financeiro/integracao", roles: ['admin'] },
        { icon: FileText, label: "Relatórios", path: "/financeiro/relatorios", roles: ['admin'] },
      ]
    },
    { 
      header: "Configurações", 
      roles: ['admin'],
      submenu: [
        { icon: Settings, label: "Configurações", path: "/configuracoes", roles: ['admin'] },
      ]
    },
    // Associado specific menu items
    { 
      header: "Área do Associado", 
      roles: ['user'],
      submenu: [
        { icon: Payment, label: "Meus Pagamentos", path: "/meus-pagamentos", roles: ['user'] },
        { icon: CreditCard, label: "Solicitar Carteirinha", path: "/solicitar-carteirinha", roles: ['user'] },
        { icon: ClipboardList, label: "Atualizar Dados", path: "/perfil", roles: ['user'] },
        { icon: Building, label: "Empresas Conveniadas", path: "/empresas-conveniadas", roles: ['user'] },
      ]
    },
    // Empresa specific menu items
    { 
      header: "Área da Empresa", 
      roles: ['empresa'],
      submenu: [
        { icon: ClipboardList, label: "Atualizar Dados", path: "/perfil", roles: ['empresa'] },
      ]
    },
    // Mensagens for all users
    { 
      header: "Comunicação", 
      roles: ['admin', 'user', 'empresa'],
      submenu: [
        { icon: MessageSquare, label: "Mensagens", path: "/mensagens", roles: ['admin', 'user', 'empresa'] },
      ]
    },
  ];
  
  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    if (!item.roles) return false;
    return userRole && item.roles.includes(userRole);
  });
  
  const isActive = (path: string) => location.pathname === path;

  const renderMenu = (item: MenuItem) => {
    if (item.header) {
      const isExpanded = isMenuExpanded(item.header);
      
      return (
        <SidebarGroup key={item.header}>
          <div 
            className="flex items-center justify-between cursor-pointer py-2 px-2"
            onClick={() => toggleMenu(item.header!)}
          >
            <SidebarGroupLabel>{item.header}</SidebarGroupLabel>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
          
          {isExpanded && item.submenu && item.submenu.length > 0 && (
            <SidebarGroupContent>
              <SidebarMenu>
                {item.submenu.map((subItem, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(subItem.path!)}
                      tooltip={subItem.label}
                    >
                      <a href={subItem.path!} className={cn("flex items-center", 
                        isActive(subItem.path!) && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}>
                        {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                        <span>{subItem.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      );
    }
    
    return (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton 
          asChild 
          isActive={isActive(item.path!)}
          tooltip={item.label}
        >
          <a href={item.path!} className={cn("flex items-center",
            isActive(item.path!) && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}>
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            <span>{item.label}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="py-4">
            <div className="px-2 flex items-center justify-between">
              <h1 className="text-xl font-bold">ACIESC</h1>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            {menuItems.map((item) => renderMenu(item))}
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <div className="wp-admin-bar">
            <div className="flex items-center">
              <span>Gestão ACIESC</span>
            </div>
            <div className="flex items-center gap-4">
              <UserProfileMenu />
            </div>
          </div>

          <main className="flex-1 p-6 bg-wp-body overflow-auto">
            <div className="wp-container">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PluginLayout;
