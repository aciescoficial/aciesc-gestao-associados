
import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../pages/AuthRoutes";
import PluginLayout from "../components/PluginLayout";
import AppLoading from "../components/shared/AppLoading";

// Lazily loaded components
const PesquisarAssociado = lazy(() => import("../components/associado/PesquisarAssociado"));
const PagamentosAssociadoPage = lazy(() => import("../components/associado/PagamentosAssociadoPage"));
const SolicitarCarteirinhaPage = lazy(() => import("../components/associado/SolicitarCarteirinhaPage"));
const EmpresasConveniadas = lazy(() => import("../components/associado/EmpresasConveniadas"));
const UserManagementPage = lazy(() => import("../components/associado/user/UserManagementPage"));

// Fallback component with custom loading time
const PageLoading = () => <AppLoading message="Carregando página..." />;

export const UserRoutes = [
  <Route key="associados-pesquisar" path="/associados/pesquisar" element={
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <PesquisarAssociado />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  // User (Associado) specific routes
  <Route key="meus-pagamentos" path="/meus-pagamentos" element={
    <ProtectedRoute allowedRoles={["user"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <PagamentosAssociadoPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="solicitar-carteirinha" path="/solicitar-carteirinha" element={
    <ProtectedRoute allowedRoles={["user"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <SolicitarCarteirinhaPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-conveniadas" path="/empresas-conveniadas" element={
    <ProtectedRoute allowedRoles={["user"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <EmpresasConveniadas />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  // Add user management route for associates
  <Route key="associados-usuario" path="/associados/usuario/:id" element={
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <UserManagementPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />
];
