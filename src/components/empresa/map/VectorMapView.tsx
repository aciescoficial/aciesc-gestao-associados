
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmpresaData } from '../types';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VectorMapViewProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
  apiKey: string;
}

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

  // Function to initialize the map
  useEffect(() => {
    if (!mapRef.current || !apiKey) return;

    const loadMap = async () => {
      // Import Google Maps API script
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      window.initMap = initMap;
      document.head.appendChild(googleMapsScript);
    };

    const initMap = () => {
      if (!mapRef.current) return;
      
      // Create map instance
      const mapOptions: google.maps.MapOptions = {
        center: { lat: -15.7801, lng: -47.9292 }, // Default to Brazil
        zoom: 4,
        mapTypeId: 'terrain',
        styles: [
          {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [{"visibility": "on"}]
          },
          {
            "featureType": "administrative.country",
            "elementType": "all",
            "stylers": [{"visibility": "on"}]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{"color": "#e4f1f9"}]
          },
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{"color": "#f9f9f9"}]
          }
        ]
      };

      mapInstance.current = new google.maps.Map(mapRef.current, mapOptions);
      infoWindow.current = new google.maps.InfoWindow();
      
      // Add companies to map
      addCompaniesToMap();
      
      // Add zoom controls to the map
      mapInstance.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        document.getElementById('map-zoom-controls')!
      );
    };

    if (!window.google) {
      loadMap();
    } else {
      initMap();
    }

  }, [apiKey]);

  // Add companies to map whenever the companies prop changes
  useEffect(() => {
    if (mapInstance.current && companies.length > 0) {
      addCompaniesToMap();
    }
  }, [companies]);

  // Center map on selected company
  useEffect(() => {
    if (!mapInstance.current || !selectedCompany) return;
    
    // Create dummy coordinates if not available
    const lat = selectedCompany.latitude || -15.7801 + (Math.random() - 0.5) * 10;
    const lng = selectedCompany.longitude || -47.9292 + (Math.random() - 0.5) * 10;
    
    mapInstance.current.setCenter({ lat, lng });
    mapInstance.current.setZoom(10);
    
    // Show info window for selected company
    if (infoWindow.current) {
      infoWindow.current.setContent(createInfoWindowContent(selectedCompany));
      infoWindow.current.setPosition({ lat, lng });
      infoWindow.current.open(mapInstance.current);
    }
  }, [selectedCompany]);

  const addCompaniesToMap = () => {
    if (!mapInstance.current) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
    
    // Add markers for each company
    companies.forEach(company => {
      // If we don't have coordinates, generate random ones
      // In a real application, you would use geocoding here
      const lat = company.latitude || -15.7801 + (Math.random() - 0.5) * 10;
      const lng = company.longitude || -47.9292 + (Math.random() - 0.5) * 10;
      
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        title: company.nome_fantasia,
        animation: google.maps.Animation.DROP,
      });
      
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
    }
  };
  
  const createInfoWindowContent = (company: EmpresaData) => {
    return `
      <div style="max-width: 200px; padding: 10px;">
        <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 500;">${company.nome_fantasia}</h3>
        <p style="margin: 0 0 5px; font-size: 12px; color: #666;">${company.cidade}</p>
        <p style="margin: 0; font-size: 12px; color: #666;">${company.nicho}</p>
        ${company.telefone ? `<p style="margin: 5px 0 0; font-size: 12px;"><a href="tel:${company.telefone}">${company.telefone}</a></p>` : ''}
      </div>
    `;
  };
  
  const handleZoom = (zoomIn: boolean) => {
    if (!mapInstance.current) return;
    const currentZoom = mapInstance.current.getZoom() || 0;
    mapInstance.current.setZoom(zoomIn ? currentZoom + 1 : currentZoom - 1);
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
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Empresas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[500px] w-full rounded-md overflow-hidden">
          <div ref={mapRef} className="absolute inset-0" />
          
          <div 
            id="map-zoom-controls" 
            className="absolute bottom-4 right-4 flex flex-col gap-2"
          >
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={() => handleZoom(true)}
            >
              <Plus size={16} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={() => handleZoom(false)}
            >
              <Minus size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VectorMapView;
