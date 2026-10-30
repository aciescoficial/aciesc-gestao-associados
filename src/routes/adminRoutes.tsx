
import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import { AdminRoute, ProtectedRoute } from "../pages/AuthRoutes";
import PluginLayout from "../components/PluginLayout";
import AppLoading from "../components/shared/AppLoading";

// Import components
const CadastrarAssociado = lazy(() => import("../components/associado/CadastrarAssociado"));
const PesquisarAssociado = lazy(() => import("../components/associado/PesquisarAssociado"));
const CadastrarEmpresa = lazy(() => import("../components/empresa/CadastrarEmpresa"));
const PesquisarEmpresa = lazy(() => import("../components/empresa/PesquisarEmpresa"));
const Aprovacoes = lazy(() => import("../components/aprovacoes/Aprovacoes"));
const UserManagement = lazy(() => import("../components/usuarios/UserManagement"));
const PermissionPanel = lazy(() => import("../components/usuarios/permission/PermissionPanel"));
const ConfiguracoesPage = lazy(() => import("../components/configuracoes/ConfiguracoesPage"));
const InteressadosPage = lazy(() => import("../components/associado/InteressadosPage"));
const GeradorCarteirinha = lazy(() => import("../components/carteirinha/GeradorCarteirinha"));
const EmpresaSugestoes = lazy(() => import("../components/empresa/EmpresaSugestoes"));
const EmpresaDetailPage = lazy(() => import("../components/empresa/EmpresaDetailPage"));
const MessagesDashboard = lazy(() => import("../components/mensagens/MessagesDashboard"));
const MensagensPage = lazy(() => import("../components/mensagens/MensagensPage"));
const UserManagementPage = lazy(() => import("../components/associado/user/UserManagementPage"));

const PageLoading = () => <AppLoading message="Carregando página..." />;

export const AdminRoutes = [
  // Admin-only routes
  <Route key="associados-cadastrar" path="/associados/cadastrar" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <CadastrarAssociado />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-cadastrar" path="/empresas/cadastrar" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <CadastrarEmpresa />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-pesquisar" path="/empresas/pesquisar" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <PesquisarEmpresa />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-detalhes" path="/empresas/detalhes/:id" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <EmpresaDetailPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-editar" path="/empresas/editar/:id" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <CadastrarEmpresa />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-sugestoes" path="/empresas/sugestoes" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <EmpresaSugestoes />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  // Admin approval routes
  <Route key="associados-interessados" path="/associados/interessados" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <InteressadosPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-carteirinha" path="/associados/carteirinha" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <GeradorCarteirinha />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,

  // Rota de Aprovações (agora com ambas funcionalidades)
  <Route key="aprovacoes" path="/aprovacoes" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <Aprovacoes />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,

  // Usuários routes
  <Route key="usuarios" path="/usuarios" element={
    <PluginLayout>
      <Suspense fallback={<PageLoading />}>
        <UserManagement />
      </Suspense>
    </PluginLayout>
  } />,
  
  <Route key="usuarios-gerenciar" path="/usuarios/gerenciar" element={
    <PluginLayout>
      <Suspense fallback={<PageLoading />}>
        <UserManagement />
      </Suspense>
    </PluginLayout>
  } />,
  
  <Route key="usuarios-permissoes" path="/usuarios/permissoes" element={
    <PluginLayout>
      <Suspense fallback={<PageLoading />}>
        <PermissionPanel />
      </Suspense>
    </PluginLayout>
  } />,
  
  // Configurações route
  <Route key="configuracoes" path="/configuracoes" element={
    <AdminRoute>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <ConfiguracoesPage />
        </Suspense>
      </PluginLayout>
    </AdminRoute>
  } />,
  
  // Add missing routes for messages
  <Route key="mensagens" path="/mensagens" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <MessagesDashboard />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="mensagens-enviar" path="/mensagens/enviar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <MensagensPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  // Add the route for associate user management
  <Route key="associados-usuario" path="/associados/usuario/:id" element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <UserManagementPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
];
