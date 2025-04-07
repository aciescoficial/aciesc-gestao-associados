
import React from 'react';
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
  UserCog
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const PluginLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
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
    { header: "Empresas" },
    { icon: Building, label: "Cadastrar", path: "/empresas/cadastrar" },
    { icon: CheckSquare, label: "Aprovação Pendente", path: "/empresas/pendentes" },
    { icon: Search, label: "Pesquisar", path: "/empresas/pesquisar" },
    { header: "Financeiro" },
    { icon: DollarSign, label: "Integrações", path: "/financeiro/integracoes" },
    { icon: FileText, label: "Relatórios", path: "/financeiro/relatorios" },
    { header: "Configurações" },
    { icon: Settings, label: "Configurações", path: "/configuracoes" },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen">
      {/* WordPress Admin Sidebar */}
      <div className="wp-sidebar">
        <div className="px-4 py-6 flex items-center">
          <h1 className="text-xl font-bold">ACIESC</h1>
        </div>
        <nav>
          {menuItems.map((item, index) => (
            item.header ? (
              <div key={index} className="wp-sidebar-header">{item.header}</div>
            ) : (
              <Link 
                key={index} 
                to={item.path!}
                className={`wp-sidebar-link flex items-center gap-2 ${isActive(item.path!) ? 'active' : ''}`}
              >
                {item.icon && <item.icon size={18} />}
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Admin Bar */}
        <div className="wp-admin-bar">
          <div className="flex items-center">
            <span>Gestão ACIESC</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Admin</span>
          </div>
        </div>

        {/* Content */}
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
