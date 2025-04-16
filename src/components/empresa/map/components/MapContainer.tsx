
import React, { useState } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';
import CompanyMarkers from './CompanyMarkers';
import { EmpresaData } from '../../types';
import L from 'leaflet';

interface MapComponentProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
  currentLocation: [number, number];
  zoom: number;
  mapRef: React.MutableRefObject<L.Map | null>;
}

export const MapContainerComponent: React.FC<MapComponentProps> = ({
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
      {/* 
       * The issue is how we're typing props for the react-leaflet components.
       * Instead of creating custom interfaces, we'll let TypeScript infer types.
       * This is a valid workaround for react-leaflet type issues.
       */}
      <LeafletMapContainer 
        style={{ height: "100%", width: "100%" }}
        center={currentLocation as [number, number]}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={true}
        whenReady={() => {
          setMapInitialized(true);
        }}
      >
        <MapUpdater center={currentLocation} zoom={zoom} mapRef={mapRef} />
        <TileLayer
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
