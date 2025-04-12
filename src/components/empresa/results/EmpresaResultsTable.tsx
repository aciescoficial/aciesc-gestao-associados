
import React from 'react';
import { Check, X, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Database } from '@/integrations/supabase/types';

type StatusType = Database['public']['Enums']['status_type'];

interface EmpresaData {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: string;
  status: StatusType;
  latitude?: number;
  longitude?: number;
  endereco: string;
  cep: string;
}

interface EmpresaResultsTableProps {
  results: EmpresaData[];
  locateEmpresa: (empresa: EmpresaData) => void;
  isMapEnabled: boolean;
}

const EmpresaResultsTable: React.FC<EmpresaResultsTableProps> = ({
  results,
  locateEmpresa,
  isMapEnabled
}) => {
  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'ativo':
        return <span className="wp-badge-success flex items-center gap-1"><Check size={14} />Ativo</span>;
      case 'pendente':
        return <span className="wp-badge-warning">Pendente</span>;
      case 'inativo':
        return <span className="wp-badge-error flex items-center gap-1"><X size={14} />Inativo</span>;
      default:
        return <span className="wp-badge">{status}</span>;
    }
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="wp-card">
      <h2 className="wp-subheader">Resultados da Busca</h2>
      <div className="overflow-x-auto">
        <table className="wp-table">
          <thead>
            <tr>
              <th>Nome Fantasia</th>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Nicho</th>
              <th>Cidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id}>
                <td>{item.nome_fantasia}</td>
                <td>{item.razao_social}</td>
                <td>{item.cnpj}</td>
                <td>{item.nicho}</td>
                <td>{item.cidade}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => locateEmpresa(item)}
                      disabled={!isMapEnabled}
                    >
                      <MapPin size={12} />
                      Localizar
                    </Button>
                    <Button size="sm">Editar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpresaResultsTable;
