
import React, { useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { PaginatedCompanyList } from '../empresa/components/PaginatedCompanyList';
import { CompanySearchForm } from '../empresa/components/search/CompanySearchForm';
import { useCompanySearchUnified } from '@/hooks/useCompanySearchUnified';

const PesquisaEmpresaRefactored: React.FC = () => {
  const { isLoading, results, searchCompanies, resetResults } = useCompanySearchUnified();

  // Reset results when component unmounts
  useEffect(() => {
    return () => {
      resetResults();
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pesquisa de Empresas" 
        description="Localize e visualize informações sobre empresas cadastradas no sistema." 
      />
      
      <Card className="p-6">
        <CompanySearchForm 
          onSearch={searchCompanies}
          isLoading={isLoading}
        />
        
        <div className="mt-6">
          <PaginatedCompanyList 
            initialData={results}
            searchable={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default PesquisaEmpresaRefactored;
