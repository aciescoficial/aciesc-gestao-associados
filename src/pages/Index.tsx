
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
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
      
      <Route path="/conveniados/cadastrar" element={
        <ProtectedRoute>
          <PluginLayout>
            <CadastroConveniado />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/conveniados/listar" element={
        <ProtectedRoute>
          <PluginLayout>
            <ListaConveniados />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/conveniados/pendentes" element={
        <ProtectedRoute>
          <PluginLayout>
            <AprovacoesPendentes />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/conveniados/carteirinha" element={
        <ProtectedRoute>
          <PluginLayout>
            <GeradorCarteirinha />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/conveniados/pesquisar" element={
        <ProtectedRoute>
          <PluginLayout>
            <PesquisaConveniado />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/empresas/cadastrar" element={
        <ProtectedRoute>
          <PluginLayout>
            <CadastroEmpresa />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/empresas/pendentes" element={
        <ProtectedRoute>
          <PluginLayout>
            <AprovacoesPendentes />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/empresas/pesquisar" element={
        <ProtectedRoute>
          <PluginLayout>
            <PesquisaEmpresa />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/financeiro/integracoes" element={
        <ProtectedRoute>
          <PluginLayout>
            <IntegracaoFinanceira />
          </PluginLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/financeiro/relatorios" element={
        <ProtectedRoute>
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
