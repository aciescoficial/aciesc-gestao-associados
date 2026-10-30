
import React from 'react';
import { Route } from 'react-router-dom';
import { AdminRoute } from '../../AuthRoutes';
import PluginLayout from '@/components/PluginLayout';
import Dashboard from '@/components/Dashboard';
import ConfiguracoesPage from '@/components/configuracoes/ConfiguracoesPage';

export const SystemRoutes = [
  <Route key="admin-dashboard" path="/admin/dashboard" element={
    <AdminRoute>
      <PluginLayout>
        <Dashboard />
      </PluginLayout>
    </AdminRoute>
  } />,
  
  <Route key="configuracoes" path="/configuracoes" element={
    <AdminRoute>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <ConfiguracoesPage />
        </React.Suspense>
      </PluginLayout>
    </AdminRoute>
  } />
];
