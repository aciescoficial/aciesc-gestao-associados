
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RecaptchaConfigForm from './RecaptchaConfigForm';
import RecaptchaIntegrationGuide from './RecaptchaIntegrationGuide';
import { supabase } from '@/integrations/supabase/client';

const RecaptchaConfig: React.FC = () => {
  // Check if user is authenticated using supabase directly
  const [error, setError] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setIsAuthenticated(!!data.session);
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Erro ao verificar autenticação');
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  // Show loading state while checking auth
  if (isAuthChecking) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">Verificando autenticação...</div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
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
