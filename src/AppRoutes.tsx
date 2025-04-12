
import React, { lazy, Suspense } from "react";
import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import RouteComponents from "./pages/RouteComponents";
import { ProtectedRoute, AdminRoute } from "./pages/AuthRoutes";
import { FinanceiroRoutes } from "./pages/routes/FinanceiroRoutes";
import PluginLayout from "./components/PluginLayout";
import LoginPage from "./components/auth/LoginPage";
import NotFound from "./pages/NotFound";

// Página de configurações
const ConfiguracoesPage = lazy(() => import("./components/configuracoes/ConfiguracoesPage"));
// Formulário de interesse
const FormularioInteressePage = lazy(() => import("./components/associado/FormularioInteressePage"));
// Página de aprovação de interesse
const AprovacaoInteressePage = lazy(() => import("./components/associado/AprovacaoInteressePage"));
// Página de finalização de cadastro
const AssociadoSignupCompletion = lazy(() => import("./components/associado/AssociadoSignupCompletion"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-4">Carregando...</div>}>
      <Routes>
        <Route path="/auth/*" element={<RouteComponents.Index />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Standaline routes */}
        <Route path="/formulario-interesse" element={<FormularioInteressePage />} />
        <Route path="/associado-signup" element={<AssociadoSignupCompletion />} />
        
        {/* Redirect from root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />

        {/* Fixed route by using element with children prop properly through Outlet */}
        <Route path="/" element={<PluginLayout><Outlet /></PluginLayout>}>
          <Route path="/dashboard" element={<RouteComponents.Dashboard />} />

          {/* Admin-only routes */}
          <Route path="/associados/cadastro" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RouteComponents.CadastroAssociado />
            </ProtectedRoute>
          } />
          <Route path="/associados/pesquisa" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <RouteComponents.PesquisaAssociado />
            </ProtectedRoute>
          } />
          <Route path="/empresas/cadastro" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RouteComponents.CadastroEmpresa />
            </ProtectedRoute>
          } />
          <Route path="/empresas/pesquisa" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RouteComponents.PesquisaEmpresa />
            </ProtectedRoute>
          } />
          
          {/* Admin approval routes */}
          <Route path="/aprovacoes" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RouteComponents.AprovacoesPendentes />
            </ProtectedRoute>
          } />
          <Route path="/associados/aprovacao" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AprovacaoInteressePage />
            </ProtectedRoute>
          } />

          <Route path="/carteirinhas" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RouteComponents.GeradorCarteirinha />
            </ProtectedRoute>
          } />

          {/* Include Financeiro routes */}
          {FinanceiroRoutes}

          {/* Mensagens for all users */}
          <Route path="/mensagens" element={<RouteComponents.MensagensPage />} />
          
          {/* Usuários routes */}
          <Route path="/usuarios" element={<RouteComponents.UserManagement />} />
          <Route path="/usuarios/gerenciar" element={<RouteComponents.UserManagement />} />
          <Route path="/usuarios/permissoes" element={<RouteComponents.PermissionPanel />} />
          
          <Route path="/perfil" element={<RouteComponents.ProfilePage />} />
          
          {/* User (Associado) specific routes */}
          <Route path="/meus-pagamentos" element={
            <ProtectedRoute allowedRoles={["user"]}>
              <RouteComponents.PagamentosAssociadoPage />
            </ProtectedRoute>
          } />
          <Route path="/solicitar-carteirinha" element={
            <ProtectedRoute allowedRoles={["user"]}>
              <RouteComponents.SolicitarCarteirinhaPage />
            </ProtectedRoute>
          } />
          <Route path="/empresas-conveniadas" element={
            <ProtectedRoute allowedRoles={["user"]}>
              <RouteComponents.EmpresasConveniadasPage />
            </ProtectedRoute>
          } />
          
          {/* Nova rota para configurações */}
          <Route path="/configuracoes" element={
            <AdminRoute>
              <ConfiguracoesPage />
            </AdminRoute>
          } />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
