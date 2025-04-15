
import { UserRole, UserTag, RoleInfo, TagInfo } from '../types';
import { Shield, User, Building2, Users } from 'lucide-react';

// Map role to badge color
export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'diretoria':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'empresa':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'user':
    default:
      return 'bg-green-100 text-green-800 border-green-300';
  }
};

// Map role to label
export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'diretoria':
      return 'Diretoria';
    case 'empresa':
      return 'Empresa';
    case 'user':
    default:
      return 'Associado';
  }
};

// Map db role to UI role (if needed)
export const mapFromDbRole = (dbRole: string): UserRole => {
  switch (dbRole) {
    case 'admin':
      return 'admin';
    case 'diretoria':
      return 'diretoria';
    case 'empresa':
      return 'empresa';
    case 'user':
    default:
      return 'user';
  }
};

// Map UI role to db role
export const mapToDbRole = (uiRole: UserRole): string => {
  // If the roles are the same in UI and DB, just return the UI role
  return uiRole;
};

// Get available roles with info
export const getRoles = (): RoleInfo[] => {
  // Import icons as named constructor functions instead of JSX elements
  return [
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Acesso completo ao sistema',
      icon: Shield
    },
    {
      id: 'user',
      name: 'Associado',
      description: 'Acesso a funcionalidades de associado',
      icon: User
    },
    {
      id: 'empresa',
      name: 'Empresa',
      description: 'Acesso a funcionalidades de empresa',
      icon: Building2
    },
    {
      id: 'diretoria',
      name: 'Diretoria',
      description: 'Acesso a funcionalidades da diretoria',
      icon: Users
    }
  ];
};

// Get available user tags
export const getUserTags = (): TagInfo[] => [
  {
    id: 'corretor',
    name: 'Corretor',
    description: 'Usuário é um corretor'
  },
  {
    id: 'corretor_autonomo',
    name: 'Corretor Autônomo',
    description: 'Usuário é um corretor autônomo'
  },
  {
    id: 'empresa_conveniada',
    name: 'Empresa Conveniada',
    description: 'Usuário é de uma empresa conveniada'
  },
  {
    id: 'diretoria_aciesc',
    name: 'Diretoria ACIESC',
    description: 'Usuário é um membro da diretoria da ACIESC'
  },
  {
    id: 'administrador',
    name: 'Administrador',
    description: 'Usuário tem privilégios de administrador'
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    description: 'Usuário tem acesso a funcionalidades financeiras'
  },
  {
    id: 'proprietario_imobiliaria',
    name: 'Proprietário Imobiliária',
    description: 'Usuário é um proprietário de imobiliária'
  },
  {
    id: 'imobiliaria',
    name: 'Imobiliária',
    description: 'Usuário está associado a uma imobiliária'
  },
  {
    id: 'aciesc',
    name: 'ACIESC',
    description: 'Usuário associado à ACIESC'
  }
];
