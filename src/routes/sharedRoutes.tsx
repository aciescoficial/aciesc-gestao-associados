import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import AppLoading from '../components/shared/AppLoading';
import AdminUserSetup from '../components/auth/AdminUserSetup';
import AssociadoSignupCompletion from '@/components/associado/AssociadoSignupCompletion';

const PageLoading = () => <AppLoading message="Carregando página..." />;

export const SharedRoutes = [
  <Route key="associado-signup-completion" path="/associado/signup/completion" element={
    <Suspense fallback={<PageLoading />}>
      <AssociadoSignupCompletion />
    </Suspense>
  } />,

  <Route key="admin-setup" path="/admin/setup" element={
    <Suspense fallback={<PageLoading />}>
      <AdminUserSetup />
    </Suspense>
  } />
];
