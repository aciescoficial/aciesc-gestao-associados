
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmpresaData } from '../types';
import { Plus, Minus, Compass, List, Map, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet marker icons in production build
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Set default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
});

interface OpenStreetMapViewProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
}

// Custom control component to handle getting user location
function LocationButton({ onClick }: { onClick: () => void }) {
  const map = useMap();
  
  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: "80px" }}>
      <div className="leaflet-control leaflet-bar">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white shadow-md"
          onClick={onClick}
        >
          <Compass size={16} className="text-blue-500" />
        </Button>
      </div>
    </div>
  );
}

// Custom zoom controls
function CustomZoomControl() {
  const map = useMap();
  
  const handleZoomIn = () => {
    map.zoomIn();
  };
  
  const handleZoomOut = () => {
    map.zoomOut();
  };
  
  return (
    <div className="leaflet-bottom leaflet-right" style={{ marginBottom: "20px" }}>
      <div className="leaflet-control leaflet-bar flex flex-col">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-t-md bg-white shadow-md"
          onClick={handleZoomIn}
        >
          <Plus size={16} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-b-md bg-white shadow-md border-t"
          onClick={handleZoomOut}
        >
          <Minus size={16} />
        </Button>
      </div>
    </div>
  );
}

// Custom map center update component
function SetViewOnChange({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  
  return null;
}

const nichoColors: Record<string, string> = {
  'Saúde': '#4CAF50',
  'Educação': '#2196F3', 
  'Alimentação': '#FF9800',
  'Lazer': '#9C27B0',
  'Serviços': '#F44336',
  'Construção': '#795548',
  'Tecnologia': '#607D8B',
  'Varejo': '#FFC107',
  'Automotivo': '#3F51B5',
  'Imobiliário': '#E91E63',
  'Financeiro': '#009688',
  'Outros': '#9E9E9E'
};

const OpenStreetMapView: React.FC<OpenStreetMapViewProps> = ({
  companies,
  selectedCompany,
  setSelectedCompany
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([-15.7801, -47.9292]);
  const [visibleCompanies, setVisibleCompanies] = useState<EmpresaData[]>([]);
  const [activeNichoFilters, setActiveNichoFilters] = useState<string[]>([]);
  
  // Get unique nichos from companies
  const uniqueNichos = React.useMemo(() => {
    const nichoSet = new Set<string>();
    companies.forEach(company => {
      if (company.nicho) {
        nichoSet.add(company.nicho);
      }
    });
    return Array.from(nichoSet);
  }, [companies]);

  // Set visible companies
  useEffect(() => {
    // Filter companies by nicho if needed
    const filtered = companies.filter(company => {
      if (activeNichoFilters.length === 0) return true;
      return activeNichoFilters.includes(company.nicho);
    });
    setVisibleCompanies(filtered);
  }, [companies, activeNichoFilters]);

  // Handle user location
  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          alert("Não foi possível obter sua localização.");
        }
      );
    } else {
      alert("Seu navegador não suporta geolocalização.");
    }
  };
  
  // Toggle nicho filters
  const toggleNichoFilter = (nicho: string) => {
    setActiveNichoFilters(prev => {
      if (prev.includes(nicho)) {
        return prev.filter(n => n !== nicho);
      } else {
        return [...prev, nicho];
      }
    });
  };

  // Update map view when selected company changes
  useEffect(() => {
    if (!selectedCompany) return;
    
    const lat = selectedCompany.latitude || -15.7801;
    const lng = selectedCompany.longitude || -47.9292;
    setCurrentLocation([lat, lng]);
  }, [selectedCompany]);

  // Custom marker icons for different nichos
  const getMarkerIcon = (nicho: string) => {
    const nichoColor = nichoColors[nicho] || '#9E9E9E';
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${nichoColor};
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        ">
          <div style="
            transform: rotate(45deg);
            height: 10px;
            width: 10px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });
  };

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-500" />
            Mapa de Empresas Conveniadas
          </span>
          <Badge variant="outline" className="ml-2">
            {visibleCompanies.length} empresas visíveis
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Nicho filters */}
        <div className="absolute top-16 left-2 right-2 z-10 flex flex-wrap gap-1 bg-white bg-opacity-90 p-2 rounded-md shadow-md max-w-full overflow-x-auto">
          {uniqueNichos.map(nicho => {
            const isActive = activeNichoFilters.includes(nicho);
            const nichoColor = nichoColors[nicho] || '#9E9E9E';
            
            return (
              <Badge 
                key={nicho}
                variant={isActive ? "default" : "outline"}
                style={{
                  backgroundColor: isActive ? nichoColor : 'transparent',
                  borderColor: nichoColor,
                  color: isActive ? 'white' : nichoColor,
                  cursor: 'pointer'
                }}
                onClick={() => toggleNichoFilter(nicho)}
                className="transition-all duration-200 hover:opacity-80"
              >
                {nicho}
              </Badge>
            );
          })}
        </div>
        
        {/* Map */}
        <div className="relative h-[600px] w-full">
          <MapContainer 
            center={currentLocation} 
            zoom={6} 
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User location marker */}
            {currentLocation && (
              <Marker 
                position={currentLocation}
              >
                <Popup>Sua localização atual</Popup>
              </Marker>
            )}

            {/* Company markers */}
            {visibleCompanies.map(company => {
              if (!company.latitude || !company.longitude) return null;
              
              return (
                <Marker
                  key={company.id}
                  position={[company.latitude, company.longitude]}
                  eventHandlers={{
                    click: () => setSelectedCompany(company),
                  }}
                >
                  <Popup>
                    <div className="p-1 max-w-[300px]">
                      <h3 className="font-medium text-base">{company.nome_fantasia}</h3>
                      <p className="text-sm text-gray-600">{company.endereco}</p>
                      <p className="text-sm text-gray-600">{company.cidade}</p>
                      {company.desconto && (
                        <p className="text-sm font-medium text-green-600 mt-1">
                          Desconto: {company.desconto}
                        </p>
                      )}
                      {company.telefone && (
                        <div className="mt-1">
                          <a href={`tel:${company.telefone}`} className="text-blue-600 hover:underline text-sm">
                            {company.telefone}
                          </a>
                        </div>
                      )}
                      <div className="flex justify-between mt-2">
                        <a 
                          href={`/empresas/${company.id}`}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Ver detalhes
                        </a>
                        <a 
                          href={`https://www.openstreetmap.org/directions?from=${currentLocation[0]},${currentLocation[1]}&to=${company.latitude},${company.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Como chegar
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Custom controls */}
            <CustomZoomControl />
            <LocationButton onClick={handleLocateUser} />
            
            {/* Update map view when selected company or location changes */}
            <SetViewOnChange center={currentLocation} />
          </MapContainer>

          {/* Map legend */}
          <div className="absolute bottom-3 left-3 z-10 bg-white bg-opacity-90 p-2 rounded-md shadow-md max-w-[200px]">
            <p className="text-xs font-medium mb-1 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Legenda
            </p>
            <Separator className="my-1" />
            <div className="space-y-1">
              {Object.entries(nichoColors).slice(0, 6).map(([nicho, color]) => (
                <div key={nicho} className="flex items-center gap-1 text-xs">
                  <div style={{ backgroundColor: color }} className="h-2 w-2 rounded-full" />
                  <span>{nicho}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company list below map */}
        {visibleCompanies.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <List className="h-4 w-4" />
                Empresas Visíveis no Mapa
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {visibleCompanies.slice(0, 6).map(company => {
                const nichoColor = nichoColors[company.nicho as string] || '#9E9E9E';
                
                return (
                  <div 
                    key={company.id} 
                    className="flex items-center p-2 rounded-md hover:bg-gray-50 border cursor-pointer"
                    onClick={() => setSelectedCompany(company)}
                  >
                    <div 
                      className="w-2 h-10 mr-2 rounded-sm" 
                      style={{ backgroundColor: nichoColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{company.nome_fantasia}</p>
                      <p className="text-xs text-gray-500 truncate">{company.endereco}</p>
                    </div>
                  </div>
                );
              })}
              
              {visibleCompanies.length > 6 && (
                <div className="md:col-span-3 text-center mt-2">
                  <Button variant="link" size="sm">
                    Ver todas as {visibleCompanies.length} empresas
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpenStreetMapView;
