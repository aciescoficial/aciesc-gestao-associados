
import React from 'react';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFormData {
  searchTerm: string;
  searchType: 'nome' | 'cnpj' | 'nicho';
  status: 'ativo' | 'inativo' | 'todos';
}

interface CompanySearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isLoading?: boolean;
}

export const CompanySearchForm: React.FC<CompanySearchFormProps> = ({
  onSearch,
  isLoading = false
}) => {
  const { register, handleSubmit, watch, setValue } = useForm<SearchFormData>({
    defaultValues: {
      searchType: 'nome',
      status: 'todos'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de busca</label>
          <Select
            value={watch('searchType')}
            onValueChange={(value: 'nome' | 'cnpj' | 'nicho') => setValue('searchType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome">Nome/Razão Social</SelectItem>
              <SelectItem value="cnpj">CNPJ</SelectItem>
              <SelectItem value="nicho">Nicho</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={watch('status')}
            onValueChange={(value: 'ativo' | 'inativo' | 'todos') => setValue('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Termo de busca</label>
          <div className="relative">
            <Input
              {...register('searchTerm')}
              placeholder={`Buscar por ${
                watch('searchType') === 'nome' ? 'nome ou razão social' :
                watch('searchType') === 'cnpj' ? 'CNPJ' : 'nicho'
              }`}
              className="pl-10"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>
    </form>
  );
};
