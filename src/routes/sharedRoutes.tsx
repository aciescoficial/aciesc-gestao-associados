
import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import AppLoading from '../components/shared/AppLoading';
import AdminUserSetup from '../components/auth/AdminUserSetup';
import AssociadoSignupCompletion from '@/components/associado/AssociadoSignupCompletion';
import { ProtectedRoute } from '../pages/AuthRoutes';
import PluginLayout from '../components/PluginLayout';
import Dashboard from '../components/Dashboard';

const ProfilePage = lazy(() => import("../components/auth/profile/ProfilePage"));

const PageLoading = () => <AppLoading message="Carregando página..." />;

export const SharedRoutes = [
  // Rotas públicas sem proteção
  <Route key="associado-signup-completion" path="/associado/signup/completion" element={
    <Suspense fallback={<PageLoading />}>
      <AssociadoSignupCompletion />
    </Suspense>
  } />,

  <Route key="admin-setup" path="/admin/setup" element={
    <Suspense fallback={<PageLoading />}>
      <AdminUserSetup />
    </Suspense>
  } />,

  // Rotas protegidas que exigem autenticação
  <Route key="dashboard" path="/dashboard" element={
    <ProtectedRoute>
      <PluginLayout>
        <Dashboard />
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="perfil" path="/perfil" element={
    <ProtectedRoute>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <ProfilePage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />
];
