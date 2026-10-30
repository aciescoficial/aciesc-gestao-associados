
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { SugestaoEmpresa } from './types';
import { SugestoesTableHeader } from './components/SugestoesTableHeader';
import { SugestaoRow } from './components/SugestaoRow';
import { EmptyState } from './components/EmptyState';

interface SugestoesTableProps {
  currentItems: SugestaoEmpresa[];
  onStatusUpdate?: (id: string, status: string) => Promise<void>;
}

const SugestoesTable: React.FC<SugestoesTableProps> = ({ currentItems, onStatusUpdate }) => {
  return (
    <Table>
      <SugestoesTableHeader />
      <TableBody>
        {currentItems.length === 0 ? (
          <EmptyState />
        ) : (
          currentItems.map((sugestao) => (
            <SugestaoRow 
              key={sugestao.id} 
              sugestao={sugestao} 
              onStatusUpdate={onStatusUpdate} 
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SugestoesTable;
