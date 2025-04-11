
import React, { lazy, Suspense } from "react";
import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import RouteComponents from "./pages/RouteComponents";
import { ProtectedRoute, AdminRoute } from "./pages/AuthRoutes";
import PluginLayout from "./components/PluginLayout";
import LoginPage from "./components/auth/LoginPage";
import NotFound from "./pages/NotFound";

// Página de configurações
const ConfiguracoesPage = lazy(() => import("./components/configuracoes/ConfiguracoesPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-4">Carregando...</div>}>
      <Routes>
        <Route path="/auth/*" element={<RouteComponents.Index />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Redirect from root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />

        {/* Fixed route by using element with children prop properly through Outlet */}
        <Route path="/" element={<PluginLayout><Outlet /></PluginLayout>}>
          <Route path="/dashboard" element={<RouteComponents.Dashboard />} />

          <Route path="/associados/cadastro" element={<RouteComponents.CadastroAssociado />} />
          <Route path="/associados/pesquisa" element={<RouteComponents.PesquisaAssociado />} />
          <Route path="/associados/listar" element={<RouteComponents.ListaAssociados />} />

          <Route path="/empresas/cadastro" element={<RouteComponents.CadastroEmpresa />} />
          <Route path="/empresas/pesquisa" element={<RouteComponents.PesquisaEmpresa />} />
          <Route path="/empresas/pendentes" element={<RouteComponents.AprovacoesPendentes />} />

          <Route path="/aprovacoes" element={<RouteComponents.AprovacoesPendentes />} />

          <Route path="/carteirinhas" element={<RouteComponents.GeradorCarteirinha />} />

          <Route path="/financeiro" element={<RouteComponents.FinanceiroResumoPage />} />
          <Route path="/financeiro/associados" element={<RouteComponents.AssociadosPage />} />
          <Route path="/financeiro/integracao" element={<RouteComponents.IntegracaoFinanceira />} />
          <Route path="/financeiro/relatorios" element={<RouteComponents.Dashboard />} />

          <Route path="/mensagens" element={<RouteComponents.MensagensPage />} />
          
          {/* Usuários routes */}
          <Route path="/usuarios" element={<RouteComponents.UserManagement />} />
          <Route path="/usuarios/gerenciar" element={<RouteComponents.UserManagement />} />
          <Route path="/usuarios/permissoes" element={<RouteComponents.PermissionPanel />} />
          
          <Route path="/perfil" element={<RouteComponents.ProfilePage />} />
          
          {/* Associado specific routes */}
          <Route path="/meus-pagamentos" element={<RouteComponents.PagamentosAssociadoPage />} />
          <Route path="/solicitar-carteirinha" element={<RouteComponents.SolicitarCarteirinhaPage />} />
          <Route path="/empresas-conveniadas" element={<RouteComponents.EmpresasConveniadasPage />} />
          
          {/* Nova rota para configurações */}
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
