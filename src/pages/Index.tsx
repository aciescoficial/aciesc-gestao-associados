
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { useAuth } from '@/components/auth/AuthProvider';
import ListaConveniados from '@/components/conveniado/ListaConveniados';
import AssociadosPage from '@/components/financeiro/AssociadosPage';
import FinanceiroResumoPage from '@/components/financeiro/FinanceiroResumoPage';

// Placeholder component for Cobranças page
const CobrancasPage = () => (
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
const MensagensPage = () => (
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
const PagamentosAssociadoPage = () => (
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
const SolicitarCarteirinhaPage = () => (
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
const EmpresasConveniadasPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Empresas Conveniadas</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página de empresas conveniadas está em construção.
      </p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, loading, userRole, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <PluginLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </PluginLayout>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Admin can access everything
  if (isAdmin) {
    return <>{children}</>;
  }
  
  // Check if current user role is allowed
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <PluginLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </PluginLayout>
    );
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const Index: React.FC = () => {
  const { userRole, isAdmin } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <PluginLayout>
            <Dashboard />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/perfil" element={
        <ProtectedRoute>
          <PluginLayout>
            <ProfilePage />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      {/* Admin only routes */}
      <Route path="/usuarios/gerenciar" element={
        <AdminRoute>
          <PluginLayout>
            <UserManagement />
          </PluginLayout>
        </AdminRoute>
      } />
      
      <Route path="/usuarios/permissoes" element={
        <AdminRoute>
          <PluginLayout>
            <PermissionPanel />
          </PluginLayout>
        </AdminRoute>
      } />
      
      {/* Admin, Diretoria routes */}
      <Route path="/conveniados/cadastrar" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <CadastroConveniado />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/conveniados/listar" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <ListaConveniados />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/conveniados/pendentes" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <AprovacoesPendentes />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/conveniados/carteirinha" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <GeradorCarteirinha />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      {/* Admin, Diretoria, Empresa routes */}
      <Route path="/conveniados/pesquisar" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria', 'conveniado']}>
          <PluginLayout>
            <PesquisaConveniado />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      {/* Admin, Diretoria routes */}
      <Route path="/empresas/cadastrar" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <CadastroEmpresa />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/empresas/pendentes" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <AprovacoesPendentes />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/empresas/pesquisar" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <PesquisaEmpresa />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      {/* Admin, Diretoria routes */}
      <Route path="/financeiro/resumo" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <FinanceiroResumoPage />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/financeiro/cobrancas" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <CobrancasPage />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/financeiro/associados" element={
        <AdminRoute>
          <PluginLayout>
            <AssociadosPage />
          </PluginLayout>
        </AdminRoute>
      } />
      
      <Route path="/financeiro/integracoes" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <IntegracaoFinanceira />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/financeiro/relatorios" element={
        <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
          <PluginLayout>
            <Dashboard />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes" element={
        <AdminRoute>
          <PluginLayout>
            <Dashboard />
          </PluginLayout>
        </AdminRoute>
      } />
      
      {/* Associado specific routes */}
      <Route path="/meus-pagamentos" element={
        <ProtectedRoute allowedRoles={['associado']}>
          <PluginLayout>
            <PagamentosAssociadoPage />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/solicitar-carteirinha" element={
        <ProtectedRoute allowedRoles={['associado']}>
          <PluginLayout>
            <SolicitarCarteirinhaPage />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/empresas-conveniadas" element={
        <ProtectedRoute allowedRoles={['associado']}>
          <PluginLayout>
            <EmpresasConveniadasPage />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      {/* Mensagens route - accessible to all users */}
      <Route path="/mensagens" element={
        <ProtectedRoute>
          <PluginLayout>
            <MensagensPage />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={
        <ProtectedRoute>
          <PluginLayout>
            <Dashboard />
          </PluginLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default Index;
