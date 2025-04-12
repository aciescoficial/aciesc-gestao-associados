
/**
 * Generate simulated geolocation data for entities that don't have real coordinates
 * In a real implementation, these coordinates would come from the database
 */
export const generateSimulatedLocation = (
  baseLatitude: number,
  baseLongitude: number,
  randomFactor = 0.05
) => {
  return {
    latitude: baseLatitude + (Math.random() - 0.5) * randomFactor,
    longitude: baseLongitude + (Math.random() - 0.5) * randomFactor
  };
};

/**
 * Calculate distance between two coordinates in kilometers using the Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

/**
 * Convert degrees to radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
