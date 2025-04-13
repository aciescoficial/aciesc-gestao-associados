
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { RefreshCw } from 'lucide-react';
import AssociadoTableRow from './AssociadoTableRow';
import { AssociadoListItem } from '../hooks/useAssociadosList';

interface AssociadosTableProps {
  associados: AssociadoListItem[];
  loading: boolean;
}

const AssociadosTable: React.FC<AssociadosTableProps> = ({ associados, loading }) => {
  return (
    <div className="rounded-md border overflow-auto max-h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>CRECI</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              </TableCell>
            </TableRow>
          ) : associados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Nenhum associado encontrado.
              </TableCell>
            </TableRow>
          ) : (
            associados.map((associado) => (
              <AssociadoTableRow key={associado.id} associado={associado} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssociadosTable;
