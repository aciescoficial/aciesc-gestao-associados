
/**
 * Main associado service file - exports all associado-related functions
 */

export { 
  saveAssociado, 
} from './services/associadoCrudService';

export {
  uploadFoto
} from './services/associadoStorageService';

export {
  getAssociadoById
} from './services/baseAssociadoService';

export {
  importAssociados
} from './services/importService';

export {
  exportAssociados
} from './services/exportService';

