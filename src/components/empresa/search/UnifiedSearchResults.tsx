
import React from 'react';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { CompanySearchForm } from '../components/search/CompanySearchForm';
import { PaginatedCompanyList } from '../components/PaginatedCompanyList';
import { useUnifiedCompanySearch } from '@/hooks/useUnifiedCompanySearch';
import type { CompanySearchFormValues } from '../components/search/schema';

interface UnifiedSearchResultsProps {
  title?: string;
  pageSize?: number;
}

export const UnifiedSearchResults: React.FC<UnifiedSearchResultsProps> = ({
  title = "Resultados da Pesquisa",
  pageSize = 10
}) => {
  const { 
    isLoading, 
    results, 
    totalCount,
    currentPage,
    searchCompanies
  } = useUnifiedCompanySearch({ pageSize });

  const handleSearch = (params: CompanySearchFormValues) => {
    searchCompanies(params, 1);
  };

  const handlePageChange = (page: number) => {
    searchCompanies({ searchTerm: '', searchType: 'nome', status: 'todos' }, page);
  };

  return (
    <Card className="p-6 space-y-6">
      <CompanySearchForm 
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      
      {isLoading && !results.length ? (
        <LoadingSpinner size="large" centered />
      ) : (
        <div className="mt-6">
          <PaginatedCompanyList 
            initialData={results}
            searchable={false}
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / pageSize)}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Card>
  );
};
