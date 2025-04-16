
import React, { useEffect } from 'react';
import { MapComponentProps } from '../types/MapTypes';
import FilterBar from './FilterBar';
import MapLegend from './MapLegend';
import { ZoomControls, LocationButton } from './MapControls';
import { nichoColors } from '../constants/colorScheme';

/**
 * Main map component with all controls and UI elements
 */
const MapComponent: React.FC<MapComponentProps> = ({
  mapRef,
  companies,
  selectedCompany,
  visibleCompanies,
  currentLocation,
  handleLocateUser,
  mapInstance,
  setSelectedCompany
}) => {
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
  
  // Toggle nicho filters
  const toggleNichoFilter = (nicho: string) => {
    // We'll handle this in the parent component
  };
  
  // Handle zoom
  const handleZoom = (zoomIn: boolean) => {
    if (!mapInstance.current) return;
    const currentZoom = mapInstance.current.getZoom() || 0;
    mapInstance.current.setZoom(zoomIn ? currentZoom + 1 : currentZoom - 1);
  };
  
  return (
    <div className="relative h-[600px] w-full">
      {/* Map container */}
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Nicho filters */}
      <FilterBar 
        uniqueNichos={uniqueNichos}
        activeNichoFilters={[]}
        toggleNichoFilter={() => {}}
      />
      
      {/* Map legend */}
      <MapLegend nichoColors={nichoColors} />
      
      {/* Zoom controls */}
      <div 
        id="map-zoom-controls" 
        className="absolute bottom-12 right-4 flex flex-col gap-1 z-10"
      >
        <ZoomControls 
          onZoomIn={() => handleZoom(true)} 
          onZoomOut={() => handleZoom(false)} 
        />
      </div>
      
      {/* Navigation controls */}
      <div
        id="map-navigation-controls"
        className="absolute top-3 left-3 flex flex-col gap-1 z-10"
      >
        <LocationButton onClick={handleLocateUser} />
      </div>
    </div>
  );
};

export default MapComponent;
