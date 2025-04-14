
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecaptchaConfigForm from './RecaptchaConfigForm';
import RecaptchaIntegrationGuide from './RecaptchaIntegrationGuide';

const RecaptchaConfig: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Configuração do Google reCAPTCHA</h2>
          <p className="text-muted-foreground">
            Configure o Google reCAPTCHA para proteger seu site contra bots.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="configuracoes">
        <TabsList>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="integracao">Integração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuracoes" className="space-y-6">
          <RecaptchaConfigForm />
        </TabsContent>
        
        <TabsContent value="integracao" className="space-y-6">
          <RecaptchaIntegrationGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecaptchaConfig;
