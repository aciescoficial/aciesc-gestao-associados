
import React from 'react';
import { Filter, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { UserRole } from '../types';
import { UserFilters as UserFiltersType } from '../hooks/useUserFetch';
import { getRoleLabel } from '../utils/roleUtils';
import { format } from 'date-fns';

interface UserFiltersProps {
  filters: UserFiltersType;
  onUpdateFilters: (filters: Partial<UserFiltersType>) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onUpdateFilters }) => {
  const handleRoleChange = (value: string) => {
    onUpdateFilters({ role: value as UserRole | 'all' });
  };

  const handleStatusChange = (value: string) => {
    onUpdateFilters({ activeStatus: value as 'all' | 'active' | 'inactive' });
  };

  const handleFromDateChange = (date: Date | undefined) => {
    onUpdateFilters({
      dateRange: {
        ...filters.dateRange,
        from: date || null
      }
    });
  };

  const handleToDateChange = (date: Date | undefined) => {
    onUpdateFilters({
      dateRange: {
        ...filters.dateRange,
        to: date || null
      }
    });
  };

  const handleResetFilters = () => {
    onUpdateFilters({
      role: 'all',
      activeStatus: 'all',
      dateRange: { from: null, to: null }
    });
  };

  const hasActiveFilters = 
    filters.role !== 'all' || 
    filters.activeStatus !== 'all' || 
    filters.dateRange.from !== null || 
    filters.dateRange.to !== null;

  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4">
      <div className="flex items-center w-full md:w-auto space-x-2">
        <Input
          placeholder="Pesquisar por nome ou email..."
          value={filters.searchTerm}
          onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
          className="w-full"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={hasActiveFilters ? "default" : "outline"} 
              size="icon"
              className="shrink-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4 p-2">
              <h4 className="font-medium">Filtros avançados</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de usuário</label>
                <Select
                  value={filters.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="admin">{getRoleLabel('admin')}</SelectItem>
                    <SelectItem value="user">{getRoleLabel('user')}</SelectItem>
                    <SelectItem value="empresa">{getRoleLabel('empresa')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.activeStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Período de cadastro</label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? (
                          format(filters.dateRange.from, 'dd/MM/yyyy')
                        ) : (
                          <span>De</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from || undefined}
                        onSelect={handleFromDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? (
                          format(filters.dateRange.to, 'dd/MM/yyyy')
                        ) : (
                          <span>Até</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to || undefined}
                        onSelect={handleToDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleResetFilters}
                >
                  Limpar filtros
                </Button>
                <Button 
                  size="sm"
                  onClick={() => document.dispatchEvent(new Event('click'))} // Close popover
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default UserFilters;
