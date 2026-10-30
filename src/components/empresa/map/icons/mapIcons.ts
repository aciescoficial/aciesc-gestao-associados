
import L from 'leaflet';

// Define icon paths with proper URL handling
const iconPath = '/images/map/';

// Helper function to create an icon
const createIcon = (iconName: string, iconSize: [number, number] = [32, 32]) => {
  return L.icon({
    iconUrl: `${iconPath}${iconName}.png`,
    iconSize: iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [0, -iconSize[1]]
  });
};

// Create individual icons
export const companyIcon = createIcon('company-marker', [32, 32]);
export const companySelectedIcon = createIcon('company-marker-selected', [36, 36]);
export const companyHoverIcon = createIcon('company-marker-hover', [34, 34]);
export const userLocationIcon = createIcon('user-location', [24, 24]);
export const smallClusterIcon = createIcon('cluster-small', [40, 40]);
export const mediumClusterIcon = createIcon('cluster-medium', [50, 50]);
export const largeClusterIcon = createIcon('cluster-large', [60, 60]);
export const estateIcon = createIcon('category-estate', [28, 28]);
export const serviceIcon = createIcon('category-service', [28, 28]);
export const retailIcon = createIcon('category-retail', [28, 28]);
export const defaultIcon = createIcon('category-default', [28, 28]);
export const selectedIcon = createIcon('company-marker-selected', [36, 36]);

// For backwards compatibility, also export the icons object
const icons = {
  company: companyIcon,
  companySelected: companySelectedIcon,
  companyHover: companyHoverIcon,
  userLocation: userLocationIcon,
  smallCluster: smallClusterIcon,
  mediumCluster: mediumClusterIcon,
  largeCluster: largeClusterIcon,
  estate: estateIcon,
  service: serviceIcon,
  retail: retailIcon,
  default: defaultIcon
};

// Export default icons for compatibility
export default icons;
