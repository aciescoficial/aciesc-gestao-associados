
import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../pages/AuthRoutes";
import PluginLayout from "../components/PluginLayout";
import AppLoading from "../components/shared/AppLoading";

// Eagerly loaded components
import Dashboard from "../components/Dashboard";

// Lazily loaded components
const ProfilePage = lazy(() => import("../components/auth/profile/ProfilePage"));

// Fallback component with custom loading time
const PageLoading = () => <AppLoading message="Carregando página..." />;

export const SharedRoutes = [
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
