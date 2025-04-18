
import { empresaCrudService } from './empresaCrudService';
import { empresaImportService } from './empresaImportService';
import { empresaStatusService } from './empresaStatusService';

// Re-export the services under a unified name for easier imports
export const empresaService = {
  ...empresaCrudService,
  ...empresaImportService,
  ...empresaStatusService
};

// Re-export types
export type { ImportEmpresaData } from './empresaImportService';
