
import { useState, useCallback } from 'react';
import { EmpresaData } from '../../types';
import { createLocationPulse } from '../utils/mapUtils';

/**
 * Hook for map controls and user interactions
 */
export const useMapControls = (
  mapInstance: React.MutableRefObject<google.maps.Map | null>,
  setCurrentLocation: (location: {lat: number, lng: number}) => void,
  setSelectedCompany: (company: EmpresaData | null) => void
) => {
  const [activeNichoFilters, setActiveNichoFilters] = useState<string[]>([]);
  
  /**
   * Handle zoom in/out
   */
  const handleZoom = useCallback((zoomIn: boolean) => {
    if (!mapInstance.current) return;
    const currentZoom = mapInstance.current.getZoom() || 0;
    mapInstance.current.setZoom(zoomIn ? currentZoom + 1 : currentZoom - 1);
  }, [mapInstance]);
  
  /**
   * Get user's current location
   */
  const handleLocateUser = useCallback(() => {
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
          
          // Create pulsating effect
          createLocationPulse(pos, mapInstance.current);
          
          setCurrentLocation(pos);
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
  }, [mapInstance, setCurrentLocation]);
  
  /**
   * Toggle nicho filters
   */
  const toggleNichoFilter = useCallback((nicho: string) => {
    setActiveNichoFilters(prev => {
      if (prev.includes(nicho)) {
        return prev.filter(n => n !== nicho);
      } else {
        return [...prev, nicho];
      }
    });
  }, []);
  
  return {
    activeNichoFilters,
    handleZoom,
    handleLocateUser,
    toggleNichoFilter
  };
};
