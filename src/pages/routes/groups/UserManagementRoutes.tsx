
import React from 'react';
import { Route } from 'react-router-dom';
import { AdminRoute } from '../../AuthRoutes';
import PluginLayout from '@/components/PluginLayout';
import UserManagement from '@/components/usuarios/UserManagement';
import PermissionPanel from '@/components/usuarios/permission/PermissionPanel';

export const UserManagementRoutes = [
  <Route key="usuarios-gerenciar" path="/usuarios/gerenciar" element={
    <AdminRoute>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <UserManagement />
        </React.Suspense>
      </PluginLayout>
    </AdminRoute>
  } />,
  
  <Route key="usuarios-permissoes" path="/usuarios/permissoes" element={
    <AdminRoute>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <PermissionPanel />
        </React.Suspense>
      </PluginLayout>
    </AdminRoute>
  } />,
  
  <Route key="usuarios" path="/usuarios" element={
    <AdminRoute>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <UserManagement />
        </React.Suspense>
      </PluginLayout>
    </AdminRoute>
  } />
];
