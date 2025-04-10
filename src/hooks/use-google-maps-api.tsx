
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
        // Se não encontrar no localStorage, buscamos do banco
        const { data } = await supabase
          .from('system_config')
          .select('value')
          .eq('key', 'google_maps_api_key')
          .single();

        if (data?.value) {
          localStorage.setItem('google_maps_api_key', data.value);
          setApiKey(data.value);
        }
      }
      
      setIsLoading(false);
    };

    fetchApiKey();
  }, []);

  return { apiKey, isLoading };
};
