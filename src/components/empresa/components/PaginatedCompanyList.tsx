
import React, { useState, useEffect } from 'react';
import { SearchForm } from './paginated-list/SearchForm';
import { CompanyTable } from './paginated-list/CompanyTable';
import { PaginationControls } from './paginated-list/PaginationControls';
import { Card } from '@/components/ui/card';
import { EmpresaData } from '../types';
import { empresaService } from '../services/empresaService';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

export interface PaginatedCompanyListProps {
  searchable?: boolean;
  initialSearchTerm?: string;
  onCompanySelected?: (company: EmpresaData) => void;
  title?: string;
  initialData?: EmpresaData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
}

export const PaginatedCompanyList: React.FC<PaginatedCompanyListProps> = ({
  searchable = true,
  initialSearchTerm = '',
  onCompanySelected,
  title = 'Empresas',
  initialData = [],
  currentPage,
  totalPages,
  onPageChange,
  totalCount = 0
}) => {
  const [companies, setCompanies] = useState<EmpresaData[]>(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  const [localTotalPages, setLocalTotalPages] = useState(totalPages);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const { toast } = useToast();
  const pageSize = 10;

  useEffect(() => {
    if (initialData.length > 0) {
      setCompanies(initialData);
      setLoading(false);
    } else {
      fetchCompanies();
    }
  }, [localCurrentPage, searchTerm]);

  useEffect(() => {
    if (initialData.length > 0) {
      setCompanies(initialData);
      setLocalTotalPages(totalPages);
    }
  }, [initialData, totalPages]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, count } = await empresaService.getCompaniesPaginated(
        localCurrentPage,
        pageSize,
        { searchTerm }
      );
      
      setCompanies(data);
      setLocalTotalPages(Math.ceil(count / pageSize));
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: 'Erro ao carregar empresas',
        description: 'Não foi possível carregar a lista de empresas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await empresaService.deleteEmpresa(id);
      toast({
        title: 'Empresa excluída',
        description: 'Empresa foi excluída com sucesso',
      });
      fetchCompanies();
    } catch (error) {
      toast({
        title: 'Erro ao excluir empresa',
        description: 'Não foi possível excluir a empresa',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setLocalCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setLocalCurrentPage(page);
    }
  };

  if (loading && companies.length === 0) {
    return <LoadingSpinner text="Carregando empresas..." />;
  }

  return (
    <Card className="p-4">
      {searchable && <SearchForm onSearch={handleSearch} />}
      <CompanyTable 
        companies={companies} 
        onDelete={handleDelete} 
        onSelect={onCompanySelected} 
      />
      <PaginationControls 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalCount={totalCount}
        itemsCount={companies.length}
        itemName="empresas"
      />
    </Card>
  );
};
