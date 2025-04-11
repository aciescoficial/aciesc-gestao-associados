
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './AuthRoutes';
import { 
  LayoutWrapper,
  CobrancasPage,
  MensagensPage,
  PagamentosAssociadoPage,
  SolicitarCarteirinhaPage,
  EmpresasConveniadasPage,
  EmpresasPesquisaPage
} from './RouteComponents';

// Component imports
import Dashboard from '@/components/Dashboard';
import CadastroAssociado from '@/components/CadastroAssociado';
import CadastroEmpresa from '@/components/CadastroEmpresa';
import PesquisaAssociado from '@/components/PesquisaAssociado';
import PesquisaEmpresa from '@/components/PesquisaEmpresa';
import AprovacoesPendentes from '@/components/AprovacoesPendentes';
import GeradorCarteirinha from '@/components/carteirinha/GeradorCarteirinha';
import IntegracaoFinanceira from '@/components/IntegracaoFinanceira';
import UserManagement from '@/components/usuarios/UserManagement';
import PermissionPanel from '@/components/usuarios/PermissionPanel';
import ProfilePage from '@/components/auth/ProfilePage';
import ListaAssociados from '@/components/associado/ListaAssociados';
import AssociadosPage from '@/components/financeiro/AssociadosPage';
import FinanceiroResumoPage from '@/components/financeiro/FinanceiroResumoPage';
import ConfiguracoesPage from '@/components/configuracoes/ConfiguracoesPage';

const Index: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard route - accessible to all authenticated users */}
      <Route path="/" element={
        <ProtectedRoute>
          <LayoutWrapper>
            <Dashboard />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      {/* Profile route - accessible to all authenticated users */}
      <Route path="/perfil" element={
        <ProtectedRoute>
          <LayoutWrapper>
            <ProfilePage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      {/* Admin only routes */}
      <Route path="/usuarios/gerenciar" element={
        <AdminRoute>
          <LayoutWrapper>
            <UserManagement />
          </LayoutWrapper>
        </AdminRoute>
      } />
      
      <Route path="/usuarios/permissoes" element={
        <AdminRoute>
          <LayoutWrapper>
            <PermissionPanel />
          </LayoutWrapper>
        </AdminRoute>
      } />
      
      {/* Admin routes - formerly diretoria */}
      <Route path="/associados/cadastrar" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <CadastroAssociado />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/associados/listar" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <ListaAssociados />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/associados/pendentes" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <AprovacoesPendentes />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/associados/carteirinha" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <GeradorCarteirinha />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      {/* Admin, User routes */}
      <Route path="/associados/pesquisar" element={
        <ProtectedRoute allowedRoles={['admin', 'user']}>
          <LayoutWrapper>
            <PesquisaAssociado />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/empresas/cadastrar" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <CadastroEmpresa />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/empresas/pendentes" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <AprovacoesPendentes />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/empresas/pesquisar" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <PesquisaEmpresa />
          </LayoutWrapper>
        </ProtectedRoute>
      } />

      <Route path="/empresas/buscar" element={
        <ProtectedRoute allowedRoles={['admin', 'user', 'empresa']}>
          <LayoutWrapper>
            <EmpresasPesquisaPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/financeiro/resumo" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <FinanceiroResumoPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/financeiro/cobrancas" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <CobrancasPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/financeiro/associados" element={
        <AdminRoute>
          <LayoutWrapper>
            <AssociadosPage />
          </LayoutWrapper>
        </AdminRoute>
      } />
      
      <Route path="/financeiro/integracoes" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <IntegracaoFinanceira />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/financeiro/relatorios" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LayoutWrapper>
            <Dashboard />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes" element={
        <AdminRoute>
          <LayoutWrapper>
            <ConfiguracoesPage />
          </LayoutWrapper>
        </AdminRoute>
      } />
      
      {/* User specific routes (formerly associado) */}
      <Route path="/meus-pagamentos" element={
        <ProtectedRoute allowedRoles={['user']}>
          <LayoutWrapper>
            <PagamentosAssociadoPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/solicitar-carteirinha" element={
        <ProtectedRoute allowedRoles={['user']}>
          <LayoutWrapper>
            <SolicitarCarteirinhaPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      <Route path="/empresas-conveniadas" element={
        <ProtectedRoute allowedRoles={['user']}>
          <LayoutWrapper>
            <EmpresasConveniadasPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      {/* Mensagens route - accessible to all users */}
      <Route path="/mensagens" element={
        <ProtectedRoute>
          <LayoutWrapper>
            <MensagensPage />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
      
      {/* Default route */}
      <Route path="*" element={
        <ProtectedRoute>
          <LayoutWrapper>
            <Dashboard />
          </LayoutWrapper>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default Index;
