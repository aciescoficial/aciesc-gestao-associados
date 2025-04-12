
import React from 'react';
import { Check, X } from 'lucide-react';
import { StatusType } from './types';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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

export default StatusBadge;
