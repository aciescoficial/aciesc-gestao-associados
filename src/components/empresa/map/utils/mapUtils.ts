
import { EmpresaData } from '../../types';
import { nichoColors } from '../constants/colorScheme';
import { InfoWindowOptions } from '../types/MapTypes';

/**
 * Creates custom SVG marker icon for Google Maps
 */
export const createMarkerIcon = (nicho: string) => {
  const nichoColor = nichoColors[nicho] || '#9E9E9E';
  
  return {
    path: "M12,0C5.4,0,0,5.4,0,12c0,7.2,12,24,12,24s12-16.8,12-24C24,5.4,18.6,0,12,0z M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18z",
    fillColor: nichoColor,
    fillOpacity: 0.9,
    strokeWeight: 1,
    strokeColor: "#FFFFFF",
    rotation: 0,
    scale: 1,
    anchor: new google.maps.Point(12, 24),
    labelOrigin: new google.maps.Point(12, 12)
  };
};

/**
 * Creates HTML content for marker info window
 */
export const createInfoWindowContent = ({ company, currentLocation }: InfoWindowOptions) => {
  const logoUrl = company.logo_url || 'https://placehold.co/80x80?text=Logo';
  const nichoColor = nichoColors[company.nicho as string] || '#9E9E9E';

  return `
    <div style="padding: 8px; max-width: 300px; font-family: system-ui, sans-serif;">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <img src="${logoUrl}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px; margin-right: 12px;" />
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; font-weight: 600;">${company.nome_fantasia}</h3>
          <span style="display: inline-block; background: ${nichoColor}; color: white; font-size: 11px; padding: 2px 6px; border-radius: 12px;">${company.nicho}</span>
        </div>
      </div>

      <div style="margin: 8px 0; font-size: 13px; color: #444;">
        ${company.desconto ? `<p style="margin: 4px 0;"><strong>Desconto:</strong> ${company.desconto}</p>` : ''}
        <p style="margin: 4px 0;"><strong>Endereço:</strong> ${company.endereco}, ${company.cidade}</p>
        ${company.telefone ? `<p style="margin: 4px 0;"><strong>Telefone:</strong> <a href="tel:${company.telefone}" style="color: #1e88e5;">${company.telefone}</a></p>` : ''}
        ${company.email ? `<p style="margin: 4px 0;"><strong>E-mail:</strong> <a href="mailto:${company.email}" style="color: #1e88e5;">${company.email}</a></p>` : ''}
      </div>

      <div style="margin-top: 12px; display: flex; justify-content: space-between;">
        <a href="/empresas/${company.id}" 
          style="display: inline-block; background: #1e88e5; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 13px;">
          Ver detalhes
        </a>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.nome_fantasia} ${company.endereco} ${company.cidade}`)}" 
          target="_blank"
          style="display: inline-block; background: #4caf50; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 13px;">
          Como chegar
        </a>
      </div>
    </div>
  `;
};

/**
 * Creates a pulsating effect for user location
 */
export const createLocationPulse = (
  position: google.maps.LatLng | google.maps.LatLngLiteral,
  map: google.maps.Map | null
) => {
  if (!map) return;
  
  let scale = 0;
  const pulseUserLocation = () => {
    const pulse = new google.maps.Marker({
      position: position,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#4285F4",
        fillOpacity: 0.3,
        strokeColor: "#4285F4",
        strokeWeight: 0,
        scale: 10 + scale
      },
      zIndex: 999,
    });
    
    setTimeout(() => {
      pulse.setMap(null);
    }, 300);
    
    scale = (scale + 1) % 10;
  };
  
  // Animate a few pulses
  for (let i = 0; i < 5; i++) {
    setTimeout(pulseUserLocation, i * 300);
  }
};
