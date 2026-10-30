
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '../types';
import { getRoleLabel } from '../utils/roleUtils';
import { Search } from 'lucide-react';

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: UserRole | 'all';
  setRoleFilter: (role: UserRole | 'all') => void;
  loading?: boolean;
}

const UserSearch: React.FC<UserSearchProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  loading
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
          disabled={loading}
        />
      </div>
      <Select
        value={roleFilter}
        onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="user">{getRoleLabel('user')}</SelectItem>
          <SelectItem value="admin">{getRoleLabel('admin')}</SelectItem>
          <SelectItem value="empresa">{getRoleLabel('empresa')}</SelectItem>
          <SelectItem value="diretoria">{getRoleLabel('diretoria')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserSearch;
