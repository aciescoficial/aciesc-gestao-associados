
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import PluginLayout from '@/components/PluginLayout';
import Dashboard from '@/components/Dashboard';
import CadastroConveniado from '@/components/CadastroConveniado';
import CadastroEmpresa from '@/components/CadastroEmpresa';
import PesquisaConveniado from '@/components/PesquisaConveniado';
import PesquisaEmpresa from '@/components/PesquisaEmpresa';
import AprovacoesPendentes from '@/components/AprovacoesPendentes';
import GeradorCarteirinha from '@/components/GeradorCarteirinha';
import IntegracaoFinanceira from '@/components/IntegracaoFinanceira';
import UserManagement from '@/components/usuarios/UserManagement';
import PermissionPanel from '@/components/usuarios/PermissionPanel';

const Index: React.FC = () => {
  return (
    <PluginLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* Conveniados Routes */}
        <Route path="/conveniados/cadastrar" element={<CadastroConveniado />} />
        <Route path="/conveniados/pendentes" element={<AprovacoesPendentes />} />
        <Route path="/conveniados/carteirinha" element={<GeradorCarteirinha />} />
        <Route path="/conveniados/pesquisar" element={<PesquisaConveniado />} />
        
        {/* Empresas Routes */}
        <Route path="/empresas/cadastrar" element={<CadastroEmpresa />} />
        <Route path="/empresas/pendentes" element={<AprovacoesPendentes />} />
        <Route path="/empresas/pesquisar" element={<PesquisaEmpresa />} />
        
        {/* Usuários Routes */}
        <Route path="/usuarios/gerenciar" element={<UserManagement />} />
        <Route path="/usuarios/permissoes" element={<PermissionPanel />} />
        
        {/* Financeiro Routes */}
        <Route path="/financeiro/integracoes" element={<IntegracaoFinanceira />} />
        <Route path="/financeiro/relatorios" element={<Dashboard />} /> {/* Placeholder */}
        
        {/* Configuracoes Routes */}
        <Route path="/configuracoes" element={<Dashboard />} /> {/* Placeholder */}
        
        {/* Default Route */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </PluginLayout>
  );
};

export default Index;
