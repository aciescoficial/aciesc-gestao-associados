
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormNavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FormNavigationTabs: React.FC<FormNavigationTabsProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <TabsList className="grid grid-cols-5 mb-6">
      <TabsTrigger 
        value="dados-pessoais"
        onClick={() => setActiveTab("dados-pessoais")}
      >
        Dados Pessoais
      </TabsTrigger>
      <TabsTrigger 
        value="contato"
        onClick={() => setActiveTab("contato")}
      >
        Contato
      </TabsTrigger>
      <TabsTrigger 
        value="endereco"
        onClick={() => setActiveTab("endereco")}
      >
        Endereço
      </TabsTrigger>
      <TabsTrigger 
        value="veiculo"
        onClick={() => setActiveTab("veiculo")}
      >
        Veículo
      </TabsTrigger>
      <TabsTrigger 
        value="financeiro"
        onClick={() => setActiveTab("financeiro")}
      >
        Financeiro
      </TabsTrigger>
    </TabsList>
  );
};

export default FormNavigationTabs;
