
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, User, Building } from 'lucide-react';

export const SugestoesTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[40px]">
          <input type="checkbox" className="rounded" />
        </TableHead>
        <TableHead className="font-semibold">NOME</TableHead>
        <TableHead className="font-semibold">
          <div className="flex items-center gap-1">
            <Phone size={16} />
            TELEFONE
          </div>
        </TableHead>
        <TableHead className="font-semibold">
          <div className="flex items-center gap-1">
            <User size={16} />
            CONTATO
          </div>
        </TableHead>
        <TableHead className="font-semibold">
          <div className="flex items-center gap-1">
            <Building size={16} />
            EMPRESA
          </div>
        </TableHead>
        <TableHead className="font-semibold">DATA DE CRIAÇÃO</TableHead>
        <TableHead className="w-[60px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};
