
import React, { useState, useEffect, useCallback } from 'react';
import { Map, List } from 'lucide-react';
import { EmpresaData } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchForm from './SearchForm';
import ResultsTable from './ResultsTable';
import { useEmpresaSearch } from './empresaSearchService';
import { useToast } from '@/hooks/use-toast';
import LatestCompanies from '../empresa/components/LatestCompanies';
import { PaginatedCompanyList } from '../empresa/components/PaginatedCompanyList';
import { OpenStreetMapView } from '../empresa/map';

const PesquisaEmpresaRefactored: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cnpj' | 'nicho' | 'mapa'>('mapa');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaData | null>(null);
  const [activeTab, setActiveTab] = useState<'mapa' | 'lista'>('mapa');
  const { toast } = useToast();
  const { searchNearbyCompanies, searchByTerm } = useEmpresaSearch();
  
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
        
        if (searchType === 'mapa') {
          handleSearchNearby(latitude, longitude);
        }
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

  const handleSearchNearby = async (latitude: number, longitude: number) => {
    setIsSearching(true);
    const results = await searchNearbyCompanies(latitude, longitude);
    setResults(results);
    setIsSearching(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchType === 'mapa') {
      if (!currentLocation) {
        getCurrentLocation();
      } else {
        handleSearchNearby(currentLocation.lat, currentLocation.lng);
      }
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
    const results = await searchByTerm(searchType, searchTerm);
    setResults(results);
    setIsSearching(false);
  };

  const locateEmpresa = useCallback((empresa: EmpresaData) => {
    if (!empresa.latitude || !empresa.longitude) return;
    
    setSelectedEmpresa(empresa);
    setCurrentLocation({ lat: empresa.latitude, lng: empresa.longitude });
    setActiveTab('mapa');
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="wp-header flex items-center gap-2">
        <Map className="h-6 w-6" />
        Pesquisa de Empresas Conveniadas
      </h1>
      
      <LatestCompanies onLocateEmpresa={locateEmpresa} />
      
      <div className="wp-card">
        <SearchForm 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchType={searchType}
          setSearchType={setSearchType}
          isSearching={isSearching}
          handleSearch={handleSearch}
          getCurrentLocation={getCurrentLocation}
          apiKey={undefined}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'mapa' | 'lista')}>
        <TabsList className="mb-4">
          <TabsTrigger value="mapa" className="flex items-center gap-1">
            <Map className="h-4 w-4" />
            Visualização de Mapa
          </TabsTrigger>
          <TabsTrigger value="lista" className="flex items-center gap-1">
            <List className="h-4 w-4" />
            Listagem Completa
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="mapa">
          <OpenStreetMapView 
            companies={results}
            selectedCompany={selectedEmpresa}
            setSelectedCompany={setSelectedEmpresa}
          />
        </TabsContent>
        
        <TabsContent value="lista">
          <PaginatedCompanyList onLocateEmpresa={locateEmpresa} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PesquisaEmpresaRefactored;
