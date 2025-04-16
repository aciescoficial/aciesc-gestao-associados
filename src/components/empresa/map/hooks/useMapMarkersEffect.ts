
import { useEffect } from 'react';
import { EmpresaData } from '../../types';
import { createMarkerIcon, createInfoWindowContent } from '../utils/mapUtils';

/**
 * Hook to manage company markers on map
 */
export const useMapMarkersEffect = (
  mapInstance: React.MutableRefObject<google.maps.Map | null>,
  markers: React.MutableRefObject<google.maps.Marker[]>,
  infoWindow: React.MutableRefObject<google.maps.InfoWindow | null>,
  companies: EmpresaData[],
  activeNichoFilters: string[],
  setSelectedCompany: (company: EmpresaData | null) => void,
  currentLocation: {lat: number, lng: number},
  setVisibleCompanies: (companies: EmpresaData[]) => void,
  mapLoaded: boolean
) => {
  // Add or update markers when companies change
  useEffect(() => {
    if (!mapInstance.current || !mapLoaded || companies.length === 0) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
    
    // Add markers for each company
    companies.forEach(company => {
      // If we don't have coordinates, generate random ones around Brazil
      const lat = company.latitude || -15.7801 + (Math.random() - 0.5) * 10;
      const lng = company.longitude || -47.9292 + (Math.random() - 0.5) * 10;
      
      // Create custom marker using company's nicho color
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        title: company.nome_fantasia,
        animation: google.maps.Animation.DROP,
        icon: createMarkerIcon(company.nicho),
        optimized: true,
        visible: activeNichoFilters.length === 0 || activeNichoFilters.includes(company.nicho)
      });
      
      // Store company data with marker for later use
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
  }, [companies, mapLoaded, activeNichoFilters]);

  // Update marker visibility when filters change
  useEffect(() => {
    if (!mapInstance.current || !mapLoaded) return;
    
    markers.current.forEach(marker => {
      const company = marker.get('company') as EmpresaData;
      
      if (!company || !company.nicho) return;
      
      if (activeNichoFilters.length === 0 || activeNichoFilters.includes(company.nicho)) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    });
    
    updateVisibleCompanies();
  }, [activeNichoFilters, mapLoaded]);

  // Show info window when a company is selected
  useEffect(() => {
    if (!mapInstance.current || !mapLoaded) return;
    
    if (!infoWindow.current) {
      infoWindow.current = new google.maps.InfoWindow({
        maxWidth: 320,
        pixelOffset: new google.maps.Size(0, -30)
      });
    }
    
    mapInstance.current.addListener('idle', updateVisibleCompanies);
  }, [mapLoaded]);

  // Function to update visible companies based on map bounds
  function updateVisibleCompanies() {
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
  }
};

/**
 * Hook to handle selected company on map
 */
export const useSelectedCompanyEffect = (
  mapInstance: React.MutableRefObject<google.maps.Map | null>,
  markers: React.MutableRefObject<google.maps.Marker[]>,
  infoWindow: React.MutableRefObject<google.maps.InfoWindow | null>,
  selectedCompany: EmpresaData | null,
  currentLocation: {lat: number, lng: number},
  mapLoaded: boolean
) => {
  useEffect(() => {
    if (!mapInstance.current || !selectedCompany || !mapLoaded || !infoWindow.current) return;
    
    // Create coordinates from company data or fallback to random if not available
    const lat = selectedCompany.latitude || -15.7801 + (Math.random() - 0.5) * 10;
    const lng = selectedCompany.longitude || -47.9292 + (Math.random() - 0.5) * 10;
    
    mapInstance.current.setCenter({ lat, lng });
    mapInstance.current.setZoom(12);
    
    // Show info window for selected company
    infoWindow.current.setContent(createInfoWindowContent({
      company: selectedCompany,
      currentLocation
    }));
    infoWindow.current.setPosition({ lat, lng });
    infoWindow.current.open(mapInstance.current);
    
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
};
