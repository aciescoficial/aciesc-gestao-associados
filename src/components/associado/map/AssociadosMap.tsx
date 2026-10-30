
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { defaultIcon } from '../../empresa/map/icons/mapIcons';
import { Card, CardContent } from '@/components/ui/card';
import { User, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Associado } from '../types';
import { CidadesCounter } from './CidadesCounter';

interface AssociadosMapProps {
  associados: Associado[];
  isLoading: boolean;
}

// This interface extends the base Marker props to include the icon property
interface ExtendedMarkerProps extends React.ComponentProps<typeof Marker> {
  icon?: L.Icon;
}

// Create a type-safe Marker component that accepts our extended props
const MarkerWithIcon = Marker as React.ComponentType<ExtendedMarkerProps>;

const AssociadosMap: React.FC<AssociadosMapProps> = ({ associados, isLoading }) => {
  const navigate = useNavigate();
  const [mapInitialized, setMapInitialized] = useState(false);
  
  const defaultCenter: [number, number] = [-27.0861, -48.6161];

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-md">
        <div className="text-muted-foreground">Carregando mapa...</div>
      </div>
    );
  }

  if (associados.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-md">
        <div className="text-muted-foreground">Nenhum associado encontrado para exibir no mapa.</div>
      </div>
    );
  }

  const handleViewAssociado = (id: string) => {
    navigate(`/associados/visualizar/${id}`);
  };

  return (
    <div className="h-[600px] w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapInitialized(true)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mapInitialized && associados.map((associado) => (
          <MarkerWithIcon
            key={associado.id}
            position={[
              defaultCenter[0] + (Math.random() - 0.5) * 0.05,
              defaultCenter[1] + (Math.random() - 0.5) * 0.05
            ]}
            icon={defaultIcon}
          >
            <Popup>
              <Card className="border-0 shadow-none">
                <CardContent className="p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {associado.nome} {associado.sobrenome}
                    </span>
                  </div>
                  
                  {associado.creci && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>CRECI: {associado.creci}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{associado.telefone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{associado.email}</span>
                  </div>
                  
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleViewAssociado(associado.id)}
                  >
                    Ver detalhes
                  </Button>
                </CardContent>
              </Card>
            </Popup>
          </MarkerWithIcon>
        ))}
      </MapContainer>
      <CidadesCounter associados={associados} />
    </div>
  );
};

export default AssociadosMap;
