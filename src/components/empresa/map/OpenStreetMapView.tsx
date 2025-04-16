
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Phone, Mail, ExternalLink, Navigation, Home } from 'lucide-react';
import { EmpresaData } from '../types';
import { getBadgeColors, formatPhoneNumber } from '../utils/helpers';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack/vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom marker icon for selected company
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Regular marker icon
const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Fix for the missing default icon in webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Company card component for the popup
const CompanyCard = ({ company }: { company: EmpresaData }) => {
  const [badgeColor, badgeBgColor] = getBadgeColors(company.nicho);
  
  return (
    <div className="w-64 p-1">
      <h3 className="font-medium text-lg">{company.nome_fantasia}</h3>
      <Badge 
        className="my-1" 
        style={{ 
          backgroundColor: badgeBgColor, 
          color: badgeColor
        }}
      >
        {company.nicho}
      </Badge>
      
      <div className="mt-2 space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <Home className="h-4 w-4 mt-1 text-gray-500" />
          <span>{company.endereco}, {company.cidade}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <a href={`tel:${company.telefone}`} className="hover:underline">
            {formatPhoneNumber(company.telefone)}
          </a>
        </div>
        
        {company.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <a href={`mailto:${company.email}`} className="hover:underline">
              {company.email}
            </a>
          </div>
        )}
        
        <div className="pt-2">
          <Button size="sm" variant="outline" className="w-full flex items-center gap-1">
            <Navigation className="h-4 w-4" />
            <span>Como chegar</span>
          </Button>
        </div>
        
        {company.site && (
          <div className="pt-1">
            <a 
              href={company.site.startsWith('http') ? company.site : `https://${company.site}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Visitar site</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Component to handle map updates
const MapUpdater = ({ center, zoom, mapRef }: { center: [number, number], zoom: number, mapRef: React.MutableRefObject<L.Map | null> }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
      if (mapRef) mapRef.current = map;
    }
  }, [map, center, zoom, mapRef]);
  
  return null;
};

interface MapViewProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
}

export const OpenStreetMapView: React.FC<MapViewProps> = ({ 
  companies, 
  selectedCompany,
  setSelectedCompany 
}) => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([-15.7801, -47.9292]); // Brazil center
  const [zoom, setZoom] = useState<number>(6);
  const [loading, setLoading] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapRef = React.useRef<L.Map | null>(null);
  
  // Find company's geo position (latitude, longitude)
  const geocodeCompany = async (company: EmpresaData) => {
    try {
      // Here we need to use a geocoding service
      // For now, we return a random position in Brazil for testing
      const lat = -15.7801 + (Math.random() - 0.5) * 10;
      const lng = -47.9292 + (Math.random() - 0.5) * 10;
      
      return [lat, lng] as [number, number];
    } catch (error) {
      console.error('Error geocoding company:', error);
      return null;
    }
  };
  
  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setZoom(13);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);
  
  // When selected company changes, center map on it
  useEffect(() => {
    if (selectedCompany) {
      geocodeCompany(selectedCompany).then(coords => {
        if (coords) {
          setCurrentLocation(coords);
          setZoom(15);
        }
      });
    }
  }, [selectedCompany]);

  // Markers for all companies
  const markers = useMemo(() => {
    return companies.map((company, index) => {
      // Generate random positions for demo
      const lat = -15.7801 + (Math.random() - 0.5) * 10;
      const lng = -47.9292 + (Math.random() - 0.5) * 10;
      const position: [number, number] = [lat, lng];
      
      const isSelected = selectedCompany?.id === company.id;
      
      return (
        <Marker 
          key={company.id || index}
          position={position}
          icon={isSelected ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => {
              setSelectedCompany(company);
            }
          }}
        >
          <Popup>
            <CompanyCard company={company} />
          </Popup>
        </Marker>
      );
    });
  }, [companies, selectedCompany, setSelectedCompany]);

  return (
    <Card className="mt-4">
      <CardContent className="p-0">
        <div className="p-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Mapa de Empresas Conveniadas</h3>
            <p className="text-sm text-gray-500">{companies.length} empresas encontradas</p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={getCurrentLocation}
              disabled={loading}
            >
              {loading ? "Localizando..." : "Minha Localização"}
            </Button>
          </div>
        </div>
        
        {/* Map */}
        <div className="relative h-[600px] w-full">
          <MapContainer 
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            scrollWheelZoom={true}
            whenReady={() => {
              setMapInitialized(true);
            }}
          >
            <MapUpdater center={currentLocation} zoom={zoom} mapRef={mapRef} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {mapInitialized && markers}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenStreetMapView;
