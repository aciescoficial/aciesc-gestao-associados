
import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { EmpresaData } from '../EmpresasPesquisa';

interface EmpresaMapViewProps {
  apiKey: string;
  results: EmpresaData[];
  currentLocation: { lat: number; lng: number } | null;
  setCurrentLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  selectedEmpresa: EmpresaData | null;
  setSelectedEmpresa: React.Dispatch<React.SetStateAction<EmpresaData | null>>;
  getCurrentLocation: () => void;
}

const EmpresaMapView: React.FC<EmpresaMapViewProps> = ({
  apiKey,
  results,
  currentLocation,
  setCurrentLocation,
  selectedEmpresa,
  setSelectedEmpresa,
  getCurrentLocation
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const mapStyles = {
    height: '500px',
    width: '100%'
  };

  const defaultCenter = {
    lat: -15.7801,  // Roughly center of Brazil
    lng: -47.9292
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setCurrentLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  };

  const handleMarkerClick = (empresa: EmpresaData) => {
    setSelectedEmpresa(empresa);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Mapa de Empresas</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            className="flex items-center gap-1"
          >
            <Navigation size={14} />
            Minha Localização
          </Button>
        </div>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapStyles}
            center={currentLocation || defaultCenter}
            zoom={13}
            onClick={handleMapClick}
            options={{
              fullscreenControl: false,
              streetViewControl: false
            }}
          >
            {currentLocation && (
              <Marker
                position={currentLocation}
                icon={{
                  url: `data:image/svg+xml,${encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>'
                  )}`,
                  scaledSize: new window.google.maps.Size(30, 30),
                  anchor: new window.google.maps.Point(15, 15)
                }}
              />
            )}

            {results.map((empresa) => (
              empresa.latitude && empresa.longitude ? (
                <Marker
                  key={empresa.id}
                  position={{ lat: empresa.latitude, lng: empresa.longitude }}
                  onClick={() => handleMarkerClick(empresa)}
                  icon={{
                    url: `data:image/svg+xml,${encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'
                    )}`,
                    scaledSize: new window.google.maps.Size(30, 30),
                    anchor: new window.google.maps.Point(15, 30)
                  }}
                />
              ) : null
            ))}

            {selectedEmpresa && selectedEmpresa.latitude && selectedEmpresa.longitude && (
              <InfoWindow
                position={{ lat: selectedEmpresa.latitude, lng: selectedEmpresa.longitude }}
                onCloseClick={() => setSelectedEmpresa(null)}
              >
                <div className="p-2 max-w-[300px]">
                  <h3 className="font-medium text-base">{selectedEmpresa.nome_fantasia}</h3>
                  <p className="text-sm text-gray-600">{selectedEmpresa.endereco}</p>
                  <p className="text-sm text-gray-600">{selectedEmpresa.cidade}</p>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <MapPin size={14} />
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEmpresa.latitude},${selectedEmpresa.longitude}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Como chegar
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="h-[500px] flex items-center justify-center bg-gray-100">
            Carregando mapa...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmpresaMapView;
