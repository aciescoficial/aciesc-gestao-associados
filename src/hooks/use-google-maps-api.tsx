
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useGoogleMapsApi = () => {
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('google_maps_api_key'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      setIsLoading(true);
      
      // Primeiro tentamos buscar do localStorage (compatibilidade)
      const localKey = localStorage.getItem('google_maps_api_key');
      
      if (!localKey) {
        try {
          // Se não encontrar no localStorage, buscamos do banco
          // Para fins de desenvolvimento, usamos uma consulta segura que não vai quebrar
          // mesmo se a tabela não existir
          const { data, error } = await supabase
            .from('system_config')
            .select('*')
            .eq('key', 'google_maps_api_key')
            .maybeSingle();

          if (!error && data && 'value' in data) {
            localStorage.setItem('google_maps_api_key', data.value);
            setApiKey(data.value);
          }
        } catch (err) {
          console.error("Error fetching API key:", err);
        }
      }
      
      setIsLoading(false);
    };

    fetchApiKey();
  }, []);

  return { apiKey, isLoading };
};
