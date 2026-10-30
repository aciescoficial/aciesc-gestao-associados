
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { PaginatedCompanyList } from '../empresa/components/PaginatedCompanyList';
import { CompanySearchForm } from '../empresa/components/search/CompanySearchForm';
import { useCompanyQuery } from '@/hooks/queries/useCompanyQuery';
import type { CompanySearchFormValues } from '../empresa/components/search/schema';

const PesquisaEmpresaRefactored: React.FC = () => {
  const [searchParams, setSearchParams] = useState<CompanySearchFormValues | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: { data: results = [], count: totalCount } = {}, isLoading } = useCompanyQuery(
    searchParams, 
    currentPage, 
    pageSize
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearch = (params: CompanySearchFormValues) => {
    setSearchParams(params);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pesquisa de Empresas" 
        description="Localize e visualize informações sobre empresas cadastradas no sistema." 
      />
      
      <Card className="p-6">
        <CompanySearchForm 
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        
        <div className="mt-6">
          <PaginatedCompanyList 
            initialData={results}
            searchable={false}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalCount={totalCount}
          />
        </div>
      </Card>
    </div>
  );
};

export default PesquisaEmpresaRefactored;
