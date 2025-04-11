
import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
  UserCheck,
  BarChart,
  MessageSquare,
  CreditCard as Payment,
  ClipboardList,
  PanelLeft,
  PanelRight
} from 'lucide-react';
import UserProfileMenu from './auth/UserProfileMenu';
import { useAuth } from './auth/AuthProvider';
import { LucideIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  header?: string;
  roles?: string[];
}

const PluginLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isAdmin, isAssociado, isEmpresa, userRole } = useAuth();
  
  const allMenuItems: MenuItem[] = [
    { icon: Home, label: "Dashboard", path: "/dashboard", roles: ['admin', 'user', 'empresa'] },
    { header: "Admin", roles: ['admin'] },
    { icon: UserCog, label: "Usuários", path: "/usuarios", roles: ['admin'] },
    { icon: Shield, label: "Permissões", path: "/usuarios/permissoes", roles: ['admin'] },
    { header: "Associados", roles: ['admin'] },
    { icon: UserPlus, label: "Cadastrar", path: "/associados/cadastro", roles: ['admin'] },
    { icon: CheckSquare, label: "Aprovação Pendente", path: "/aprovacoes", roles: ['admin'] },
    { icon: CreditCard, label: "Gerar Carteirinha", path: "/carteirinhas", roles: ['admin'] },
    { icon: Search, label: "Pesquisar", path: "/associados/pesquisa", roles: ['admin', 'user'] },
    { icon: Users, label: "Listar Todos", path: "/associados/listar", roles: ['admin'] },
    { header: "Empresas", roles: ['admin'] },
    { icon: Building, label: "Cadastrar", path: "/empresas/cadastro", roles: ['admin'] },
    { icon: CheckSquare, label: "Aprovação Pendente", path: "/empresas/pendentes", roles: ['admin'] },
    { icon: Search, label: "Pesquisar", path: "/empresas/pesquisa", roles: ['admin'] },
    { header: "Financeiro", roles: ['admin'] },
    { icon: BarChart, label: "Resumo", path: "/financeiro", roles: ['admin'] },
    { icon: UserCheck, label: "Associados", path: "/financeiro/associados", roles: ['admin'] },
    { icon: DollarSign, label: "Integrações", path: "/financeiro/integracao", roles: ['admin'] },
    { icon: FileText, label: "Relatórios", path: "/financeiro/relatorios", roles: ['admin'] },
    { header: "Configurações", roles: ['admin'] },
    { icon: Settings, label: "Configurações", path: "/configuracoes", roles: ['admin'] },
    // Associado specific menu items
    { header: "Área do Associado", roles: ['user'] },
    { icon: Payment, label: "Meus Pagamentos", path: "/meus-pagamentos", roles: ['user'] },
    { icon: CreditCard, label: "Solicitar Carteirinha", path: "/solicitar-carteirinha", roles: ['user'] },
    { icon: ClipboardList, label: "Atualizar Dados", path: "/perfil", roles: ['user'] },
    { icon: Building, label: "Empresas Conveniadas", path: "/empresas-conveniadas", roles: ['user'] },
    // Empresa specific menu items
    { header: "Área da Empresa", roles: ['empresa'] },
    { icon: ClipboardList, label: "Atualizar Dados", path: "/perfil", roles: ['empresa'] },
    // Mensagens for all users
    { header: "Comunicação", roles: ['admin', 'user', 'empresa'] },
    { icon: MessageSquare, label: "Mensagens", path: "/mensagens", roles: ['admin', 'user', 'empresa'] },
  ];
  
  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    if (isAdmin) {
      return allMenuItems;
    }
    
    return allMenuItems.filter(item => {
      if (!item.roles) return false;
      return userRole && item.roles.includes(userRole);
    });
  }, [isAdmin, userRole]);
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-aciesc-primary">ACIESC</h1>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                item.header ? (
                  <div key={index} className="px-3 pt-4 pb-2 text-xs font-medium text-muted-foreground">
                    {item.header}
                  </div>
                ) : (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton 
                      tooltip={item.label}
                      asChild 
                      isActive={isActive(item.path!)}
                      variant={isActive(item.path!) ? "default" : "outline"}
                    >
                      <Link to={item.path!} className="flex items-center gap-2">
                        {item.icon && <item.icon size={18} />}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-border/40 hidden sm:block">
            <div className="flex items-center justify-center p-2 text-xs text-center text-muted-foreground">
              <span>ACIESC © {new Date().getFullYear()}</span>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <div className="wp-admin-bar flex items-center justify-between px-6 py-3 bg-aciesc-primary text-white border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-aciesc-dark rounded-md" />
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
