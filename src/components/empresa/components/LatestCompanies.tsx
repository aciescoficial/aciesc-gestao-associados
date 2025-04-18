
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmpresaData } from '../types';
import { LoadingState } from './latest-companies/LoadingState';
import { EmptyState } from './latest-companies/EmptyState';
import { CompanyListItem } from './latest-companies/CompanyListItem';
import { useLatestCompanies } from '../hooks/useLatestCompanies';

interface LatestCompaniesProps {
  onLocateEmpresa?: (empresa: EmpresaData) => void;
}

const LatestCompanies: React.FC<LatestCompaniesProps> = ({ onLocateEmpresa }) => {
  const { companies, loading } = useLatestCompanies(3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Empresas Cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState />
        ) : companies.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {companies.map(company => (
              <CompanyListItem 
                key={company.id}
                company={company}
                onLocate={onLocateEmpresa}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestCompanies;
