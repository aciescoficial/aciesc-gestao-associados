
import React, { useState } from 'react';
import EmpresaForm from './empresa/EmpresaForm';
import ImportExportEmpresas from './empresa/ImportExportEmpresas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CadastroEmpresa: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleImportSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Cadastrar Empresa Conveniada</h1>
        <ImportExportEmpresas onImportSuccess={handleImportSuccess} />
      </div>
      
      <div className="wp-card">
        <Tabs defaultValue="form">
          <TabsList>
            <TabsTrigger value="form">Formulário Individual</TabsTrigger>
            <TabsTrigger value="help">Ajuda para Importação</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <div className="py-4">
              <EmpresaForm key={refreshKey} />
            </div>
          </TabsContent>
          
          <TabsContent value="help">
            <div className="py-4 space-y-4">
              <h3 className="text-lg font-medium">Como importar empresas por CSV</h3>
              
              <div className="space-y-2">
                <p>Para importar múltiplas empresas de uma vez, você precisa criar um arquivo CSV com os seguintes campos:</p>
                
                <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">
                    razaoSocial,nomeFantasia,cnpj,responsavel,telefone,email,endereco,cidade,cep,site,instagram,whatsapp,nicho,desconto,produtos
                  </code>
                </div>
                
                <p className="text-sm mt-2">Exemplo de linha:</p>
                <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">
                    Empresa ABC Ltda,ABC Restaurante,12345678901234,João Silva,47999887766,contato@abc.com.br,Rua das Flores 123,Florianópolis,88000000,https://abc.com.br,@abcrestaurante,47999887766,Alimentação,10% de desconto em todas as refeições,Almoço e jantar
                  </code>
                </div>
                
                <div className="wp-notice-info mt-4">
                  <p className="font-medium">Campos obrigatórios</p>
                  <p className="text-sm">razaoSocial, nomeFantasia, cnpj, responsavel, telefone, email, endereco, cidade, cep, nicho, desconto, produtos</p>
                </div>
                
                <div className="wp-notice-warning mt-2">
                  <p className="font-medium">Atenção para o campo "nicho"</p>
                  <p className="text-sm">O valor do campo "nicho" deve ser um dos seguintes: Alimentação, Saúde, Educação, Serviços, Comércio, Lazer, Tecnologia, Outro</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm">Para exportar todas as empresas no formato correto, use o botão "Exportar" no topo da página.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CadastroEmpresa;
