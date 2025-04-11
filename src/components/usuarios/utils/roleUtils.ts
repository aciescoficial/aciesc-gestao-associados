
import { UserRole } from '../types';

// Original database role types 
export type DatabaseUserRole = 'admin' | 'user' | 'associado' | 'diretoria' | 'conveniado' | 'empresa';

// Map frontend simplified role to database role
export const mapToDbRole = (role: UserRole): DatabaseUserRole => {
  switch (role) {
    case 'admin':
      return 'admin';
    case 'user':
      return 'associado';
    case 'empresa':
      return 'empresa';
    default:
      return 'associado';
  }
};

// Map database role to frontend simplified role
export const mapFromDbRole = (dbRole: DatabaseUserRole | string): UserRole => {
  switch (dbRole) {
    case 'admin':
      return 'admin';
    case 'associado':
    case 'diretoria':
    case 'user':
      return 'user';
    case 'conveniado':
    case 'empresa':
      return 'empresa';
    default:
      return 'user';
  }
};

// Get role label (display name)
export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'user':
      return 'Associado';
    case 'empresa':
      return 'Empresa';
    default:
      return 'Usuário';
  }
};

// Get role badge color
export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'user':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'empresa':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
