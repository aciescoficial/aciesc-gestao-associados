
import { EmpresaData } from "../EmpresasPesquisa";

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

/**
 * Sort empresas by distance to a reference point
 */
export function sortByDistance(
  empresas: EmpresaData[],
  referenceLat: number,
  referenceLng: number
): EmpresaData[] {
  return [...empresas].sort((a, b) => {
    if (!a.latitude || !a.longitude) return 1;
    if (!b.latitude || !b.longitude) return -1;
    
    const distA = calculateDistance(referenceLat, referenceLng, a.latitude, a.longitude);
    const distB = calculateDistance(referenceLat, referenceLng, b.latitude, b.longitude);
    
    return distA - distB;
  });
}

/**
 * Get formatted distance string
 */
export function getDistanceText(
  empresa: EmpresaData,
  referenceLat: number | undefined,
  referenceLng: number | undefined
): string {
  if (!empresa.latitude || !empresa.longitude || !referenceLat || !referenceLng) {
    return 'N/A';
  }
  
  const distance = calculateDistance(
    referenceLat,
    referenceLng,
    empresa.latitude,
    empresa.longitude
  );
  
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  
  return `${distance.toFixed(1)} km`;
}
