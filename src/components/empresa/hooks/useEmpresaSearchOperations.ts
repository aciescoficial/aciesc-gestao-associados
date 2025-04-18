
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmpresaData, NichoType } from '../types';
import { logOperation } from "@/components/audit/auditLogService";

export interface EmpresaResponse {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: NichoType;
  status: string;
  endereco: string;
  cep: string;
  logo_url?: string;
  capa_url?: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  desconto?: string;
  produtos?: string;
  video_url?: string;
  created_at?: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
}

export const useEmpresaSearchOperations = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const { toast } = useToast();

  const searchNearbyCompanies = async (latitude: number, longitude: number, radius: number = 10) => {
    setIsSearching(true);
    
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*');
      
      if (error) throw error;
      
      // Add latitude and longitude to companies that don't have them
      const nearbyCompanies = data.map((company: EmpresaResponse) => {
        // If the company already has coordinates, use them
        if (typeof company.latitude === 'number' && typeof company.longitude === 'number') {
          return {
            ...company,
            latitude: company.latitude,
            longitude: company.longitude
          } as EmpresaData;
        }
        
        // Otherwise, generate coordinates near the user's location
        return {
          ...company,
          latitude: latitude + (Math.random() - 0.5) * 0.05,
          longitude: longitude + (Math.random() - 0.5) * 0.05
        } as EmpresaData;
      });
      
      setResults(nearbyCompanies);
      
      if (nearbyCompanies.length === 0) {
        toast({
          title: "Nenhuma empresa encontrada",
          description: "Não foram encontradas empresas próximas à sua localização.",
        });
      }
      
      return nearbyCompanies;
    } catch (error: any) {
      console.error("Error searching nearby companies:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const searchByTerm = async (
    searchType: 'nome' | 'cnpj' | 'nicho' | 'cidade', 
    searchTerm: string
  ) => {
    setIsSearching(true);
    
    try {
      let query = supabase
        .from('empresas')
        .select('*');
      
      if (searchType === 'nome') {
        query = query.or(`nome_fantasia.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%`);
      } else if (searchType === 'cnpj') {
        query = query.ilike('cnpj', `%${searchTerm}%`);
      } else if (searchType === 'nicho') {
        query = query.ilike('nicho', `%${searchTerm}%`);
      } else if (searchType === 'cidade') {
        query = query.ilike('cidade', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      await logOperation({
        eventType: 'export',
        entityType: 'empresa',
        details: `Pesquisa por ${searchType}: ${searchTerm}`,
        recordCount: data?.length || 0
      });
      
      if (data && data.length > 0) {
        // Cast data to EmpresaData and preserve existing coordinates if available
        const companiesWithCoords = data.map((company: EmpresaResponse) => {
          if (typeof company.latitude === 'number' && typeof company.longitude === 'number') {
            return {
              ...company,
              latitude: company.latitude,
              longitude: company.longitude
            } as EmpresaData;
          }
          
          return {
            ...company,
            latitude: -15.7801 + (Math.random() - 0.5) * 0.1,
            longitude: -47.9292 + (Math.random() - 0.5) * 0.1
          } as EmpresaData;
        });
        
        setResults(companiesWithCoords);
        return companiesWithCoords;
      } else {
        setResults([]);
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontradas empresas com os critérios informados.",
        });
        return [];
      }
    } catch (error: any) {
      console.error("Error searching data:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const searchByCityAndNiche = async (cidadeFilter: string, nichoFilter: string) => {
    setIsSearching(true);
    
    try {
      let query = supabase
        .from('empresas')
        .select('*');
      
      if (cidadeFilter) {
        query = query.eq('cidade', cidadeFilter);
      }
      
      if (nichoFilter) {
        query = query.eq('nicho', nichoFilter as NichoType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      await logOperation({
        eventType: 'export',
        entityType: 'empresa',
        details: `Pesquisa por Cidade: ${cidadeFilter || 'Todas'} e Nicho: ${nichoFilter || 'Todos'}`,
        recordCount: data?.length || 0
      });
      
      if (data && data.length > 0) {
        // Cast data to EmpresaData and preserve existing coordinates if available
        const companiesWithCoords = data.map((company: EmpresaResponse) => {
          if (typeof company.latitude === 'number' && typeof company.longitude === 'number') {
            return {
              ...company, 
              latitude: company.latitude,
              longitude: company.longitude
            } as EmpresaData;
          }
          
          return {
            ...company,
            latitude: -15.7801 + (Math.random() - 0.5) * 0.1,
            longitude: -47.9292 + (Math.random() - 0.5) * 0.1
          } as EmpresaData;
        });
        
        setResults(companiesWithCoords);
        return companiesWithCoords;
      } else {
        setResults([]);
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontradas empresas com os critérios informados.",
        });
        return [];
      }
    } catch (error: any) {
      console.error("Error searching data:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    results,
    setResults,
    searchNearbyCompanies,
    searchByTerm,
    searchByCityAndNiche
  };
};
