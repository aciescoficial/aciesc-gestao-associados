
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SugestaoEmpresa } from '../types';
import { formatDate, getStatusBadge } from '../utils';

interface SugestaoRowProps {
  sugestao: SugestaoEmpresa;
  onStatusUpdate?: (id: string, status: string) => Promise<void>;
}

export const SugestaoRow: React.FC<SugestaoRowProps> = ({ sugestao, onStatusUpdate }) => {
  const initial = sugestao.nome_empresa.charAt(0);

  return (
    <TableRow key={sugestao.id} className="hover:bg-gray-50">
      <TableCell>
        <input type="checkbox" className="rounded" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-800 font-semibold">{initial}</span>
          </div>
          <div>
            <div className="font-medium text-blue-600">{sugestao.nome_empresa}</div>
            <div>{getStatusBadge(sugestao.status)}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{sugestao.telefone}</TableCell>
      <TableCell>{sugestao.contato}</TableCell>
      <TableCell>{sugestao.nome_empresa}</TableCell>
      <TableCell>{formatDate(sugestao.created_at)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Opções">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {onStatusUpdate && (
              <>
                <DropdownMenuItem onClick={() => onStatusUpdate(sugestao.id, 'em_progresso')}>
                  Marcar Em Progresso
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusUpdate(sugestao.id, 'ganho')}>
                  Marcar como Ganho
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusUpdate(sugestao.id, 'cancelado')}>
                  Marcar como Cancelado
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
