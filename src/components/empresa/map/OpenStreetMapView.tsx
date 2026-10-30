
import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { defaultIcon, selectedIcon } from './icons/mapIcons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Globe, Building } from 'lucide-react';
import { EmpresaData } from '../types';
import L from 'leaflet';

interface OpenStreetMapViewProps {
  companies: EmpresaData[];
  currentLocation?: [number, number];
  selectedCompany?: EmpresaData | null;
  onSelectCompany?: (company: EmpresaData) => void;
  onViewDetails?: (id: string) => void;
  setSelectedCompany?: (company: EmpresaData | null) => void; // Added for compatibility with existing code
}

const OpenStreetMapView: React.FC<OpenStreetMapViewProps> = ({
  companies,
  currentLocation = [-15.7801, -47.9292], // Default to Brazil
  selectedCompany = null,
  onSelectCompany,
  onViewDetails = () => {},
  setSelectedCompany, // Added for compatibility
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Handle component selection based on available props
  const handleSelectCompany = (company: EmpresaData) => {
    // Use onSelectCompany if provided, otherwise fall back to setSelectedCompany
    if (onSelectCompany) {
      onSelectCompany(company);
    } else if (setSelectedCompany) {
      setSelectedCompany(company);
    }
  };

  // Set map view to currentLocation or to fit all markers
  useEffect(() => {
    if (mapRef.current && mapInitialized) {
      // If we have a current location, center on it
      if (currentLocation) {
        mapRef.current.setView(currentLocation, 13);
      } 
      // If we have companies but no current location, fit the map to show all companies
      else if (companies.length > 0) {
        const validLocations = companies
          .filter(c => c.latitude && c.longitude)
          .map(c => [c.latitude, c.longitude] as [number, number]);
          
        if (validLocations.length > 0) {
          const bounds = L.latLngBounds(validLocations);
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  }, [currentLocation, companies, mapInitialized]);

  // Update view when selected company changes
  useEffect(() => {
    if (mapRef.current && mapInitialized && selectedCompany?.latitude && selectedCompany?.longitude) {
      mapRef.current.setView([selectedCompany.latitude, selectedCompany.longitude], 15);
    }
  }, [selectedCompany, mapInitialized]);

  const handleMapReady = () => {
    setMapInitialized(true);
  };

  return (
    <div className="h-[600px] w-full relative rounded-lg overflow-hidden">
      <MapContainer
        center={currentLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => handleMapReady()}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Current location marker */}
        <Marker position={currentLocation} icon={defaultIcon}>
          <Popup>
            <div className="text-sm font-medium">Sua localização atual</div>
          </Popup>
        </Marker>
        
        {/* Company markers */}
        {mapInitialized && companies.map((company) => {
          if (!company.latitude || !company.longitude) return null;
          
          const isSelected = selectedCompany?.id === company.id;
          const markerIcon = isSelected ? selectedIcon : defaultIcon;
          
          return (
            <Marker
              key={company.id}
              position={[company.latitude, company.longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: () => handleSelectCompany(company)
              }}
            >
              <Popup>
                <Card className="border-0 shadow-none">
                  <CardContent className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{company.nome_fantasia}</span>
                    </div>
                    
                    {company.nicho && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{company.nicho}</span>
                      </div>
                    )}
                    
                    {company.endereco && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {company.endereco}
                          {company.cidade && `, ${company.cidade}`}
                        </span>
                      </div>
                    )}
                    
                    {company.telefone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{company.telefone}</span>
                      </div>
                    )}
                    
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => onViewDetails(company.id)}
                    >
                      Ver detalhes
                    </Button>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default OpenStreetMapView;
