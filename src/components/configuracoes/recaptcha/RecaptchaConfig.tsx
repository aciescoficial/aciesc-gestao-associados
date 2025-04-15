
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RecaptchaConfigForm from './RecaptchaConfigForm';
import RecaptchaIntegrationGuide from './RecaptchaIntegrationGuide';
import { useAuth } from '@/components/auth/context/AuthContext';

const RecaptchaConfig: React.FC = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <Alert variant="destructive">
          <AlertTitle>Acesso negado</AlertTitle>
          <AlertDescription>
            Você precisa estar autenticado para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="configuracoes">
        <TabsList>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="integracao">Integração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuracoes" className="space-y-6">
          <RecaptchaConfigForm onError={(msg) => setError(msg)} />
        </TabsContent>
        
        <TabsContent value="integracao" className="space-y-6">
          <RecaptchaIntegrationGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecaptchaConfig;
