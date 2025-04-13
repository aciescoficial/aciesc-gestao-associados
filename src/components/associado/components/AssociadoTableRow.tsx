
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { AssociadoListItem } from '../hooks/useAssociadosList';

interface AssociadoTableRowProps {
  associado: AssociadoListItem;
}

const AssociadoTableRow: React.FC<AssociadoTableRowProps> = ({ associado }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><UserCheck className="h-3 w-3 mr-1" />Ativo</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'inativo':
        return <Badge variant="destructive"><UserX className="h-3 w-3 mr-1" />Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {associado.nome} {associado.sobrenome}
      </TableCell>
      <TableCell>{associado.cpf}</TableCell>
      <TableCell>{associado.cidade}</TableCell>
      <TableCell>{associado.creci || "-"}</TableCell>
      <TableCell className="text-sm">
        <div>{associado.email}</div>
        <div>{associado.telefone}</div>
      </TableCell>
      <TableCell>{getStatusBadge(associado.status)}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">Ver</Button>
          <Button size="sm" variant="default">Editar</Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AssociadoTableRow;
