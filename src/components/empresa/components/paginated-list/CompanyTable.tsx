
import React from 'react';
import { MapPin, Eye, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmpresaData } from '../../types';
import { StatusBadge } from './StatusBadge';

export interface CompanyTableProps {
  companies?: EmpresaData[];
  empresas?: EmpresaData[];
  onLocateEmpresa?: (empresa: EmpresaData) => void;
  onDelete?: (id: string) => Promise<void>;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({ 
  companies, 
  empresas,
  onLocateEmpresa,
  onDelete 
}) => {
  // Use either companies or empresas prop
  const displayData = companies || empresas || [];

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Nicho</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.nome_fantasia}</TableCell>
                <TableCell>{company.razao_social}</TableCell>
                <TableCell>{company.cnpj}</TableCell>
                <TableCell>{company.cidade}</TableCell>
                <TableCell>{company.nicho}</TableCell>
                <TableCell><StatusBadge status={company.status} /></TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {onLocateEmpresa && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onLocateEmpresa(company)}
                        title="Ver no mapa"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      title="Ver detalhes"
                      asChild
                    >
                      <Link to={`/empresas/detalhes/${company.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      title="Editar empresa"
                      asChild
                    >
                      <Link to={`/empresas/editar/${company.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {onDelete && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => onDelete(company.id)}
                        title="Excluir empresa"
                      >
                        <span className="h-4 w-4">×</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
