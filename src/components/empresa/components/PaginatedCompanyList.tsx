
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
}

export const PaginatedCompanyList: React.FC<PaginatedCompanyListProps> = ({
  searchable = true,
  initialSearchTerm = '',
  onCompanySelected,
  title = 'Empresas'
}) => {
  const [companies, setCompanies] = useState<EmpresaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const { toast } = useToast();
  const pageSize = 10;

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchTerm]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, count } = await empresaService.getCompaniesPaginated(
        currentPage,
        pageSize,
        { searchTerm }
      );
      
      setCompanies(data);
      setTotalCount(count);
      setTotalPages(Math.ceil(count / pageSize));
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
    setCurrentPage(1);
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
        onPageChange={setCurrentPage}
        totalCount={totalCount}
        itemsCount={companies.length}
        itemName="empresas"
      />
    </Card>
  );
};
