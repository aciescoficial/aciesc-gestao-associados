
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFormProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  onSearchTermChange,
  pageSize,
  onPageSizeChange,
  onSubmit
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-end">
      <form onSubmit={onSubmit} className="flex-1 flex gap-2">
        <Input
          placeholder="Buscar por nome, razão social ou CNPJ"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit">Buscar</Button>
      </form>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Itens por página:
        </span>
        <Select
          value={pageSize.toString()}
          onValueChange={(val) => onPageSizeChange(Number(val))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
