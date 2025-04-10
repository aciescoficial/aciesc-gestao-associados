
import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import RouteComponents from "./pages/RouteComponents";
import AuthRoutes from "./pages/AuthRoutes";
import PluginLayout from "./components/PluginLayout";

// Página de configurações
const ConfiguracoesPage = lazy(() => import("./components/configuracoes/ConfiguracoesPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-4">Carregando...</div>}>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/" element={<RouteComponents.Index />} />
        <Route path="*" element={<RouteComponents.NotFound />} />

        <Route path="/" element={<PluginLayout />}>
          <Route path="/dashboard" element={<RouteComponents.Dashboard />} />

          <Route path="/associados/cadastro" element={<RouteComponents.CadastroAssociado />} />
          <Route path="/associados/pesquisa" element={<RouteComponents.PesquisaAssociado />} />

          <Route path="/conveniados/cadastro" element={<RouteComponents.CadastroConveniado />} />
          <Route path="/conveniados/pesquisa" element={<RouteComponents.PesquisaConveniado />} />

          <Route path="/empresas/cadastro" element={<RouteComponents.CadastroEmpresa />} />
          <Route path="/empresas/pesquisa" element={<RouteComponents.PesquisaEmpresa />} />

          <Route path="/aprovacoes" element={<RouteComponents.AprovacoesPendentes />} />

          <Route path="/carteirinhas" element={<RouteComponents.GeradorCarteirinha />} />

          <Route path="/financeiro" element={<RouteComponents.FinanceiroResumoPage />} />
          <Route path="/financeiro/associados" element={<RouteComponents.AssociadoMembership />} />
          <Route path="/financeiro/integracao" element={<RouteComponents.IntegracaoFinanceira />} />

          <Route path="/mensagens" element={<RouteComponents.MensagensPage />} />
          <Route path="/usuarios" element={<RouteComponents.UserManagement />} />
          <Route path="/perfil" element={<RouteComponents.ProfilePage />} />
          
          {/* Nova rota para configurações */}
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
