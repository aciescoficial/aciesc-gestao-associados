
import { EmpresaData } from "../types";

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 First point latitude
 * @param lon1 First point longitude
 * @param lat2 Second point latitude
 * @param lon2 Second point longitude
 * @returns Distance in kilometers
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

/**
 * Convert degrees to radians
 * @param value Degrees value
 * @returns Radians value
 */
function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

/**
 * Sort empresas by distance to a reference point
 * @param empresas Array of empresas to sort
 * @param referenceLat Reference point latitude
 * @param referenceLng Reference point longitude
 * @returns Sorted array of empresas
 */
export function sortByDistance(
  empresas: EmpresaData[],
  referenceLat: number,
  referenceLng: number
): EmpresaData[] {
  // Create a copy of the array to avoid mutating the original
  return [...empresas].sort((a, b) => {
    // Handle cases where latitude or longitude is missing
    if (!a.latitude || !a.longitude) return 1;
    if (!b.latitude || !b.longitude) return -1;
    
    // Calculate distances
    const distA = calculateDistance(referenceLat, referenceLng, a.latitude, a.longitude);
    const distB = calculateDistance(referenceLat, referenceLng, b.latitude, b.longitude);
    
    // Sort by distance (ascending)
    return distA - distB;
  });
}

/**
 * Get formatted distance string
 * @param empresa Empresa data
 * @param referenceLat Reference point latitude
 * @param referenceLng Reference point longitude
 * @returns Formatted distance text (e.g., "1.2 km" or "800 m")
 */
export function getDistanceText(
  empresa: EmpresaData,
  referenceLat: number | undefined,
  referenceLng: number | undefined
): string {
  // Return "N/A" if any coordinate is missing
  if (!empresa.latitude || !empresa.longitude || !referenceLat || !referenceLng) {
    return 'N/A';
  }
  
  // Calculate distance
  const distance = calculateDistance(
    referenceLat,
    referenceLng,
    empresa.latitude,
    empresa.longitude
  );
  
  // Format distance (meters if less than 1km, otherwise kilometers)
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  
  return `${distance.toFixed(1)} km`;
}
