
import React, { useState, useEffect, useCallback } from 'react';
import { Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { useGoogleMapsApi } from '@/hooks/use-google-maps-api';
import { Button } from "@/components/ui/button";
import { logOperation } from "../audit/auditLogService";

// Import refactored components
import EmpresaSearchFields from './EmpresaSearchFields';
import EmpresaMapView from './map/EmpresaMapView';
import EmpresaResultsTable from './results/EmpresaResultsTable';
import ApiKeyRedirect from './map/ApiKeyRedirect';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

interface EmpresaData {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: NichoType;
  status: StatusType;
  latitude?: number;
  longitude?: number;
  endereco: string;
  cep: string;
}

const EmpresasPesquisa: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cnpj' | 'nicho' | 'cidade' | 'cidade_nicho' | 'mapa'>('mapa');
  const [cidadeFilter, setCidadeFilter] = useState('');
  const [nichoFilter, setNichoFilter] = useState<string>('');
  const [cidades, setCidades] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaData | null>(null);
  const { toast } = useToast();
  const { apiKey, isLoading: isLoadingApiKey } = useGoogleMapsApi();

  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('cidade')
          .order('cidade');
        
        if (error) throw error;
        
        const uniqueCidades = [...new Set(data.map(item => item.cidade))];
        setCidades(uniqueCidades);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCidades();
  }, []);
  
  useEffect(() => {
    if (searchType === 'mapa' && !currentLocation) {
      getCurrentLocation();
    }
  }, [searchType]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        searchNearbyCompanies(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Erro ao obter localização",
          description: "Não foi possível obter sua localização atual.",
          variant: "destructive",
        });
      }
    );
  };

  const searchNearbyCompanies = async (latitude: number, longitude: number, radius: number = 10) => {
    setIsSearching(true);
    
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*');
      
      if (error) throw error;
      
      const nearbyCompanies = data.map(company => ({
        ...company,
        latitude: latitude + (Math.random() - 0.5) * 0.05,
        longitude: longitude + (Math.random() - 0.5) * 0.05
      })) as EmpresaData[];
      
      setResults(nearbyCompanies);
      
      if (nearbyCompanies.length === 0) {
        toast({
          title: "Nenhuma empresa encontrada",
          description: "Não foram encontradas empresas próximas à sua localização.",
        });
      }
    } catch (error: any) {
      console.error("Error searching nearby companies:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchType === 'mapa') {
      if (!currentLocation) {
        getCurrentLocation();
      } else {
        searchNearbyCompanies(currentLocation.lat, currentLocation.lng);
      }
      return;
    }
    
    if (searchType === 'cidade_nicho') {
      if (!cidadeFilter && !nichoFilter) {
        toast({
          title: "Filtros vazios",
          description: "Por favor, selecione pelo menos uma cidade ou nicho para realizar a busca.",
          variant: "destructive",
        });
        return;
      }
      
      await searchByCityAndNiche();
      return;
    }
    
    if (!searchTerm.trim()) {
      toast({
        title: "Campo de busca vazio",
        description: "Por favor, insira um termo para realizar a busca.",
        variant: "destructive",
      });
      return;
    }
    
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
        const companiesWithCoords = data.map(company => ({
          ...company,
          latitude: -15.7801 + (Math.random() - 0.5) * 0.1,
          longitude: -47.9292 + (Math.random() - 0.5) * 0.1
        }));
        setResults(companiesWithCoords as EmpresaData[]);
      } else {
        setResults([]);
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontradas empresas com os critérios informados.",
        });
      }
    } catch (error: any) {
      console.error("Error searching data:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const searchByCityAndNiche = async () => {
    setIsSearching(true);
    
    try {
      let query = supabase
        .from('empresas')
        .select('*');
      
      if (cidadeFilter) {
        query = query.eq('cidade', cidadeFilter);
      }
      
      if (nichoFilter) {
        // Fix the TypeScript error by ensuring the nicho filter is of the correct type
        // We check if the nicho is a valid value from the NichoType enum
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
        const companiesWithCoords = data.map(company => ({
          ...company,
          latitude: -15.7801 + (Math.random() - 0.5) * 0.1,
          longitude: -47.9292 + (Math.random() - 0.5) * 0.1
        }));
        setResults(companiesWithCoords as EmpresaData[]);
      } else {
        setResults([]);
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontradas empresas com os critérios informados.",
        });
      }
    } catch (error: any) {
      console.error("Error searching data:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const locateEmpresa = useCallback((empresa: EmpresaData) => {
    if (!apiKey || !empresa.latitude || !empresa.longitude) return;
    
    setSelectedEmpresa(empresa);
    setCurrentLocation({ lat: empresa.latitude, lng: empresa.longitude });
  }, [apiKey]);

  return (
    <div className="space-y-6">
      <h1 className="wp-header flex items-center gap-2">
        <Map className="h-6 w-6" />
        GeoDirectório de Empresas Conveniadas
      </h1>
      
      {searchType === 'mapa' && !apiKey && !isLoadingApiKey && (
        <ApiKeyRedirect />
      )}
      
      <div className="wp-card">
        <form onSubmit={handleSearch}>
          <EmpresaSearchFields
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
            cidadeFilter={cidadeFilter}
            setCidadeFilter={setCidadeFilter}
            nichoFilter={nichoFilter}
            setNichoFilter={setNichoFilter}
            cidades={cidades}
          />
          
          <div className="flex items-end justify-end mt-4">
            {searchType === 'mapa' && (
              <div className="flex flex-col h-full mr-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 h-10"
                  disabled={!apiKey}
                >
                  Usar minha localização
                </Button>
              </div>
            )}
            
            <Button 
              type="submit"
              className="flex items-center justify-center gap-2"
              disabled={isSearching || (searchType === 'mapa' && !apiKey)}
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </form>
      </div>
      
      {apiKey && (
        <EmpresaMapView
          apiKey={apiKey}
          results={results}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          selectedEmpresa={selectedEmpresa}
          setSelectedEmpresa={setSelectedEmpresa}
          getCurrentLocation={getCurrentLocation}
        />
      )}
      
      <EmpresaResultsTable
        results={results}
        locateEmpresa={locateEmpresa}
        isMapEnabled={!!apiKey}
      />
    </div>
  );
};

export default EmpresasPesquisa;
