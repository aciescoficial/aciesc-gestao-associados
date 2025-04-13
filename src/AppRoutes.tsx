
import React, { lazy, Suspense } from "react";
import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./pages/AuthRoutes";
import { FinanceiroRoutes } from "./pages/routes/FinanceiroRoutes";
import { SharedRoutes } from "./pages/routes/SharedRoutes";
import PluginLayout from "./components/PluginLayout";
import { LoginPage } from "./components/auth"; // Updated import path
import NotFound from "./pages/NotFound";
import AppLoading from "./components/shared/AppLoading";

// Eagerly loaded components for critical paths
import Dashboard from "./components/Dashboard";

// Lazily loaded components for better performance
const RouteComponents = lazy(() => import("./pages/RouteComponents"));
const MessagesDashboard = lazy(() => import("./components/mensagens/MessagesDashboard"));
const MensagensPage = lazy(() => import("./components/mensagens/MensagensPage"));
const ConfiguracoesPage = lazy(() => import("./components/configuracoes/ConfiguracoesPage"));
const FormularioInteressePage = lazy(() => import("./components/associado/FormularioInteressePage"));
const AprovacaoInteressePage = lazy(() => import("./components/associado/AprovacaoInteressePage"));
const AssociadoSignupCompletion = lazy(() => import("./components/associado/AssociadoSignupCompletion"));
const GeradorCarteirinha = lazy(() => import("./components/carteirinha/GeradorCarteirinha"));
const SolicitarCarteirinhaPage = lazy(() => import("./components/associado/SolicitarCarteirinhaPage"));

// Fallback component with custom loading time
const PageLoading = () => <AppLoading message="Carregando página..." />;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={
        <Suspense fallback={<PageLoading />}>
          <RouteComponents />
        </Suspense>
      } />
      
      <Route path="/login" element={<LoginPage />} />
      
      {/* Standalone routes */}
      <Route path="/formulario-interesse" element={
        <Suspense fallback={<PageLoading />}>
          <FormularioInteressePage />
        </Suspense>
      } />
      
      <Route path="/associado-signup" element={
        <Suspense fallback={<PageLoading />}>
          <AssociadoSignupCompletion />
        </Suspense>
      } />
      
      {/* Redirect from root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch-all 404 route */}
      <Route path="*" element={<NotFound />} />

      {/* Include SharedRoutes */}
      {SharedRoutes}

      {/* Fixed route by using element with children prop properly through Outlet */}
      <Route path="/" element={<PluginLayout><Outlet /></PluginLayout>}>
        {/* Dashboard is eagerly loaded for performance */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin-only routes */}
        <Route path="/associados/cadastro" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<PageLoading />}>
              <RouteComponents.CadastroAssociado />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/associados/pesquisa" element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <Suspense fallback={<PageLoading />}>
              <RouteComponents.PesquisaAssociado />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/empresas/cadastro" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<PageLoading />}>
              <RouteComponents.CadastroEmpresa />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/empresas/pesquisa" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<PageLoading />}>
              <RouteComponents.PesquisaEmpresa />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Admin approval routes */}
        <Route path="/aprovacoes" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<PageLoading />}>
              <RouteComponents.AprovacoesPendentes />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/associados/aprovacao" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<PageLoading />}>
              <AprovacaoInteressePage />
            </Suspense>
          </ProtectedRoute>
        } />

        <Route path="/carteirinhas" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<PageLoading />}>
              <GeradorCarteirinha />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Include Financeiro routes with Suspense */}
        {FinanceiroRoutes}

        {/* Mensagens routes for all users */}
        <Route path="/mensagens" element={
          <Suspense fallback={<PageLoading />}>
            <MessagesDashboard />
          </Suspense>
        } />
        
        <Route path="/mensagens/enviar" element={
          <Suspense fallback={<PageLoading />}>
            <MensagensPage />
          </Suspense>
        } />
        
        {/* Usuários routes */}
        <Route path="/usuarios" element={
          <Suspense fallback={<PageLoading />}>
            <RouteComponents.UserManagement />
          </Suspense>
        } />
        
        <Route path="/usuarios/gerenciar" element={
          <Suspense fallback={<PageLoading />}>
            <RouteComponents.UserManagement />
          </Suspense>
        } />
        
        <Route path="/usuarios/permissoes" element={
          <Suspense fallback={<PageLoading />}>
            <RouteComponents.PermissionPanel />
          </Suspense>
        } />
        
        <Route path="/perfil" element={
          <Suspense fallback={<PageLoading />}>
            <RouteComponents.ProfilePage />
          </Suspense>
        } />
        
        {/* User (Associado) specific routes */}
        <Route path="/meus-pagamentos" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Suspense fallback={<PageLoading />}>
              <RouteComponents.PagamentosAssociadoPage />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/solicitar-carteirinha" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Suspense fallback={<PageLoading />}>
              <SolicitarCarteirinhaPage />
            </Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/empresas-conveniadas" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Suspense fallback={<PageLoading />}>
              <RouteComponents.EmpresasConveniadasPage />
            </Suspense>
          </ProtectedRoute>
        } />
        
        {/* Nova rota para configurações */}
        <Route path="/configuracoes" element={
          <AdminRoute>
            <Suspense fallback={<PageLoading />}>
              <ConfiguracoesPage />
            </Suspense>
          </AdminRoute>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
