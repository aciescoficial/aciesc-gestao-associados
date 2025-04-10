
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

const GoogleMapsConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Tentar carregar a chave do localStorage primeiro (compatibilidade)
    const storedKey = localStorage.getItem('google_maps_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }

    // Verificar se existe uma chave no banco de dados
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase
          .from('system_config')
          .select('*')
          .eq('key', 'google_maps_api_key')
          .maybeSingle();
        
        if (!error && data && 'value' in data) {
          setApiKey(data.value);
          // Atualizar também o localStorage para compatibilidade
          localStorage.setItem('google_maps_api_key', data.value);
        }
      } catch (err) {
        console.error("Error fetching API key:", err);
      }
    };

    fetchApiKey();
  }, []);

  const handleSaveApiKey = async () => {
    setIsSaving(true);
    
    try {
      // Salvar no localStorage para compatibilidade com código existente
      localStorage.setItem('google_maps_api_key', apiKey);
      
      // Salvar no banco de dados para persistência
      const { error } = await supabase
        .from('system_config')
        .upsert({ 
          key: 'google_maps_api_key', 
          value: apiKey,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

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

  return (
    <div className="wp-card p-6">
      <h2 className="wp-subheader mb-4">Configuração do Google Maps</h2>
      
      <p className="text-sm text-gray-500 mb-4">
        Para usar os recursos de mapa, insira sua chave da API do Google Maps. 
        Você pode obter uma chave em <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a>
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="google-maps-key" className="block text-sm font-medium mb-1">Chave da API do Google Maps</label>
          <input 
            id="google-maps-key"
            type="text" 
            className="wp-input w-full"
            placeholder="AIza..." 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        
        <button 
          className="wp-button"
          disabled={isSaving || !apiKey.trim()}
          onClick={handleSaveApiKey}
        >
          {isSaving ? 'Salvando...' : 'Salvar configuração'}
        </button>
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
    </div>
  );
};

export default GoogleMapsConfig;
