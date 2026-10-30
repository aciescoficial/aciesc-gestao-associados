
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmpresaForm from '../EmpresaForm';
import ImportExportEmpresas from '../ImportExportEmpresas';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth';
import EmpresaProfile from '../EmpresaProfile';

const EmpresaTabs = () => {
  const [activeTab, setActiveTab] = useState("cadastro");
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();
  
  // Check if the user is a company user
  const isEmpresaUser = user?.role === 'empresa';

  const handleImportSuccess = () => {
    toast({
      title: "Importação concluída",
      description: "As empresas foram importadas com sucesso.",
    });
    setActiveTab("cadastro");
  };

  // If it's a company user, just show the profile editing form
  if (isEmpresaUser) {
    return (
      <div className="space-y-6">
        <EmpresaProfile />
      </div>
    );
  }

  // For admin users, show the full tabs
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
        <TabsTrigger value="cadastro" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Cadastro Manual
        </TabsTrigger>
        <TabsTrigger value="importacao" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Importação/Exportação
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="cadastro" className="space-y-6">
        <div className="wp-card">
          <EmpresaForm />
        </div>
      </TabsContent>
      
      <TabsContent value="importacao">
        <div className="wp-card">
          <ImportExportEmpresas
            onImportSuccess={handleImportSuccess}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EmpresaTabs;
