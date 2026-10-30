
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InteresseSearchProps {
  searchTerm: string;
  searchField: 'nome' | 'email';
  onSearchTermChange: (value: string) => void;
  onSearchFieldChange: (value: 'nome' | 'email') => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const InteresseSearch: React.FC<InteresseSearchProps> = ({
  searchTerm,
  searchField,
  onSearchTermChange,
  onSearchFieldChange,
  onSearch,
  isLoading
}) => {
  return (
    <form onSubmit={onSearch} className="flex gap-2">
      <select 
        className="h-9 rounded-md border border-input px-3"
        value={searchField}
        onChange={(e) => onSearchFieldChange(e.target.value as 'nome' | 'email')}
      >
        <option value="nome">Nome</option>
        <option value="email">Email</option>
      </select>
      <div className="flex items-center relative">
        <Input
          placeholder="Buscar interessados..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="min-w-[200px]"
        />
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon" 
          className="absolute right-0"
          disabled={isLoading}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default InteresseSearch;
