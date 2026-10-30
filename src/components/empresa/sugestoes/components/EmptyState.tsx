
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

export const EmptyState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-8">
        Nenhuma sugestão de empresa encontrada.
      </TableCell>
    </TableRow>
  );
};
