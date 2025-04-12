
import React, { useState, useEffect, useCallback } from 'react';
import { Map } from 'lucide-react';
import { useGoogleMapsApi } from '@/hooks/use-google-maps-api';
import { useLoadScript } from '@react-google-maps/api';
import { EmpresaData } from './types';
import ApiKeyRedirect from './ApiKeyRedirect';
import SearchForm from './SearchForm';
import MapView from './MapView';
import ResultsTable from './ResultsTable';
import { useEmpresaSearch } from './empresaSearchService';
import { useToast } from '@/hooks/use-toast';

const PesquisaEmpresaRefactored: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cnpj' | 'nicho' | 'mapa'>('mapa');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaData | null>(null);
  const { toast } = useToast();
  const { apiKey, isLoading: isLoadingApiKey } = useGoogleMapsApi();
  const { searchNearbyCompanies, searchByTerm } = useEmpresaSearch();
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: ['places'],
  });

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
    if (!isLoaded || !empresa.latitude || !empresa.longitude) return;
    
    setSelectedEmpresa(empresa);
    setCurrentLocation({ lat: empresa.latitude, lng: empresa.longitude });
  }, [isLoaded]);

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
        <SearchForm 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchType={searchType}
          setSearchType={setSearchType}
          isSearching={isSearching}
          handleSearch={handleSearch}
          getCurrentLocation={getCurrentLocation}
          apiKey={apiKey}
        />
      </div>
      
      {apiKey && (
        <MapView 
          apiKey={apiKey}
          currentLocation={currentLocation}
          results={results}
          selectedEmpresa={selectedEmpresa}
          setSelectedEmpresa={setSelectedEmpresa}
          getCurrentLocation={getCurrentLocation}
        />
      )}
      
      <ResultsTable 
        results={results}
        locateEmpresa={locateEmpresa}
        isLoaded={isLoaded}
      />
    </div>
  );
};

export default PesquisaEmpresaRefactored;
