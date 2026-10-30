
import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InteresseSearch from './InteresseSearch';

interface InteresseHeaderProps {
  interessadosCount: number;
  searchTerm: string;
  searchField: 'nome' | 'email';
  onSearchTermChange: (value: string) => void;
  onSearchFieldChange: (value: 'nome' | 'email') => void;
  onSearch: (e: React.FormEvent) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const InteresseHeader: React.FC<InteresseHeaderProps> = ({
  interessadosCount,
  searchTerm,
  searchField,
  onSearchTermChange,
  onSearchFieldChange,
  onSearch,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">Interessados Pendentes</h2>
        <p className="text-sm text-muted-foreground">
          {interessadosCount} interessados aguardando aprovação
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <InteresseSearch
          searchTerm={searchTerm}
          searchField={searchField}
          onSearchTermChange={onSearchTermChange}
          onSearchFieldChange={onSearchFieldChange}
          onSearch={onSearch}
          isLoading={isLoading}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
    </div>
  );
};

export default InteresseHeader;

