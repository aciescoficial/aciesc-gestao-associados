
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface PendingHeaderProps {
  pendingCount: number;
  statusFilter: 'pendente' | 'ativo' | 'inativo' | 'todos';
}

export const PendingHeader: React.FC<PendingHeaderProps> = ({ pendingCount, statusFilter }) => {
  const getHeaderText = () => {
    switch (statusFilter) {
      case 'pendente':
        return `${pendingCount} ${pendingCount === 1 ? 'Item' : 'Itens'} pendentes para aprovação`;
      case 'ativo':
        return `${pendingCount} ${pendingCount === 1 ? 'Item aprovado' : 'Itens aprovados'}`;
      case 'inativo':
        return `${pendingCount} ${pendingCount === 1 ? 'Item rejeitado' : 'Itens rejeitados'}`;
      case 'todos':
        return `${pendingCount} ${pendingCount === 1 ? 'Item' : 'Itens'} no total`;
      default:
        return `${pendingCount} ${pendingCount === 1 ? 'Item' : 'Itens'}`;
    }
  };

  const getHeaderDescription = () => {
    switch (statusFilter) {
      case 'pendente':
        return 'Aprove ou rejeite os itens abaixo para manter o sistema atualizado.';
      case 'ativo':
        return 'Lista de itens que foram aprovados.';
      case 'inativo':
        return 'Lista de itens que foram rejeitados.';
      case 'todos':
        return 'Visualização de todos os itens, independente do status.';
      default:
        return '';
    }
  };

  return (
    <div className="px-6 py-4 border-b flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">
          {getHeaderText()}
        </h2>
        <p className="text-gray-600">
          {getHeaderDescription()}
        </p>
      </div>
    </div>
  );
};
