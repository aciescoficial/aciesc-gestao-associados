
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmpresaData } from '../types';
import { Plus, Minus, Compass, List, Map, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VectorMapViewProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
  apiKey: string;
}

declare global {
  interface Window {
    initMap: () => void;
  }
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

const VectorMapView: React.FC<VectorMapViewProps> = ({ 
  companies, 
  selectedCompany, 
  setSelectedCompany,
  apiKey
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLoadingProgress, setMapLoadingProgress] = useState(0);
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

  // Function to initialize the map
  useEffect(() => {
    if (!mapRef.current || !apiKey) return;
    
    const loadMap = async () => {
      // Start loading progress simulation
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
          clearInterval(interval);
          progress = 100;
        }
        setMapLoadingProgress(progress);
      }, 150);
      
      // Import Google Maps API script
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,visualization&callback=initMap`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      window.initMap = () => {
        clearInterval(interval);
        setMapLoadingProgress(100);
        setTimeout(() => {
          initMapInstance();
          setMapLoaded(true);
        }, 500);
      };
      
      document.head.appendChild(googleMapsScript);
    };

    const initMapInstance = () => {
      if (!mapRef.current) return;
      
      // Create map instance with enhanced styling
      const mapOptions: google.maps.MapOptions = {
        center: { lat: -15.7801, lng: -47.9292 },
        zoom: 4,
        mapTypeId: 'roadmap',
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        styles: [
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#ffffff"}, {"lightness": 17}]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{"color": "#ffffff"}, {"lightness": 18}]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{"color": "#dedede"}, {"lightness": 21}]
          },
          {
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": [{"lightness": 16}]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
          }
        ]
      };

      mapInstance.current = new google.maps.Map(mapRef.current, mapOptions);
      infoWindow.current = new google.maps.InfoWindow({
        maxWidth: 320,
        pixelOffset: new google.maps.Size(0, -30)
      });
      
      // Add companies to map
      addCompaniesToMap();
      
      // Add custom controls
      mapInstance.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        document.getElementById('map-zoom-controls')!
      );
      
      mapInstance.current.controls[google.maps.ControlPosition.LEFT_TOP].push(
        document.getElementById('map-navigation-controls')!
      );

      // Update visible companies when the map bounds change
      mapInstance.current.addListener('idle', () => {
        updateVisibleCompanies();
      });
    };

    if (!window.google) {
      loadMap();
    } else {
      initMapInstance();
      setMapLoaded(true);
    }
  }, [apiKey]);

  // Add companies to map whenever the companies prop changes
  useEffect(() => {
    if (mapInstance.current && companies.length > 0 && mapLoaded) {
      addCompaniesToMap();
    }
  }, [companies, mapLoaded]);

  // Update filters and markers when activeNichoFilters changes
  useEffect(() => {
    if (mapInstance.current && mapLoaded) {
      updateMarkerVisibility();
      updateVisibleCompanies();
    }
  }, [activeNichoFilters, mapLoaded]);

  // Center map on selected company
  useEffect(() => {
    if (!mapInstance.current || !selectedCompany || !mapLoaded) return;
    
    // Create coordinates from company data or fallback to random if not available
    const lat = selectedCompany.latitude || -15.7801 + (Math.random() - 0.5) * 10;
    const lng = selectedCompany.longitude || -47.9292 + (Math.random() - 0.5) * 10;
    
    mapInstance.current.setCenter({ lat, lng });
    mapInstance.current.setZoom(12);
    
    // Show info window for selected company
    if (infoWindow.current) {
      infoWindow.current.setContent(createInfoWindowContent(selectedCompany));
      infoWindow.current.setPosition({ lat, lng });
      infoWindow.current.open(mapInstance.current);
    }
    
    // Highlight the marker
    markers.current.forEach(marker => {
      const markerData = marker.get('company') as EmpresaData;
      if (markerData?.id === selectedCompany.id) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1500);
      }
    });
  }, [selectedCompany, mapLoaded]);

  // Update visible companies based on map bounds
  const updateVisibleCompanies = () => {
    if (!mapInstance.current) return;

    const bounds = mapInstance.current.getBounds();
    if (!bounds) return;

    const visible = companies.filter(company => {
      // Filter by active nicho filters if any
      if (activeNichoFilters.length > 0 && !activeNichoFilters.includes(company.nicho)) {
        return false;
      }

      // Check if within map bounds
      if (!company.latitude || !company.longitude) return false;
      
      return bounds.contains({ lat: company.latitude, lng: company.longitude });
    });

    setVisibleCompanies(visible);
  };

  // Update marker visibility based on nicho filters
  const updateMarkerVisibility = () => {
    markers.current.forEach(marker => {
      const company = marker.get('company') as EmpresaData;
      
      if (!company || !company.nicho) return;
      
      if (activeNichoFilters.length === 0 || activeNichoFilters.includes(company.nicho)) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    });
  };

  const addCompaniesToMap = () => {
    if (!mapInstance.current || !mapLoaded) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
    
    // Add markers for each company
    companies.forEach(company => {
      // If we don't have coordinates, generate random ones around Brazil
      const lat = company.latitude || -15.7801 + (Math.random() - 0.5) * 10;
      const lng = company.longitude || -47.9292 + (Math.random() - 0.5) * 10;
      
      // Create a custom marker icon using the company's nicho color
      const nichoColor = nichoColors[company.nicho as string] || '#9E9E9E';
      const pinSize = 36;
      
      const svgMarker = {
        path: "M12,0C5.4,0,0,5.4,0,12c0,7.2,12,24,12,24s12-16.8,12-24C24,5.4,18.6,0,12,0z M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18z",
        fillColor: nichoColor,
        fillOpacity: 0.9,
        strokeWeight: 1,
        strokeColor: "#FFFFFF",
        rotation: 0,
        scale: 1,
        anchor: new google.maps.Point(12, 24),
        labelOrigin: new google.maps.Point(12, 12)
      };
      
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        title: company.nome_fantasia,
        animation: google.maps.Animation.DROP,
        icon: svgMarker,
        optimized: true,
        visible: activeNichoFilters.length === 0 || activeNichoFilters.includes(company.nicho)
      });
      
      // Store the company data with the marker for later use
      marker.set('company', company);
      
      marker.addListener('click', () => {
        setSelectedCompany(company);
      });
      
      markers.current.push(marker);
    });
    
    // Adjust map bounds to fit all markers if we have multiple
    if (markers.current.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      markers.current.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      mapInstance.current.fitBounds(bounds);
      
      // Prevent excessive zoom when there are few markers
      const zoom = mapInstance.current.getZoom();
      if (zoom && zoom > 15) {
        mapInstance.current.setZoom(15);
      }
    }

    // Update visible companies
    updateVisibleCompanies();
  };
  
  const createInfoWindowContent = (company: EmpresaData) => {
    // Get company logo or use placeholder
    const logoUrl = company.logo_url || 'https://placehold.co/80x80?text=Logo';
    const nichoColor = nichoColors[company.nicho as string] || '#9E9E9E';

    return `
      <div style="padding: 8px; max-width: 300px; font-family: system-ui, sans-serif;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <img src="${logoUrl}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px; margin-right: 12px;" />
          <div>
            <h3 style="margin: 0 0 4px; font-size: 16px; font-weight: 600;">${company.nome_fantasia}</h3>
            <span style="display: inline-block; background: ${nichoColor}; color: white; font-size: 11px; padding: 2px 6px; border-radius: 12px;">${company.nicho}</span>
          </div>
        </div>

        <div style="margin: 8px 0; font-size: 13px; color: #444;">
          ${company.desconto ? `<p style="margin: 4px 0;"><strong>Desconto:</strong> ${company.desconto}</p>` : ''}
          <p style="margin: 4px 0;"><strong>Endereço:</strong> ${company.endereco}, ${company.cidade}</p>
          ${company.telefone ? `<p style="margin: 4px 0;"><strong>Telefone:</strong> <a href="tel:${company.telefone}" style="color: #1e88e5;">${company.telefone}</a></p>` : ''}
          ${company.email ? `<p style="margin: 4px 0;"><strong>E-mail:</strong> <a href="mailto:${company.email}" style="color: #1e88e5;">${company.email}</a></p>` : ''}
        </div>

        <div style="margin-top: 12px; display: flex; justify-content: space-between;">
          <a href="/empresas/${company.id}" 
            style="display: inline-block; background: #1e88e5; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 13px;">
            Ver detalhes
          </a>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.nome_fantasia} ${company.endereco} ${company.cidade}`)}" 
            target="_blank"
            style="display: inline-block; background: #4caf50; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 13px;">
            Como chegar
          </a>
        </div>
      </div>
    `;
  };
  
  const handleZoom = (zoomIn: boolean) => {
    if (!mapInstance.current) return;
    const currentZoom = mapInstance.current.getZoom() || 0;
    mapInstance.current.setZoom(zoomIn ? currentZoom + 1 : currentZoom - 1);
  };
  
  const handleLocateUser = () => {
    if (!mapInstance.current) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // Add a marker for the user's location
          const userMarker = new google.maps.Marker({
            position: pos,
            map: mapInstance.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 8
            },
            zIndex: 1000,
            title: "Sua localização"
          });
          
          // Create a pulsating effect
          let scale = 0;
          const pulseUserLocation = () => {
            const pulse = new google.maps.Marker({
              position: pos,
              map: mapInstance.current,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#4285F4",
                fillOpacity: 0.3,
                strokeColor: "#4285F4",
                strokeWeight: 0,
                scale: 10 + scale
              },
              zIndex: 999,
            });
            
            setTimeout(() => {
              pulse.setMap(null);
            }, 300);
            
            scale = (scale + 1) % 10;
          };
          
          // Animate a few pulses
          for (let i = 0; i < 5; i++) {
            setTimeout(pulseUserLocation, i * 300);
          }
          
          mapInstance.current?.setCenter(pos);
          mapInstance.current?.setZoom(14);
        },
        () => {
          alert("Não foi possível obter sua localização.");
        }
      );
    } else {
      alert("Seu navegador não suporta geolocalização.");
    }
  };
  
  const toggleNichoFilter = (nicho: string) => {
    setActiveNichoFilters(prev => {
      if (prev.includes(nicho)) {
        return prev.filter(n => n !== nicho);
      } else {
        return [...prev, nicho];
      }
    });
  };

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-md">
            <p>Configure a chave da API do Google Maps nas configurações para visualizar o mapa.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {!mapLoaded && (
          <div className="absolute inset-0 bg-white bg-opacity-90 z-10 flex flex-col items-center justify-center">
            <div className="w-48 mb-4">
              <Progress value={mapLoadingProgress} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        )}
        
        <div className="relative h-[600px] w-full">
          <div ref={mapRef} className="absolute inset-0" />
          
          {mapLoaded && (
            <>
              {/* Nicho filters */}
              <div className="absolute top-3 left-16 right-3 z-10 flex flex-wrap gap-1 bg-white bg-opacity-90 p-2 rounded-md shadow-md max-w-full overflow-x-auto">
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
            </>
          )}
          
          {/* Zoom controls */}
          <div 
            id="map-zoom-controls" 
            className="absolute bottom-12 right-4 flex flex-col gap-1 z-10"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md"
                    onClick={() => handleZoom(true)}
                    disabled={!mapLoaded}
                  >
                    <Plus size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aumentar zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md"
                    onClick={() => handleZoom(false)}
                    disabled={!mapLoaded}
                  >
                    <Minus size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Diminuir zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Navigation controls */}
          <div
            id="map-navigation-controls"
            className="absolute top-3 left-3 flex flex-col gap-1 z-10"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 shadow-md bg-white"
                    onClick={handleLocateUser}
                    disabled={!mapLoaded}
                  >
                    <Compass size={16} className="text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Minha localização</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Company list below map */}
        {mapLoaded && visibleCompanies.length > 0 && (
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

export default VectorMapView;
