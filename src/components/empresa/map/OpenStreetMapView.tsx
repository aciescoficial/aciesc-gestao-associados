
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import { EmpresaData } from '../types';
import { setupLeafletIcons } from './icons/mapIcons';
import MapContainerComponent from './components/MapContainer';

// Initialize Leaflet icons
setupLeafletIcons();

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
  const mapRef = useRef<L.Map | null>(null);
  
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
  React.useEffect(() => {
    if (selectedCompany) {
      geocodeCompany(selectedCompany).then(coords => {
        if (coords) {
          setCurrentLocation(coords);
          setZoom(15);
        }
      });
    }
  }, [selectedCompany]);

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
        
        <MapContainerComponent
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          currentLocation={currentLocation}
          zoom={zoom}
          mapRef={mapRef}
        />
      </CardContent>
    </Card>
  );
};

export default OpenStreetMapView;
