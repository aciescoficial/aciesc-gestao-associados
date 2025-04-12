import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Check, X, Map, MapPin, Navigation, Locate, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMapsApi } from '@/hooks/use-google-maps-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const ApiKeyRedirect: React.FC = () => {
  return (
    <div className="wp-card p-4 mb-4">
      <h3 className="font-medium mb-2">Configuração do Google Maps Necessária</h3>
      <p className="text-sm text-gray-500 mb-4">
        Para utilizar o mapa, é necessário configurar a chave da API do Google Maps.
      </p>
      <a href="/configuracoes" className="wp-button inline-block">Ir para Configurações</a>
    </div>
  );
};

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem',
};

const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};

const PesquisaEmpresa: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cnpj' | 'nicho' | 'mapa'>('mapa');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaData | null>(null);
  const { toast } = useToast();
  const { apiKey, isLoading: isLoadingApiKey } = useGoogleMapsApi();
  
  const { isLoaded, loadError } = useLoadScript({
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
        .select('*')
        .eq('status', 'ativo');
      
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
          description: "Não foram encontradas empresas ativas próximas à sua localização.",
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
        .select('*')
        .eq('status', 'ativo');
      
      if (searchType === 'nome') {
        query = query.or(`nome_fantasia.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%`);
      } else if (searchType === 'cnpj') {
        query = query.ilike('cnpj', `%${searchTerm}%`);
      } else if (searchType === 'nicho') {
        query = query.ilike('nicho', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
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
          description: "Não foram encontradas empresas ativas com os critérios informados.",
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

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'ativo':
        return <span className="wp-badge-success flex items-center gap-1"><Check size={14} />Ativo</span>;
      case 'pendente':
        return <span className="wp-badge-warning">Pendente</span>;
      case 'inativo':
        return <span className="wp-badge-error flex items-center gap-1"><X size={14} />Inativo</span>;
      default:
        return <span className="wp-badge">{status}</span>;
    }
  };

  const locateEmpresa = useCallback((empresa: EmpresaData) => {
    if (!isLoaded || !empresa.latitude || !empresa.longitude) return;
    
    setSelectedEmpresa(empresa);
    setCurrentLocation({ lat: empresa.latitude, lng: empresa.longitude });
  }, [isLoaded]);

  const renderMap = () => {
    if (loadError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Erro ao carregar o mapa do Google Maps. Verifique sua chave da API.
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div className="flex justify-center items-center h-[500px] bg-gray-50 border border-gray-200 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={currentLocation || { lat: -15.7801, lng: -47.9292 }}
        options={defaultMapOptions}
      >
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new google.maps.Size(50, 50)
            }}
          />
        )}
        
        {results.map((empresa) => (
          <Marker
            key={empresa.id}
            position={{ 
              lat: empresa.latitude || -15.7801, 
              lng: empresa.longitude || -47.9292 
            }}
            onClick={() => setSelectedEmpresa(empresa)}
          />
        ))}
        
        {selectedEmpresa && (
          <InfoWindow
            position={{ 
              lat: selectedEmpresa.latitude || -15.7801, 
              lng: selectedEmpresa.longitude || -47.9292
            }}
            onCloseClick={() => setSelectedEmpresa(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-base">{selectedEmpresa.nome_fantasia}</h3>
              <p className="text-sm my-1">{selectedEmpresa.nicho}</p>
              <p className="text-sm">{selectedEmpresa.endereco}, {selectedEmpresa.cidade}</p>
              <div className="mt-2">
                <a href={`tel:${selectedEmpresa.telefone}`} className="text-blue-500 hover:underline text-sm">
                  {selectedEmpresa.telefone}
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  };

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Tipo de busca</label>
              <Select 
                value={searchType} 
                onValueChange={(value) => setSearchType(value as 'nome' | 'cnpj' | 'nicho' | 'mapa')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de busca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mapa">
                    <div className="flex items-center gap-2">
                      <Map size={16} />
                      <span>Mapa (GeoDirectório)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="nome">
                    <div className="flex items-center gap-2">
                      <Building size={16} />
                      <span>Nome da Empresa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cnpj">CNPJ</SelectItem>
                  <SelectItem value="nicho">Nicho de Atuação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {searchType !== 'mapa' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Termo de busca</label>
                <div className="relative">
                  <input
                    type="text"
                    className="wp-input w-full pl-10"
                    placeholder={`Buscar por ${searchType === 'nome' ? 'nome' : searchType === 'cnpj' ? 'CNPJ' : 'nicho'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}
            
            <div className={searchType === 'mapa' ? "md:col-span-2" : "md:col-span-1"}>
              {searchType === 'mapa' && (
                <div className="flex flex-col h-full">
                  <label className="block text-sm font-medium mb-1">Localização</label>
                  <button 
                    type="button" 
                    onClick={getCurrentLocation}
                    className="wp-button-secondary flex items-center gap-2 h-10"
                    disabled={!apiKey}
                  >
                    <Locate size={16} />
                    Usar minha localização
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit" 
                className="wp-button w-full flex items-center justify-center gap-2"
                disabled={isSearching || (searchType === 'mapa' && !apiKey)}
              >
                {searchType === 'mapa' ? (
                  <>
                    <MapPin size={16} />
                    {isSearching ? 'Buscando...' : 'Buscar empresas próximas'}
                  </>
                ) : (
                  <>{isSearching ? 'Buscando...' : 'Buscar'}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {apiKey && (
        <div className="wp-card">
          <h2 className="wp-subheader mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            GeoDirectório de Empresas
            {currentLocation && (
              <span className="text-sm text-gray-500 font-normal ml-4">
                Lat: {currentLocation.lat.toFixed(5)}, Lng: {currentLocation.lng.toFixed(5)}
              </span>
            )}
          </h2>
          
          {renderMap()}
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500">
              Clique nos marcadores para ver detalhes das empresas.
            </p>
            <button
              onClick={getCurrentLocation}
              className="wp-button-secondary text-sm px-4 py-1 flex items-center gap-2"
              disabled={!apiKey}
            >
              <Navigation size={14} />
              Atualizar minha localização
            </button>
          </div>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="wp-card">
          <h2 className="wp-subheader">Resultados da Busca</h2>
          <div className="overflow-x-auto">
            <table className="wp-table">
              <thead>
                <tr>
                  <th>Nome Fantasia</th>
                  <th>Razão Social</th>
                  <th>CNPJ</th>
                  <th>Nicho</th>
                  <th>Cidade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome_fantasia}</td>
                    <td>{item.razao_social}</td>
                    <td>{item.cnpj}</td>
                    <td>{item.nicho}</td>
                    <td>{item.cidade}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button 
                          className="wp-button-secondary text-xs py-1 px-2 flex items-center gap-1"
                          onClick={() => locateEmpresa(item)}
                          disabled={!apiKey || !isLoaded}
                        >
                          <MapPin size={12} />
                          Localizar
                        </button>
                        <button className="wp-button text-xs py-1 px-2">Editar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PesquisaEmpresa;
