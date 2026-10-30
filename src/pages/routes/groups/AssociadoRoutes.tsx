
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../AuthRoutes';
import PluginLayout from '@/components/PluginLayout';
import CadastrarAssociado from '@/components/associado/CadastrarAssociado';
import InteressadosPage from '@/components/associado/InteressadosPage';
import GeradorCarteirinha from '@/components/carteirinha/GeradorCarteirinha';
import ImportarAssociadosPage from '@/components/associado/pages/ImportarAssociadosPage';
import VisualizarAssociadoPage from '@/components/associado/pages/VisualizarAssociadoPage';
import EditarAssociadoPage from '@/components/associado/pages/EditarAssociadoPage';
import UserManagementPage from '@/components/associado/user/UserManagementPage';

export const AssociadoRoutes = [
  <Route key="associados-cadastrar" path="/associados/cadastrar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <CadastrarAssociado />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-importar" path="/associados/importar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <ImportarAssociadosPage />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-visualizar" path="/associados/visualizar/:id" element={
    <ProtectedRoute allowedRoles={['admin', 'user']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <VisualizarAssociadoPage />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-editar" path="/associados/editar/:id" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <EditarAssociadoPage />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-usuario" path="/associados/usuario/:id" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <UserManagementPage />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-interessados" path="/associados/interessados" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <InteressadosPage />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-carteirinha" path="/associados/carteirinha" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <GeradorCarteirinha />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />
];
