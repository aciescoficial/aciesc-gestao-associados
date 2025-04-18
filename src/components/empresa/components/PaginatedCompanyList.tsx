import React from 'react';
import { EmpresaData } from '../types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { SearchForm } from './paginated-list/SearchForm';
import { CompanyTable } from './paginated-list/CompanyTable';
import { PaginationControls } from './paginated-list/PaginationControls';

interface PaginatedCompanyListProps {
  onLocateEmpresa?: (empresa: EmpresaData) => void;
}

const PaginatedCompanyList: React.FC<PaginatedCompanyListProps> = ({ onLocateEmpresa }) => {
  const [companies, setCompanies] = React.useState<EmpresaData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchCompanies = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await empresaCrudService.getCompaniesPaginated(currentPage, pageSize, {
        searchTerm: searchTerm
      });
      
      setCompanies(data);
      setTotalCount(count);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar as empresas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  React.useEffect(() => {
    fetchCompanies();
  }, [currentPage, pageSize]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCompanies();
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner text="Carregando empresas..." />
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center border rounded-md">
        <p className="text-muted-foreground">Nenhuma empresa encontrada</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      <SearchForm
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        pageSize={pageSize}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setCurrentPage(1);
        }}
        onSubmit={handleSearch}
      />

      <CompanyTable
        companies={companies}
        onLocateEmpresa={onLocateEmpresa}
      />

      {totalPages > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsCount={companies.length}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default PaginatedCompanyList;
