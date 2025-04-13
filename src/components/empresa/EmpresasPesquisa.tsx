
import React from 'react';
import { Map } from 'lucide-react';
import { useGoogleMapsApi } from '@/hooks/use-google-maps-api';
import { useEmpresaSearch } from './hooks/useEmpresaSearch';
import EmpresaSearchForm from './components/EmpresaSearchForm';
import EmpresaMapView from './components/EmpresaMapView';
import EmpresaResultsTable from './components/EmpresaResultsTable';
import ApiKeyRedirect from './components/ApiKeyRedirect';

const EmpresasPesquisa: React.FC = () => {
  const { apiKey, isLoading: isLoadingApiKey } = useGoogleMapsApi();
  const { 
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
    locateEmpresa
  } = useEmpresaSearch();

  return (
    <div className="space-y-6">
      <h1 className="wp-header flex items-center gap-2">
        <Map className="h-6 w-6" />
        GeoDirectório de Empresas Conveniadas
      </h1>
      
      {searchType === 'mapa' && !apiKey && !isLoadingApiKey && (
        <ApiKeyRedirect />
      )}
      
      <EmpresaSearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchType={searchType}
        setSearchType={setSearchType}
        cidadeFilter={cidadeFilter}
        setCidadeFilter={setCidadeFilter}
        nichoFilter={nichoFilter}
        setNichoFilter={setNichoFilter}
        cidades={cidades}
        isSearching={isSearching}
        handleSearch={handleSearch}
        getCurrentLocation={getCurrentLocation}
        apiKey={apiKey}
      />
      
      {apiKey && searchType === 'mapa' && (
        <EmpresaMapView
          apiKey={apiKey}
          results={results}
          currentLocation={currentLocation}
          selectedEmpresa={selectedEmpresa}
          setSelectedEmpresa={setSelectedEmpresa}
          getCurrentLocation={getCurrentLocation}
        />
      )}
      
      <EmpresaResultsTable
        results={results}
        isSearching={isSearching}
        locateEmpresa={locateEmpresa}
        isMapEnabled={!!apiKey && searchType === 'mapa'}
      />
    </div>
  );
};

export default EmpresasPesquisa;
