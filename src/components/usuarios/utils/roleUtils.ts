
import { UserRole } from '../types';

export type DatabaseUserRole = 'admin' | 'user' | 'associado' | 'diretoria' | 'conveniado' | 'empresa';

export const mapToDbRole = (appRole: UserRole): DatabaseUserRole => {
  switch(appRole) {
    case 'admin': return 'admin';
    case 'user': return 'user';
    case 'empresa': return 'empresa';
    default: return 'user';
  }
};

export const mapFromDbRole = (dbRole: string): UserRole => {
  if (['associado', 'diretoria'].includes(dbRole)) {
    return 'user';
  } else if (dbRole === 'conveniado' || dbRole === 'empresa') {
    return 'empresa';
  } else if (dbRole === 'admin') {
    return 'admin';
  } else {
    return 'user';
  }
};

export const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'user':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'empresa':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'user':
      return 'Associado';
    case 'empresa':
      return 'Empresa';
    default:
      return role;
  }
};
