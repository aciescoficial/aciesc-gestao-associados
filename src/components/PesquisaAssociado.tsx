
import React from 'react';
import AssociadoSearchForm from './associado/AssociadoSearchForm';
import AssociadoSearchResult from './associado/AssociadoSearchResult';
import { useAssociadoSearch } from './associado/useAssociadoSearch';

const PesquisaAssociado: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    statusFilter,
    setStatusFilter,
    cidadeFilter,
    setCidadeFilter,
    cidades,
    isSearching,
    results,
    handleSearch
  } = useAssociadoSearch();

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Pesquisar Associados</h1>
      
      <div className="wp-card bg-gradient-to-br from-white to-gray-50">
        <AssociadoSearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchType={searchType}
          setSearchType={setSearchType}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          cidadeFilter={cidadeFilter}
          setCidadeFilter={setCidadeFilter}
          cidades={cidades}
          isSearching={isSearching}
          handleSearch={handleSearch}
        />
        
        <AssociadoSearchResult results={results} />
      </div>
    </div>
  );
};

export default PesquisaAssociado;
