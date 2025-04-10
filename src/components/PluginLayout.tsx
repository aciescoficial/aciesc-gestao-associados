import React, { useState } from 'react';
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
  BarChart
} from 'lucide-react';
import UserProfileMenu from './auth/UserProfileMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const PluginLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { header: "Admin" },
    { icon: UserCog, label: "Usuários", path: "/usuarios/gerenciar" },
    { icon: Shield, label: "Permissões", path: "/usuarios/permissoes" },
    { header: "Conveniados" },
    { icon: UserPlus, label: "Cadastrar", path: "/conveniados/cadastrar" },
    { icon: CheckSquare, label: "Aprovação Pendente", path: "/conveniados/pendentes" },
    { icon: CreditCard, label: "Gerar Carteirinha", path: "/conveniados/carteirinha" },
    { icon: Search, label: "Pesquisar", path: "/conveniados/pesquisar" },
    { icon: Users, label: "Listar Todos", path: "/conveniados/listar" },
    { header: "Empresas" },
    { icon: Building, label: "Cadastrar", path: "/empresas/cadastrar" },
    { icon: CheckSquare, label: "Aprovação Pendente", path: "/empresas/pendentes" },
    { icon: Search, label: "Pesquisar", path: "/empresas/pesquisar" },
    { header: "Financeiro" },
    { icon: BarChart, label: "Resumo", path: "/financeiro/resumo" },
    { icon: UserCheck, label: "Associados", path: "/financeiro/associados" },
    { icon: DollarSign, label: "Integrações", path: "/financeiro/integracoes" },
    { icon: FileText, label: "Relatórios", path: "/financeiro/relatorios" },
    { header: "Configurações" },
    { icon: Settings, label: "Configurações", path: "/configuracoes" },
  ];
  
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
