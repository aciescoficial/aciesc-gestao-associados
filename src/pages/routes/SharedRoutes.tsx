
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../AuthRoutes';
import { LayoutWrapper, MensagensPage, EmpresasPesquisaPage } from '../RouteComponents';
import Dashboard from '@/components/Dashboard';
import ProfilePage from '@/components/auth/ProfilePage';

// Routes shared across multiple user types
export const SharedRoutes = [
  // Dashboard route - accessible to all authenticated users
  <Route key="dashboard" path="/" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <Dashboard />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Profile route - accessible to all authenticated users
  <Route key="perfil" path="/perfil" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <ProfilePage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Empresa search - accessible to all users
  <Route key="empresas-buscar" path="/empresas/buscar" element={
    <ProtectedRoute allowedRoles={['admin', 'user', 'empresa']}>
      <LayoutWrapper>
        <EmpresasPesquisaPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Mensagens route - accessible to all users
  <Route key="mensagens" path="/mensagens" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <MensagensPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Default route (fallback to Dashboard)
  <Route key="default" path="*" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <Dashboard />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
];
