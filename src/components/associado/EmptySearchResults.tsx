
import React from 'react';

interface EmptySearchResultsProps {
  isSearching: boolean;
}

const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({ isSearching }) => {
  if (isSearching) {
    return (
      <div className="mt-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Buscando associados...</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="text-center p-12 text-gray-500">
        Use os filtros acima para buscar associados
      </div>
    </div>
  );
};

export default EmptySearchResults;
