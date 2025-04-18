import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SearchForm } from './paginated-list/SearchForm';
import { CompanyTable } from './paginated-list/CompanyTable';
import { PaginationControls } from './paginated-list/PaginationControls';
import { empresaService } from '../services/empresaService';
import type { EmpresaData } from '../types';

interface PaginatedCompanyListProps {
  initialData: EmpresaData[];
  itemsPerPage?: number;
}

export const PaginatedCompanyList: React.FC<PaginatedCompanyListProps> = ({ initialData, itemsPerPage = 10 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<EmpresaData[]>(initialData);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchedData = await empresaService.getAllEmpresas();
      setData(fetchedData);
    } catch (error) {
      console.error("Failed to fetch empresas:", error);
      toast({
        title: "Erro ao carregar empresas",
        description: "Falha ao carregar a lista de empresas. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const filteredData = searchTerm
    ? data.filter(item =>
        item.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.razao_social.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    try {
      await empresaService.deleteEmpresa(id);
      toast({
        title: "Empresa removida com sucesso",
        description: "A empresa foi removida do sistema."
      });
      // Reload data after delete
      fetchData();
    } catch (error: any) {
      console.error("Error deleting empresa:", error);
      toast({
        title: "Erro ao remover empresa",
        description: error.message || "Ocorreu um erro ao remover a empresa.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <SearchForm onSearch={handleSearch} />
      <CompanyTable empresas={currentItems} onDelete={handleDelete} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
