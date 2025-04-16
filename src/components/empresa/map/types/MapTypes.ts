
import { EmpresaData } from "../../types";

export interface MapControlProps {
  onClick?: () => void;
}

export interface MapViewProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
  apiKey: string;
}

export interface MapComponentProps {
  mapRef: React.RefObject<HTMLDivElement>;
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
  visibleCompanies: EmpresaData[];
  currentLocation: {lat: number, lng: number};
  setCurrentLocation: (location: {lat: number, lng: number}) => void;
  handleLocateUser: () => void;
  mapInstance: React.MutableRefObject<google.maps.Map | null>;
  markers: React.MutableRefObject<google.maps.Marker[]>;
  infoWindow: React.MutableRefObject<google.maps.InfoWindow | null>;
}

export interface CompanyListProps {
  visibleCompanies: EmpresaData[];
  setSelectedCompany: (company: EmpresaData | null) => void;
}

export interface FilterBarProps {
  uniqueNichos: string[];
  activeNichoFilters: string[];
  toggleNichoFilter: (nicho: string) => void;
}

export interface MapLegendProps {
  nichoColors: Record<string, string>;
}

export interface InfoWindowOptions {
  company: EmpresaData;
  currentLocation: {lat: number, lng: number};
}
