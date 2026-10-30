
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../AuthRoutes';
import PluginLayout from '@/components/PluginLayout';
import AprovacaoAprovados from '@/components/associado/components/AprovacaoAprovados';
import InteressadosPage from '@/components/associado/InteressadosPage';
import AprovacaoInteressePage from '@/components/associado/AprovacaoInteressePage';

export const ApprovalRoutes = [
  <Route key="associados-interessados" path="/associados/interessados" element={
    <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <InteressadosPage />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  <Route key="associados-aprovacao" path="/associados/aprovacao" element={
    <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <AprovacaoInteressePage />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  <Route key="associados-pagamentos" path="/associados/pagamentos" element={
    <ProtectedRoute allowedRoles={['admin', 'diretoria']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <AprovacaoAprovados />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
];
