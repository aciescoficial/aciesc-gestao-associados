
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Building, CircleSlash, Star, Clock, 
  Map as MapIcon, Compass, Filter, SlidersHorizontal, 
  Heart, Share2, ChevronDown, Grid, List, City
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

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
  created_at: string;
  desconto?: string;
  rating?: number;
  distancia?: number;
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

const EmpresaCard = ({ empresa }: { empresa: EmpresaData }) => {
  return (
    <Card className="overflow-hidden h-full">
      <div className="aspect-video bg-gray-100 relative">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url(https://source.unsplash.com/random/300x200/?${empresa.nicho.toLowerCase()},business)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100">
          <Heart size={18} className="text-gray-500" />
        </button>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{empresa.nome_fantasia}</CardTitle>
            <CardDescription className="text-xs text-gray-500 mt-1">
              {empresa.razao_social}
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
            <Star fill="gold" className="h-3 w-3 text-yellow-500" />
            {empresa.rating?.toFixed(1) || "N/A"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Building className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{empresa.nicho}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{empresa.endereco}, {empresa.cidade}</span>
          </div>
          {empresa.distancia !== undefined && (
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{empresa.distancia.toFixed(1)} km de distância</span>
            </div>
          )}
          {empresa.desconto && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit">
              {empresa.desconto}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center border-t">
        <div className="text-sm text-gray-500">
          <Clock className="h-4 w-4 inline mr-1" />
          {new Date(empresa.created_at).toLocaleDateString()}
        </div>
        <Button variant="default" size="sm" className="text-xs">Ver detalhes</Button>
      </CardFooter>
    </Card>
  );
};

const EmpresasConveniadas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const [nichos, setNichos] = useState<string[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);
  const [nichoFilter, setNichoFilter] = useState<string>('');
  const [cidadeFilter, setCidadeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'proximidade' | 'recentes' | 'antigas' | 'ranking'>('recentes');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(localStorage.getItem('mapbox_token'));
  const { toast } = useToast();
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  // Fetch filters data (nichos and cidades)
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        // Fetch unique nicho values
        const { data: nichoData } = await supabase
          .from('empresas')
          .select('nicho')
          .eq('status', 'ativo');
          
        if (nichoData) {
          const uniqueNichos = Array.from(new Set(nichoData.map(item => item.nicho)));
          setNichos(uniqueNichos as string[]);
        }
        
        // Fetch unique cidade values
        const { data: cidadeData } = await supabase
          .from('empresas')
          .select('cidade')
          .eq('status', 'ativo');
          
        if (cidadeData) {
          const uniqueCidades = Array.from(new Set(cidadeData.map(item => item.cidade)));
          setCidades(uniqueCidades as string[]);
        }
      } catch (error) {
        console.error('Error fetching filters data:', error);
      }
    };
    
    fetchFiltersData();
    
    // Try to get user location on component mount
    getCurrentLocation();
  }, []);
  
  // Initialize map when token is available and view mode is map
  useEffect(() => {
    if (!mapboxToken || viewMode !== 'map' || !mapContainer.current) return;
    
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

      // Set up the map to update search when it moves (if checkbox is checked)
      map.current.on('moveend', () => {
        const searchWhileMovingCheckbox = document.getElementById('search-while-moving') as HTMLInputElement;
        if (searchWhileMovingCheckbox?.checked) {
          const center = map.current?.getCenter();
          if (center) {
            searchNearbyCompanies(center.lat, center.lng);
          }
        }
      });
    }

    // Update markers when results change
    updateMapMarkers();

    // Clean up on unmount
    return () => {
      if (map.current && viewMode !== 'map') {
        clearMapMarkers();
      }
    };
  }, [mapboxToken, currentLocation, viewMode, results]);

  // Clear map markers
  const clearMapMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  // Update map markers
  const updateMapMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    clearMapMarkers();
    
    // Add new markers
    results.forEach((empresa) => {
      if (empresa.latitude && empresa.longitude) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${empresa.nome_fantasia}</h3>
              <p class="text-sm">${empresa.nicho}</p>
              <p class="text-sm text-gray-600">${empresa.endereco}, ${empresa.cidade}</p>
              ${empresa.desconto ? `<p class="text-sm text-green-600 font-semibold mt-1">${empresa.desconto}</p>` : ''}
              <div class="mt-2">
                <a href="tel:${empresa.telefone}" class="text-blue-500 hover:underline text-sm">${empresa.telefone}</a>
              </div>
              <button class="mt-2 bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">Ver detalhes</button>
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
  };

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
        
        // If sort by proximity is selected, update results
        if (sortBy === 'proximidade') {
          searchNearbyCompanies(latitude, longitude);
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

  // Search for companies near a location
  const searchNearbyCompanies = async (latitude: number, longitude: number) => {
    setIsSearching(true);
    
    try {
      // Fetch all companies that match our filters
      let query = supabase
        .from('empresas')
        .select('*')
        .eq('status', 'ativo');
      
      if (nichoFilter) {
        query = query.eq('nicho', nichoFilter);
      }
      
      if (cidadeFilter) {
        query = query.eq('cidade', cidadeFilter);
      }
      
      if (searchTerm) {
        query = query.or(`nome_fantasia.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Add simulated data for distance and rating
        const companiesWithMetadata = data.map(company => {
          // Simulate latitude/longitude if not present
          const companyLat = company.latitude || (latitude + (Math.random() - 0.5) * 0.1);
          const companyLng = company.longitude || (longitude + (Math.random() - 0.5) * 0.1);
          
          // Calculate distance (simplified)
          const latDiff = companyLat - latitude;
          const lngDiff = companyLng - longitude;
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // rough km conversion
          
          // Simulate random rating
          const rating = (2 + Math.random() * 3); // Random rating between 2 and 5
          
          // Simulate discount
          const hasDiscount = Math.random() > 0.5;
          const discountOptions = [
            '10% de desconto',
            '15% para associados',
            'Condições especiais',
            'Desconto progressivo',
            'Primeira compra grátis'
          ];
          
          return {
            ...company,
            latitude: companyLat,
            longitude: companyLng,
            distancia: distance,
            rating,
            desconto: hasDiscount ? discountOptions[Math.floor(Math.random() * discountOptions.length)] : undefined
          };
        });
        
        // Sort the results based on the selected sort method
        let sortedResults: EmpresaData[];
        
        switch (sortBy) {
          case 'proximidade':
            sortedResults = companiesWithMetadata.sort((a, b) => (a.distancia || 99999) - (b.distancia || 99999));
            break;
          case 'recentes':
            sortedResults = companiesWithMetadata.sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            break;
          case 'antigas':
            sortedResults = companiesWithMetadata.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            break;
          case 'ranking':
            sortedResults = companiesWithMetadata.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          default:
            sortedResults = companiesWithMetadata;
        }
        
        setResults(sortedResults);
      }
    } catch (error: any) {
      console.error('Error searching companies:', error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao buscar as empresas.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    setIsSearching(true);
    
    try {
      let query = supabase
        .from('empresas')
        .select('*')
        .eq('status', 'ativo');
      
      if (nichoFilter) {
        query = query.eq('nicho', nichoFilter);
      }
      
      if (cidadeFilter) {
        query = query.eq('cidade', cidadeFilter);
      }
      
      if (searchTerm) {
        query = query.or(`nome_fantasia.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Add simulated data for distance and rating
        const companiesWithMetadata = data.map(company => {
          // Create random coordinates near the user's location or use defaults
          const baseLat = currentLocation?.lat || -15.7801;
          const baseLng = currentLocation?.lng || -47.9292;
          
          const companyLat = company.latitude || (baseLat + (Math.random() - 0.5) * 0.1);
          const companyLng = company.longitude || (baseLng + (Math.random() - 0.5) * 0.1);
          
          // Calculate distance (if we have user location)
          let distance;
          if (currentLocation) {
            const latDiff = companyLat - currentLocation.lat;
            const lngDiff = companyLng - currentLocation.lng;
            distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // rough km conversion
          }
          
          // Simulate random rating
          const rating = (2 + Math.random() * 3); // Random rating between 2 and 5
          
          // Simulate discount
          const hasDiscount = Math.random() > 0.5;
          const discountOptions = [
            '10% de desconto',
            '15% para associados',
            'Condições especiais',
            'Desconto progressivo',
            'Primeira compra grátis'
          ];
          
          return {
            ...company,
            latitude: companyLat,
            longitude: companyLng,
            distancia: distance,
            rating,
            desconto: hasDiscount ? discountOptions[Math.floor(Math.random() * discountOptions.length)] : undefined
          };
        });
        
        // Sort the results based on the selected sort method
        let sortedResults: EmpresaData[];
        
        switch (sortBy) {
          case 'proximidade':
            sortedResults = companiesWithMetadata.sort((a, b) => (a.distancia || 99999) - (b.distancia || 99999));
            break;
          case 'recentes':
            sortedResults = companiesWithMetadata.sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            break;
          case 'antigas':
            sortedResults = companiesWithMetadata.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            break;
          case 'ranking':
            sortedResults = companiesWithMetadata.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          default:
            sortedResults = companiesWithMetadata;
        }
        
        setResults(sortedResults);
      }
    } catch (error: any) {
      console.error('Error searching companies:', error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao buscar as empresas.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setNichoFilter('');
    setCidadeFilter('');
    setSortBy('recentes');
  };

  // Fetch initial data
  useEffect(() => {
    handleSearch();
  }, [sortBy]);

  return (
    <div className="space-y-6">
      <h1 className="wp-header flex items-center gap-2">
        <Building className="h-6 w-6" />
        Empresas Conveniadas
      </h1>
      
      {viewMode === 'map' && !mapboxToken && (
        <MapboxTokenInput onTokenSet={setMapboxToken} />
      )}
      
      <div className="wp-card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
            <div className="relative flex-grow">
              <Input
                placeholder="Buscar empresa por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Select value={nichoFilter} onValueChange={setNichoFilter}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <SelectValue placeholder="Setor" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os setores</SelectItem>
                    {nichos.map((nicho) => (
                      <SelectItem key={nicho} value={nicho}>{nicho}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={cidadeFilter} onValueChange={setCidadeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <City className="h-4 w-4" />
                      <SelectValue placeholder="Cidade" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as cidades</SelectItem>
                    {cidades.map((cidade) => (
                      <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={sortBy} 
                  onValueChange={(value) => setSortBy(value as 'proximidade' | 'recentes' | 'antigas' | 'ranking')}
                >
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <SelectValue placeholder="Ordenar por" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proximidade">
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4" />
                        <span>Mais próximas</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="recentes">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Mais recentes</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="antigas">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Mais antigas</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ranking">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>Melhor avaliadas</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  <Button 
                    type="submit" 
                    variant="default"
                    disabled={isSearching}
                    className="flex items-center gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden md:inline">Filtrar</span>
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={resetFilters}
                    disabled={isSearching}
                    className="text-xs"
                  >
                    <CircleSlash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="my-4">
          <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list' | 'map')}>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {results.length} {results.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
              </div>
              
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center gap-1">
                  <Grid className="h-4 w-4" />
                  <span className="hidden md:inline">Grade</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1">
                  <List className="h-4 w-4" />
                  <span className="hidden md:inline">Lista</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-1">
                  <MapIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Mapa</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="grid" className="mt-4">
              {isSearching ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhuma empresa encontrada com os filtros atuais.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((empresa) => (
                    <EmpresaCard key={empresa.id} empresa={empresa} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="mt-4">
              {isSearching ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhuma empresa encontrada com os filtros atuais.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((empresa) => (
                    <div key={empresa.id} className="flex border rounded-lg overflow-hidden">
                      <div className="w-24 h-24 bg-gray-100">
                        <div 
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url(https://source.unsplash.com/random/300x200/?${empresa.nicho.toLowerCase()},business)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-bold">{empresa.nome_fantasia}</h3>
                            <p className="text-xs text-gray-500">{empresa.razao_social}</p>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
                            <Star fill="gold" className="h-3 w-3 text-yellow-500" />
                            {empresa.rating?.toFixed(1) || "N/A"}
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-gray-500" />
                            {empresa.nicho}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            {empresa.cidade}
                          </div>
                          {empresa.distancia !== undefined && (
                            <div className="flex items-center gap-1">
                              <Compass className="h-4 w-4 text-gray-500" />
                              {empresa.distancia.toFixed(1)} km
                            </div>
                          )}
                        </div>
                        {empresa.desconto && (
                          <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                            {empresa.desconto}
                          </Badge>
                        )}
                      </div>
                      <div className="w-24 flex items-center justify-center border-l">
                        <Button variant="ghost" size="sm">Ver</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="map" className="mt-4">
              {mapboxToken ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="search-while-moving" 
                        className="rounded"
                      />
                      <label htmlFor="search-while-moving" className="text-sm">
                        Pesquisar enquanto movo o mapa
                      </label>
                    </div>
                    
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              onClick={getCurrentLocation} 
                              variant="outline" 
                              size="sm"
                            >
                              <Compass className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Usar minha localização</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div 
                    ref={mapContainer} 
                    className="h-[500px] w-full rounded-lg border border-gray-200 overflow-hidden"
                  />
                  
                  {/* Search results summary below map */}
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium text-gray-700">Resultados ({results.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {results.slice(0, 6).map((empresa) => (
                        <div key={empresa.id} className="p-2 border rounded flex items-center gap-3">
                          <MapPin className="text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{empresa.nome_fantasia}</div>
                            <div className="text-xs text-gray-500 truncate">{empresa.endereco}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                            onClick={() => {
                              if (empresa.latitude && empresa.longitude && map.current) {
                                map.current.flyTo({
                                  center: [empresa.longitude, empresa.latitude],
                                  zoom: 16
                                });
                              }
                            }}
                          >
                            <MapIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {results.length > 6 && (
                      <div className="text-center mt-2">
                        <Button variant="link" size="sm">
                          Ver mais {results.length - 6} resultados
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <MapboxTokenInput onTokenSet={setMapboxToken} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmpresasConveniadas;
