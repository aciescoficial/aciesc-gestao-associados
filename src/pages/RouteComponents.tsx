
import React from 'react';
import PluginLayout from '@/components/PluginLayout';
import Dashboard from '@/components/Dashboard';
import CadastroConveniado from '@/components/CadastroConveniado';
import CadastroEmpresa from '@/components/CadastroEmpresa';
import PesquisaConveniado from '@/components/PesquisaConveniado';
import PesquisaEmpresa from '@/components/PesquisaEmpresa';
import AprovacoesPendentes from '@/components/AprovacoesPendentes';
import GeradorCarteirinha from '@/components/carteirinha/GeradorCarteirinha';
import IntegracaoFinanceira from '@/components/IntegracaoFinanceira';
import UserManagement from '@/components/usuarios/UserManagement';
import PermissionPanel from '@/components/usuarios/PermissionPanel';
import ProfilePage from '@/components/auth/ProfilePage';
import ListaConveniados from '@/components/conveniado/ListaConveniados';
import AssociadosPage from '@/components/financeiro/AssociadosPage';
import FinanceiroResumoPage from '@/components/financeiro/FinanceiroResumoPage';

// Placeholder component for Cobranças page
export const CobrancasPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Lista de Cobranças</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página está em construção.
      </p>
    </div>
  </div>
);

// Placeholder for messages page
export const MensagensPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Mensagens</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página de mensagens está em construção.
      </p>
    </div>
  </div>
);

// Placeholder for member payment page
export const PagamentosAssociadoPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Meus Pagamentos</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página de pagamentos está em construção.
      </p>
    </div>
  </div>
);

// Placeholder for member ID card request page
export const SolicitarCarteirinhaPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Solicitar Carteirinha</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página para solicitar carteirinha está em construção.
      </p>
    </div>
  </div>
);

// Placeholder for listing partner companies page
export const EmpresasConveniadasPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Empresas Conveniadas</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página de empresas conveniadas está em construção.
      </p>
    </div>
  </div>
);

// Layout wrapper component
export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <PluginLayout>
    {children}
  </PluginLayout>
);
