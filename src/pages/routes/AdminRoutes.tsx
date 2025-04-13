
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '../AuthRoutes';
import PluginLayout from '@/components/PluginLayout';

// Admin components
import CadastroAssociado from '@/components/CadastroAssociado';
import PesquisaAssociado from '@/components/PesquisaAssociado';
import AprovacoesPendentes from '@/components/AprovacoesPendentes';
import CadastroEmpresa from '@/components/CadastroEmpresa';
import EmpresasPesquisa from '@/components/empresa/EmpresasPesquisa';
import EmpresaSugestoes from '@/components/empresa/EmpresaSugestoes';
import GeradorCarteirinha from '@/components/carteirinha/GeradorCarteirinha';
import IntegracaoFinanceira from '@/components/IntegracaoFinanceira';
import UserManagement from '@/components/usuarios/UserManagement';
import PermissionPanel from '@/components/usuarios/PermissionPanel';
import FinanceiroResumoPage from '@/components/financeiro/FinanceiroResumoPage';
import AssociadosPage from '@/components/financeiro/AssociadosPage';
import ConfiguracoesPage from '@/components/configuracoes/ConfiguracoesPage';
import Dashboard from '@/components/Dashboard';

// Mensagens components
import MessagesDashboard from '@/components/mensagens/MessagesDashboard';
import MensagensPage from '@/components/mensagens/MensagensPage';

// Layout wrapper component to avoid circular dependencies
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PluginLayout>
    {children}
  </PluginLayout>
);

// Placeholder for CobrancasPage to avoid circular imports
const CobrancasPage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Lista de Cobranças</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página está em construção.
      </p>
    </div>
  </div>
);

export const AdminRoutes = [
  // Dashboard Route
  <Route key="admin-dashboard" path="/admin/dashboard" element={
    <AdminRoute>
      <LayoutWrapper>
        <Dashboard />
      </LayoutWrapper>
    </AdminRoute>
  } />,

  // User Management Routes
  <Route key="usuarios-gerenciar" path="/usuarios/gerenciar" element={
    <AdminRoute>
      <LayoutWrapper>
        <UserManagement />
      </LayoutWrapper>
    </AdminRoute>
  } />,
  
  <Route key="usuarios-permissoes" path="/usuarios/permissoes" element={
    <AdminRoute>
      <LayoutWrapper>
        <PermissionPanel />
      </LayoutWrapper>
    </AdminRoute>
  } />,
  
  // Associados Routes (Admin)
  <Route key="associados-cadastro" path="/associados/cadastro" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <CadastroAssociado />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-pendentes" path="/associados/pendentes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <AprovacoesPendentes />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-carteirinha" path="/associados/carteirinha" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <GeradorCarteirinha />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Empresas Routes (Admin)
  <Route key="empresas-cadastrar" path="/empresas/cadastrar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <CadastroEmpresa />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-pendentes" path="/empresas/pendentes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <AprovacoesPendentes />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-pesquisar" path="/empresas/pesquisar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <EmpresasPesquisa />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-sugestoes" path="/empresas/sugestoes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <EmpresaSugestoes />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Mensagens Routes (Admin)
  <Route key="mensagens" path="/mensagens" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <MessagesDashboard />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="mensagens-enviar" path="/mensagens/enviar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <MensagensPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Financeiro Routes (Admin)
  <Route key="financeiro-resumo" path="/financeiro/resumo" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <FinanceiroResumoPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="financeiro-cobrancas" path="/financeiro/cobrancas" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <CobrancasPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="financeiro-associados" path="/financeiro/associados" element={
    <AdminRoute>
      <LayoutWrapper>
        <AssociadosPage />
      </LayoutWrapper>
    </AdminRoute>
  } />,
  
  <Route key="financeiro-integracoes" path="/financeiro/integracoes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <IntegracaoFinanceira />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="financeiro-relatorios" path="/financeiro/relatorios" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <Dashboard />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="configuracoes" path="/configuracoes" element={
    <AdminRoute>
      <LayoutWrapper>
        <ConfiguracoesPage />
      </LayoutWrapper>
    </AdminRoute>
  } />,
];
