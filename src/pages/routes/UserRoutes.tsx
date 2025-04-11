
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../AuthRoutes';
import { LayoutWrapper, PagamentosAssociadoPage, SolicitarCarteirinhaPage, EmpresasConveniadasPage } from '../RouteComponents';
import PesquisaAssociado from '@/components/PesquisaAssociado';

export const UserRoutes = [
  // Shared routes for admin and user
  <Route key="associados-pesquisar" path="/associados/pesquisar" element={
    <ProtectedRoute allowedRoles={['admin', 'user']}>
      <LayoutWrapper>
        <PesquisaAssociado />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // User specific routes
  <Route key="meus-pagamentos" path="/meus-pagamentos" element={
    <ProtectedRoute allowedRoles={['user']}>
      <LayoutWrapper>
        <PagamentosAssociadoPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="solicitar-carteirinha" path="/solicitar-carteirinha" element={
    <ProtectedRoute allowedRoles={['user']}>
      <LayoutWrapper>
        <SolicitarCarteirinhaPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-conveniadas" path="/empresas-conveniadas" element={
    <ProtectedRoute allowedRoles={['user']}>
      <LayoutWrapper>
        <EmpresasConveniadasPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
];
