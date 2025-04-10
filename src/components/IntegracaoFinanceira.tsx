
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoHighLevelIntegracao from './integracao/GoHighLevelIntegracao';

const IntegracaoFinanceira: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Integrações</h1>
      
      <Tabs defaultValue="gohighlevel">
        <TabsList>
          <TabsTrigger value="asaas">Asaas</TabsTrigger>
          <TabsTrigger value="gohighlevel">Go High Level</TabsTrigger>
        </TabsList>
        
        <TabsContent value="asaas" className="space-y-6 mt-4">
          <div className="wp-card">
            <h2 className="text-xl font-semibold mb-4">Integração Asaas</h2>
            <p>A integração com o Asaas permite gerenciar cobranças e assinaturas dos conveniados.</p>
            
            <div className="wp-notice-warning mt-4">
              <p>Configuração da integração Asaas pendente.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="gohighlevel" className="space-y-6 mt-4">
          <div className="wp-card">
            <GoHighLevelIntegracao />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegracaoFinanceira;
