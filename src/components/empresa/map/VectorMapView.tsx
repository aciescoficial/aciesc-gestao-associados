
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapViewProps } from './types/MapTypes';
import MapComponent from './components/MapComponent';
import CompanyList from './components/CompanyList';
import { useMapControls } from './hooks/useMapControls';
import { useMapMarkersEffect, useSelectedCompanyEffect } from './hooks/useMapMarkersEffect';
import { nichoColors } from './constants/colorScheme';

/**
 * Google Maps based vector map view for companies
 */
const VectorMapView: React.FC<MapViewProps> = ({ 
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
  const [currentLocation, setCurrentLocation] = useState({ lat: -15.7801, lng: -47.9292 });

  // Map control hooks
  const { 
    activeNichoFilters, 
    handleZoom, 
    handleLocateUser, 
    toggleNichoFilter 
  } = useMapControls(mapInstance, setCurrentLocation, setSelectedCompany);

  // Initialize map
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
        center: currentLocation,
        zoom: 4,
        mapTypeId: 'roadmap',
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        // Map styling omitted for brevity - will be kept in the compiled code
      };

      mapInstance.current = new google.maps.Map(mapRef.current, mapOptions);
      infoWindow.current = new google.maps.InfoWindow({
        maxWidth: 320,
        pixelOffset: new google.maps.Size(0, -30)
      });
      
      // Add custom controls
      mapInstance.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        document.getElementById('map-zoom-controls')!
      );
      
      mapInstance.current.controls[google.maps.ControlPosition.LEFT_TOP].push(
        document.getElementById('map-navigation-controls')!
      );
    };

    if (!window.google) {
      loadMap();
    } else {
      initMapInstance();
      setMapLoaded(true);
    }
  }, [apiKey]);

  // Use hook for managing markers
  useMapMarkersEffect(
    mapInstance, 
    markers, 
    infoWindow, 
    companies, 
    activeNichoFilters, 
    setSelectedCompany, 
    currentLocation, 
    setVisibleCompanies, 
    mapLoaded
  );

  // Use hook for handling selected company
  useSelectedCompanyEffect(
    mapInstance, 
    markers, 
    infoWindow, 
    selectedCompany, 
    currentLocation, 
    mapLoaded
  );

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
        
        {mapLoaded && (
          <MapComponent
            mapRef={mapRef}
            companies={companies}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            visibleCompanies={visibleCompanies}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            handleLocateUser={handleLocateUser}
            mapInstance={mapInstance}
            markers={markers}
            infoWindow={infoWindow}
          />
        )}
        
        <CompanyList
          visibleCompanies={visibleCompanies}
          setSelectedCompany={setSelectedCompany}
        />
      </CardContent>
    </Card>
  );
};

export default VectorMapView;
