
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { logOperation } from "@/components/audit/auditLogService";
import { EmpresaData, NichoType } from '../types';

export const useEmpresaSearch = () => {
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
    if (!empresa.latitude || !empresa.longitude) return;
    
    setSelectedEmpresa(empresa);
    setCurrentLocation({ lat: empresa.latitude, lng: empresa.longitude });
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    cidadeFilter,
    setCidadeFilter,
    nichoFilter,
    setNichoFilter,
    cidades,
    isSearching,
    results,
    currentLocation,
    setCurrentLocation,
    selectedEmpresa,
    setSelectedEmpresa,
    handleSearch,
    getCurrentLocation,
    searchNearbyCompanies,
    locateEmpresa
  };
};
