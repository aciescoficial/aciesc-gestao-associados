
import React from 'react';
import { useSolicitacoes } from './hooks/useSolicitacoes';
import { SolicitacoesSearch } from './components/SolicitacoesSearch';
import { SolicitacoesTable } from './components/SolicitacoesTable';
import { SolicitacoesPagination } from './components/SolicitacoesPagination';

const CarteirinhaSolicitacoes: React.FC = () => {
  const {
    solicitacoes,
    isLoading,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleSearch,
    handlePageChange,
    updateSolicitacao,
    fetchSolicitacoes
  } = useSolicitacoes();

  return (
    <div className="space-y-6">
      <div className="wp-card">
        <SolicitacoesSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          handleSearch={handleSearch}
        />
        
        <SolicitacoesTable
          solicitacoes={solicitacoes}
          isLoading={isLoading}
          statusFilter={statusFilter}
          onUpdate={updateSolicitacao}
          onRefresh={fetchSolicitacoes}
        />
        
        <SolicitacoesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CarteirinhaSolicitacoes;
