
import React, { useState, useEffect, useRef } from 'react';
import { Search, Check, X, Map, MapPin, Navigation, Locate, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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

// Temporary Mapbox token input component
const MapboxTokenInput = ({ onTokenSet }: { onTokenSet: (token: string) => void }) => {
  const [token, setToken] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSet(token);
      localStorage.setItem('mapbox_token', token);
    }
  };

  return (
    <div className="wp-card p-4 mb-4">
      <h3 className="font-medium mb-2">Configuração do Mapa</h3>
      <p className="text-sm text-gray-500 mb-4">
        Para usar o mapa, insira seu token público do Mapbox. 
        Você pode obter um token em <a href="https://mapbox.com/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          className="wp-input flex-grow"
          placeholder="Insira seu token público do Mapbox" 
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button type="submit" className="wp-button">Salvar</button>
      </form>
    </div>
  );
};

const PesquisaEmpresa: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cnpj' | 'nicho' | 'mapa'>('mapa');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(localStorage.getItem('mapbox_token'));
  const { toast } = useToast();
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapRendered, setMapRendered] = useState(false);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: currentLocation ? [currentLocation.lng, currentLocation.lat] : [-47.9292, -15.7801], // Default to Brasília if no location
        zoom: 10
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );

      setMapRendered(true);

      // Get current location on map load
      if (!currentLocation) {
        getCurrentLocation();
      }
    }

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, currentLocation]);

  // Update markers when results change
  useEffect(() => {
    if (!map.current) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers
    results.forEach((empresa) => {
      if (empresa.latitude && empresa.longitude) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <h3 class="font-bold">${empresa.nome_fantasia}</h3>
            <p>${empresa.nicho}</p>
            <p>${empresa.endereco}, ${empresa.cidade}</p>
            <div class="mt-2">
              <a href="tel:${empresa.telefone}" class="text-blue-500 hover:underline">${empresa.telefone}</a>
            </div>
          `);
          
        const marker = new mapboxgl.Marker({ color: '#3B82F6' })
          .setLngLat([empresa.longitude, empresa.latitude])
          .setPopup(popup)
          .addTo(map.current!);
          
        markers.current.push(marker);
      }
    });
    
    // Fit bounds to markers if there are any
    if (markers.current.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.current.forEach(marker => {
        bounds.extend(marker.getLngLat());
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [results, map.current]);

  // Get user's current location
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
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 13
          });
        }
        
        // Search for companies near the location
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

  // Search for companies near a location
  const searchNearbyCompanies = async (latitude: number, longitude: number, radius: number = 10) => {
    setIsSearching(true);
    
    try {
      // Here we would normally use a geospatial query
      // For this example, we'll fetch all companies and filter by distance
      const { data, error } = await supabase
        .from('empresas')
        .select('*');
      
      if (error) throw error;
      
      // For demo purposes, we'll simulate geolocation data
      // In a real app, you would have actual lat/lng fields in your database
      const nearbyCompanies = data.map(company => ({
        ...company,
        // This is simulated data - in a real app these would come from the database
        latitude: latitude + (Math.random() - 0.5) * 0.05,
        longitude: longitude + (Math.random() - 0.5) * 0.05
      })) as EmpresaData[];
      
      setResults(nearbyCompanies);
      
      // If no results, show notification
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
      // Search in Supabase based on search criteria
      let query = supabase
        .from('empresas')
        .select('*');
      
      if (searchType === 'nome') {
        query = query.or(`nome_fantasia.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%`);
      } else if (searchType === 'cnpj') {
        query = query.ilike('cnpj', `%${searchTerm}%`);
      } else if (searchType === 'nicho') {
        // We'll search for any nicho that contains the search term
        query = query.ilike('nicho', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Add simulated geo coordinates for map view
        // In a real implementation, these would come from the database
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

  return (
    <div className="space-y-6">
      <h1 className="wp-header flex items-center gap-2">
        <Map className="h-6 w-6" />
        GeoDirectório de Empresas Conveniadas
      </h1>
      
      {searchType === 'mapa' && !mapboxToken && (
        <MapboxTokenInput onTokenSet={setMapboxToken} />
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
                disabled={isSearching || (searchType === 'mapa' && !mapboxToken)}
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
      
      {/* Map View - Now always visible when mapbox token is set */}
      {mapboxToken && (
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
          <div 
            ref={mapContainer} 
            className="h-[500px] w-full rounded-lg border border-gray-200 overflow-hidden"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500">
              Clique nos marcadores para ver detalhes das empresas.
            </p>
            <button
              onClick={getCurrentLocation}
              className="wp-button-secondary text-sm px-4 py-1 flex items-center gap-2"
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
                          onClick={() => {
                            if (item.latitude && item.longitude && map.current) {
                              map.current.flyTo({
                                center: [item.longitude, item.latitude],
                                zoom: 16,
                                duration: 1500
                              });
                            }
                          }}
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
