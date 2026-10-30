
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../AuthRoutes';
import PluginLayout from '@/components/PluginLayout';
import CadastrarEmpresa from '@/components/CadastrarEmpresa';
import PesquisarEmpresa from '@/components/PesquisarEmpresa';
import EmpresaSugestoes from '@/components/empresa/EmpresaSugestoes';
import EmpresaDetailPage from '@/components/empresa/EmpresaDetailPage';
import EmpresaProfile from '@/components/empresa/EmpresaProfile';

export const EmpresaRoutes = [
  <Route key="empresa-profile" path="/empresa/perfil" element={
    <ProtectedRoute allowedRoles={['empresa']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <EmpresaProfile />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,

  <Route key="empresas-cadastrar" path="/empresas/cadastrar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <CadastrarEmpresa />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-pesquisar" path="/empresas/pesquisar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <PesquisarEmpresa />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-detalhes" path="/empresas/detalhes/:id" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <EmpresaDetailPage />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-sugestoes" path="/empresas/sugestoes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <PluginLayout>
        <React.Suspense fallback={<div>Carregando...</div>}>
          <EmpresaSugestoes />
        </React.Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />
];
