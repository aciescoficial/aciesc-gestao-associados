
import React from 'react';
import { PendenteData } from '../types';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PendingTableProps {
  pendentes: PendenteData[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  getTipoBadge: (tipo: string) => React.ReactNode;
  statusFilter: 'pendente' | 'ativo' | 'inativo' | 'todos';
}

export const PendingTable: React.FC<PendingTableProps> = ({
  pendentes,
  onApprove,
  onReject,
  getTipoBadge,
  statusFilter
}) => {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ativo':
      case 'aprovado':
        return <Badge variant="success">Aprovado</Badge>;
      case 'inativo':
        return <Badge variant="destructive">Rejeitado</Badge>;
      case 'pendente':
        return <Badge variant="warning">Pendente</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contato
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pendentes.map((pendente) => (
            <tr key={pendente.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {getTipoBadge(pendente.tipo)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">{pendente.nome}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{pendente.documento}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">
                  {formatDate(pendente.dataCadastro || '')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(pendente.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">{pendente.email}</div>
                <div className="text-sm text-gray-500">{pendente.telefone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {pendente.status === 'pendente' && (
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => onApprove(pendente.id)}
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-800 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => onReject(pendente.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                )}
                
                {pendente.status === 'ativo' && (
                  <Button
                    onClick={() => onReject(pendente.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                )}
                
                {pendente.status === 'inativo' && (
                  <Button
                    onClick={() => onApprove(pendente.id)}
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-800 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
