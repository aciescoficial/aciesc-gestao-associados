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
  ClipboardList
} from 'lucide-react';
import UserProfileMenu from './auth/UserProfileMenu';
import { useAuth } from './auth/AuthProvider';
import { LucideIcon } from 'lucide-react';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAdmin, isAssociado, isEmpresa, userRole } = useAuth();
  
  const allMenuItems: MenuItem[] = [
    { icon: Home, label: "Dashboard", path: "/dashboard", roles: ['admin', 'user', 'empresa'] },
    { header: "Admin", roles: ['admin'] },
    { icon: UserCog, label: "Usuários", path: "/usuarios", roles: ['admin'] },
    { icon: Shield, label: "Permissões", path: "/usuarios/permissoes", roles: ['admin'] },
    { icon: CheckSquare, label: "Aprovações Pendentes", path: "/aprovacoes", roles: ['admin'] },
    { header: "Associados", roles: ['admin'] },
    { icon: UserPlus, label: "Cadastrar", path: "/associados/cadastro", roles: ['admin'] },
    { icon: Search, label: "Pesquisar", path: "/associados/pesquisa", roles: ['admin', 'user'] },
    { icon: Users, label: "Listar Todos", path: "/associados/listar", roles: ['admin'] },
    { icon: CreditCard, label: "Gerar Carteirinha", path: "/carteirinhas", roles: ['admin'] },
    { header: "Empresas", roles: ['admin'] },
    { icon: Building, label: "Cadastrar", path: "/empresas/cadastro", roles: ['admin'] },
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen">
      <div className={`wp-sidebar transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className={`px-4 py-6 flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
          {!sidebarCollapsed && <h1 className="text-xl font-bold">ACIESC</h1>}
          {sidebarCollapsed && <span className="text-xl font-bold">A</span>}
        </div>
        <nav>
          {menuItems.map((item, index) => (
            item.header ? (
              sidebarCollapsed ? null : (
                <div key={index} className="wp-sidebar-header">{item.header}</div>
              )
            ) : (
              <Link 
                key={index} 
                to={item.path!}
                className={`wp-sidebar-link flex items-center gap-2 ${isActive(item.path!) ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {item.icon && <item.icon size={18} />}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            )
          ))}
        </nav>
        <button 
          className="absolute top-1/2 -right-3 bg-aciesc-primary text-white rounded-full p-1 shadow-md hover:bg-aciesc-dark transition-colors"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expandir menu" : "Retrair menu"}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

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
  );
};

export default PluginLayout;
