
import React from 'react';
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompanyListProps } from '../types/MapTypes';
import { nichoColors } from '../constants/colorScheme';

/**
 * List of visible companies displayed below the map
 */
const CompanyList: React.FC<CompanyListProps> = ({ 
  visibleCompanies, 
  setSelectedCompany 
}) => {
  if (visibleCompanies.length === 0) {
    return null;
  }
  
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <List className="h-4 w-4" />
          Empresas Visíveis no Mapa
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {visibleCompanies.slice(0, 6).map(company => {
          const nichoColor = nichoColors[company.nicho as string] || '#9E9E9E';
          
          return (
            <div 
              key={company.id} 
              className="flex items-center p-2 rounded-md hover:bg-gray-50 border cursor-pointer"
              onClick={() => setSelectedCompany(company)}
            >
              <div 
                className="w-2 h-10 mr-2 rounded-sm" 
                style={{ backgroundColor: nichoColor }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{company.nome_fantasia}</p>
                <p className="text-xs text-gray-500 truncate">{company.endereco}</p>
              </div>
            </div>
          );
        })}
        
        {visibleCompanies.length > 6 && (
          <div className="md:col-span-3 text-center mt-2">
            <Button variant="link" size="sm">
              Ver todas as {visibleCompanies.length} empresas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
