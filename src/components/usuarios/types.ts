
export type UserRole = 'admin' | 'diretoria' | 'associado' | 'empresa' | 'user';

export type Permission = {
  id: string;
  name: string;
  description: string;
  module: 'associados' | 'empresas' | 'financeiro' | 'configuracoes';
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
