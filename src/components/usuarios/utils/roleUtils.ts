import { UserRole, UserTag } from '../types';

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
    case 'diretoria':
      return 'diretoria';
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
    case 'user':
      return 'user';
    case 'conveniado':
    case 'empresa':
      return 'empresa';
    case 'diretoria':
      return 'diretoria';
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
    case 'diretoria':
      return 'Diretoria';
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
    case 'diretoria':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Get all available user tags
export const getUserTags = (): { id: UserTag; name: string }[] => {
  return [
    { id: 'corretor', name: 'Corretor' },
    { id: 'corretor_autonomo', name: 'Corretor Autônomo' },
    { id: 'empresa_conveniada', name: 'Empresa Conveniada' },
    { id: 'diretoria_aciesc', name: 'Diretoria ACIESC' },
    { id: 'administrador', name: 'Administrador' },
    { id: 'financeiro', name: 'Financeiro' },
    { id: 'proprietario_imobiliaria', name: 'Proprietário de Imobiliária' },
    { id: 'imobiliaria', name: 'Imobiliária' },
    { id: 'aciesc', name: 'ACIESC' },
  ];
};

// Get tag badge color
export const getTagBadgeColor = (tag: UserTag): string => {
  switch (tag) {
    case 'corretor':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'corretor_autonomo':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'empresa_conveniada':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'diretoria_aciesc':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'administrador':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'financeiro':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'proprietario_imobiliaria':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'imobiliaria':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'aciesc':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Check if user has a specific tag
export const hasTag = (userTags: UserTag[] | undefined, tag: UserTag): boolean => {
  return userTags ? userTags.includes(tag) : false;
};

// Check if user has admin privileges (either admin role or administrador tag)
export const isAdminOrFinanceiro = (userRole: UserRole | null, userTags: UserTag[] | undefined): boolean => {
  if (userRole === 'admin') return true;
  return hasTag(userTags, 'administrador') || hasTag(userTags, 'financeiro');
};

// Check if user has access to financeiro
export const hasFinanceiroAccess = (userRole: UserRole | null, userTags: UserTag[] | undefined): boolean => {
  if (userRole === 'admin') return true;
  return hasTag(userTags, 'financeiro');
};
