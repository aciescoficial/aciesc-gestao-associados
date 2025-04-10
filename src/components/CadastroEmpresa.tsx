
import React, { useState } from 'react';
import { Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmpresaForm from './empresa/EmpresaForm';
import ImportExportEmpresas from './empresa/ImportExportEmpresas';

const CadastroEmpresa = () => {
  const [activeTab, setActiveTab] = useState("cadastro");
  const { toast } = useToast();

  const handleImportSuccess = () => {
    toast({
      title: "Importação concluída",
      description: "As empresas foram importadas com sucesso.",
    });
    setActiveTab("cadastro");
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header flex items-center gap-2">
        <Building className="h-6 w-6" />
        Cadastro de Empresas
      </h1>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="wp-card"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="cadastro">Cadastro Manual</TabsTrigger>
          <TabsTrigger value="importacao">Importação/Exportação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cadastro">
          <EmpresaForm />
        </TabsContent>
        
        <TabsContent value="importacao">
          <ImportExportEmpresas
            onImportSuccess={handleImportSuccess} // Passamos a prop aqui
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CadastroEmpresa;
