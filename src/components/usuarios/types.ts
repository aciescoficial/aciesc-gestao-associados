
export type UserRole = 'admin' | 'diretoria' | 'conveniado' | 'associado';

export type Permission = {
  id: string;
  name: string;
  description: string;
  module: 'conveniados' | 'empresas' | 'financeiro' | 'configuracoes';
  defaultRoles: UserRole[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
};
