
import React from 'react';
import { Route } from 'react-router-dom';
import PluginLayout from '../PluginLayout';
import MessagesDashboard from './MessagesDashboard';
import MensagensPage from './MensagensPage';
import MessageDetail from './MessageDetail';

export const MensagensRoutes = [
  <Route key="mensagens" path="/mensagens" element={
    <PluginLayout>
      <MessagesDashboard />
    </PluginLayout>
  } />,
  
  <Route key="mensagens-enviar" path="/mensagens/enviar" element={
    <PluginLayout>
      <MensagensPage />
    </PluginLayout>
  } />,
  
  <Route key="mensagens-detalhe" path="/mensagens/:id" element={
    <PluginLayout>
      <MessageDetail />
    </PluginLayout>
  } />
];
