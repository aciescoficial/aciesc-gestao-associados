
import React from "react";
import { Route } from "react-router-dom";
import { FinanceRoute } from "../pages/routes/FinanceiroRoutes";
import PluginLayout from "../components/PluginLayout";
import FinanceiroResumoPage from "../components/financeiro/FinanceiroResumoPage";
import FinanceiroAssociadosPage from "../components/financeiro/FinanceiroAssociadosPage";
import FinanceiroRelatoriosPage from "../components/financeiro/FinanceiroRelatoriosPage";
import IntegracaoFinanceira from "../components/IntegracaoFinanceira";

// Fallback component com loading personalizado
const PageLoading = () => <div className="flex justify-center items-center h-48">Carregando...</div>;

export const FinanceiroRoutes = [
  <Route key="financeiro-resumo" path="/financeiro/resumo" element={
    <FinanceRoute>
      <PluginLayout>
        <FinanceiroResumoPage />
      </PluginLayout>
    </FinanceRoute>
  } />,
  
  <Route key="financeiro-associados" path="/financeiro/associados" element={
    <FinanceRoute>
      <PluginLayout>
        <FinanceiroAssociadosPage />
      </PluginLayout>
    </FinanceRoute>
  } />,
  
  <Route key="financeiro-relatorios" path="/financeiro/relatorios" element={
    <FinanceRoute>
      <PluginLayout>
        <FinanceiroRelatoriosPage />
      </PluginLayout>
    </FinanceRoute>
  } />,
  
  <Route key="financeiro-integracoes" path="/financeiro/integracoes" element={
    <FinanceRoute>
      <PluginLayout>
        <IntegracaoFinanceira />
      </PluginLayout>
    </FinanceRoute>
  } />,
];
