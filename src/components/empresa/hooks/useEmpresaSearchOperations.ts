
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaData } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useEmpresaSearchOperations = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const { toast } = useToast();

  const searchByTerm = async (searchType: string, searchTerm: string) => {
    setIsSearching(true);
    try {
      let query = supabase
        .from('empresas')
        .select('*')
        .eq('status', 'aprovado'); // Only approved companies

      if (searchType === 'nome') {
        query = query.ilike('nome_fantasia', `%${searchTerm}%`);
      } else if (searchType === 'cnpj') {
        query = query.eq('cnpj', searchTerm);
      } else if (searchType === 'nicho') {
        // Use 'ilike' instead of 'eq' to work with string type
        query = query.ilike('nicho', `%${searchTerm}%`);
      } else if (searchType === 'cidade') {
        query = query.ilike('cidade', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error searching empresas:", error);
        toast({
          title: "Erro na busca",
          description: "Não foi possível realizar a busca. Tente novamente.",
          variant: "destructive"
        });
        setResults([]);
      } else {
        console.log(`Search found ${data?.length || 0} results`);
        setResults(data || []);
      }
    } catch (error) {
      console.error("Exception searching empresas:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const searchByCityAndNiche = async (city: string, niche: string) => {
    setIsSearching(true);
    try {
      let query = supabase
        .from('empresas')
        .select('*')
        .eq('status', 'aprovado'); // Only approved companies

      if (city) {
        query = query.ilike('cidade', `%${city}%`);
      }

      if (niche) {
        // Use 'ilike' instead of 'eq' to work with string type
        query = query.ilike('nicho', `%${niche}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error searching empresas by city and niche:", error);
        toast({
          title: "Erro na busca",
          description: "Não foi possível realizar a busca por cidade e nicho.",
          variant: "destructive"
        });
        setResults([]);
      } else {
        console.log(`Search found ${data?.length || 0} results`);
        setResults(data || []);
      }
    } catch (error) {
      console.error("Exception searching empresas by city and niche:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const searchNearbyCompanies = async (latitude: number, longitude: number, radius: number = 50) => {
    setIsSearching(true);
    try {
      // For simplicity, we'll retrieve all companies with coordinates
      // and filter them on the client side by distance
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('status', 'aprovado')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error("Error searching nearby empresas:", error);
        toast({
          title: "Erro na busca",
          description: "Não foi possível buscar empresas próximas.",
          variant: "destructive"
        });
        setResults([]);
      } else {
        // Filter by rough distance (simplified calculation)
        // Uses the Haversine formula to calculate distance between two points
        const nearbyCompanies = data
          .filter(company => {
            if (!company.latitude || !company.longitude) return false;
            
            const R = 6371; // Earth's radius in km
            const dLat = (company.latitude - latitude) * Math.PI / 180;
            const dLon = (company.longitude - longitude) * Math.PI / 180;
            const a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(latitude * Math.PI / 180) * Math.cos(company.latitude * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c; // Distance in km
            
            return distance <= radius;
          })
          .sort((a, b) => {
            // Calculate distances for sorting
            const distA = calculateDistance(latitude, longitude, a.latitude || 0, a.longitude || 0);
            const distB = calculateDistance(latitude, longitude, b.latitude || 0, b.longitude || 0);
            return distA - distB;
          });

        console.log(`Found ${nearbyCompanies.length} nearby companies`);
        setResults(nearbyCompanies);
      }
    } catch (error) {
      console.error("Exception searching nearby empresas:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  return {
    isSearching,
    results,
    setResults,
    searchByTerm,
    searchByCityAndNiche,
    searchNearbyCompanies
  };
};
