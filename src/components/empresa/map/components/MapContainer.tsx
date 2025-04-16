
import React, { useState } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';
import CompanyMarkers from './CompanyMarkers';
import { EmpresaData } from '../../types';

interface MapContainerProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
  currentLocation: [number, number];
  zoom: number;
  mapRef: React.MutableRefObject<L.Map | null>;
}

export const MapContainerComponent: React.FC<MapContainerProps> = ({
  companies,
  selectedCompany,
  setSelectedCompany,
  currentLocation,
  zoom,
  mapRef
}) => {
  const [mapInitialized, setMapInitialized] = useState(false);

  return (
    <div className="relative h-[600px] w-full">
      <LeafletMapContainer 
        style={{ height: "100%", width: "100%" }}
        // Using center and zoom as props on the MapUpdater component instead
        // @ts-ignore - Adding scrollWheelZoom props
        scrollWheelZoom={true}
        whenReady={() => {
          setMapInitialized(true);
        }}
      >
        <MapUpdater center={currentLocation} zoom={zoom} mapRef={mapRef} />
        <TileLayer
          // @ts-ignore - Using attribution prop for OpenStreetMap
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <CompanyMarkers 
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          mapInitialized={mapInitialized}
        />
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainerComponent;
