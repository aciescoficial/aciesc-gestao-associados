
import React from 'react';
import { Map } from 'lucide-react';
import { useGoogleMapsApi } from '@/hooks/use-google-maps-api';
import { useEmpresaSearch } from './hooks/useEmpresaSearch';
import EmpresaSearchForm from './components/EmpresaSearchForm';
import EmpresaResultsTable from './components/EmpresaResultsTable';
import ApiKeyRedirect from './components/ApiKeyRedirect';
import OpenStreetMapView from './map/OpenStreetMapView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      
      <Tabs defaultValue="mapa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mapa">Visualização de Mapa</TabsTrigger>
          <TabsTrigger value="lista">Listagem Completa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mapa">
          <OpenStreetMapView
            companies={results}
            selectedCompany={selectedEmpresa}
            setSelectedCompany={setSelectedEmpresa}
          />
        </TabsContent>
        
        <TabsContent value="lista">
          <EmpresaResultsTable
            results={results}
            isSearching={isSearching}
            locateEmpresa={locateEmpresa}
            isMapEnabled={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmpresasPesquisa;
