
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SystemConfigKey } from '../types/systemConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Settings } from 'lucide-react';
import { useSystemConfig } from './hooks/useSystemConfig';

export const SystemConfigForm = () => {
  const { configValues, isLoading, saveConfig } = useSystemConfig();
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set the API key from configValues when loaded
    if (configValues['google_maps_api_key']) {
      setGoogleMapsApiKey(configValues['google_maps_api_key']);
    }
  }, [configValues]);

  const handleSaveMapConfig = async () => {
    setIsSaving(true);
    try {
      // Save to database
      await saveConfig('google_maps_api_key', googleMapsApiKey);
      
      // Also update localStorage for compatibility with existing code
      localStorage.setItem('google_maps_api_key', googleMapsApiKey);
      
      toast({
        title: "Configuração salva",
        description: "A chave da API do Google Maps foi salva com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao salvar chave da API:', error);
      toast({
        title: "Erro ao salvar configuração",
        description: error.message || "Ocorreu um erro ao salvar a chave da API.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-4">
        <TabsTrigger value="general" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          Gerais
        </TabsTrigger>
        <TabsTrigger value="maps" className="flex items-center gap-1">
          <Map className="h-4 w-4" />
          Google Maps
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure os parâmetros gerais do sistema.
            </p>
            
            {/* General system configurations can be added here */}
            <div className="text-center py-8 text-muted-foreground">
              Configurações adicionais serão implementadas aqui.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="maps">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do Google Maps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Para usar os recursos de mapa, insira sua chave da API do Google Maps. 
              Você pode obter uma chave em{" "}
              <a 
                href="https://console.cloud.google.com/google/maps-apis/start" 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-500 hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="google-maps-key" className="block text-sm font-medium mb-1">
                  Chave da API do Google Maps
                </label>
                <Input 
                  id="google-maps-key"
                  type="text" 
                  placeholder="AIza..." 
                  value={googleMapsApiKey}
                  onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                />
              </div>
              
              <Button 
                disabled={isSaving || !googleMapsApiKey.trim()}
                onClick={handleSaveMapConfig}
              >
                {isSaving ? 'Salvando...' : 'Salvar configuração'}
              </Button>
            </div>
            
            <div className="mt-4 text-sm">
              <p className="font-medium">Instruções:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Acesse o <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a></li>
                <li>Crie um projeto ou selecione um existente</li>
                <li>Ative as APIs: Maps JavaScript API, Places API e Geocoding API</li>
                <li>Crie uma chave de API na seção "Credenciais"</li>
                <li>Copie a chave e cole no campo acima</li>
                <li>Recomendamos restringir a chave para seu domínio na configuração da chave no Console Google</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
