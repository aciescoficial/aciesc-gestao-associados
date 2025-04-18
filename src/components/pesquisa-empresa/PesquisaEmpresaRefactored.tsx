
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { PaginatedCompanyList } from '../empresa/components/PaginatedCompanyList';

const PesquisaEmpresaRefactored: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pesquisa de Empresas" 
        description="Localize e visualize informações sobre empresas cadastradas no sistema." 
      />
      
      <Card className="p-6">
        <PaginatedCompanyList />
      </Card>
    </div>
  );
};

export default PesquisaEmpresaRefactored;
