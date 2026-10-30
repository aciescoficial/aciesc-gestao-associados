
import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../pages/AuthRoutes";
import PluginLayout from "../components/PluginLayout";
import AppLoading from "../components/shared/AppLoading";

// Lazy load empresa components
const CadastrarEmpresa = lazy(() => import("../components/empresa/CadastrarEmpresa"));
const PesquisarEmpresa = lazy(() => import("../components/empresa/PesquisarEmpresa"));
const EmpresaProfile = lazy(() => import("../components/empresa/EmpresaProfile"));
const EmpresaDetailPage = lazy(() => import("../components/empresa/EmpresaDetailPage"));
const EmpresaSugestoes = lazy(() => import("../components/empresa/EmpresaSugestoes"));

const PageLoading = () => <AppLoading message="Carregando página..." />;

export const EmpresaRoutes = [
  // Company user routes
  <Route key="empresa-perfil" path="/empresa/perfil" element={
    <ProtectedRoute allowedRoles={['empresa']}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <EmpresaProfile />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,

  // Admin empresa routes
  <Route key="empresas-cadastrar" path="/empresas/cadastrar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <CadastrarEmpresa />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-pesquisar" path="/empresas/pesquisar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <PesquisarEmpresa />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-detalhes" path="/empresas/detalhes/:id" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <EmpresaDetailPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-editar" path="/empresas/editar/:id" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <CadastrarEmpresa />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-sugestoes" path="/empresas/sugestoes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <EmpresaSugestoes />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
];
