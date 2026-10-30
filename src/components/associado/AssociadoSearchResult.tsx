
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, User } from 'lucide-react';
import AssociadoPagination from './AssociadoPagination';
import EmptySearchResults from './EmptySearchResults';
import { Associado } from './types';
import { useNavigate } from 'react-router-dom';
import { useAdminPermission } from '@/hooks/use-admin-permission';

interface AssociadoSearchResultProps {
  results: Associado[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
  itemsPerPage: number;
  isSearching: boolean;
}

const AssociadoSearchResult: React.FC<AssociadoSearchResultProps> = ({ 
  results, 
  currentPage, 
  setCurrentPage, 
  totalCount, 
  itemsPerPage,
  isSearching 
}) => {
  const navigate = useNavigate();
  const { isAdmin } = useAdminPermission();

  if (isSearching || results.length === 0) {
    return <EmptySearchResults isSearching={isSearching} />;
  }

  const handleViewAssociado = (id: string) => {
    navigate(`/associados/visualizar/${id}`);
  };

  const handleEditAssociado = (id: string) => {
    navigate(`/associados/editar/${id}`);
  };

  const handleUserManagement = (id: string) => {
    navigate(`/associados/usuario/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Completo</TableHead>
              <TableHead className="hidden md:table-cell">CPF</TableHead>
              <TableHead className="hidden sm:table-cell">CRECI</TableHead>
              <TableHead className="hidden lg:table-cell">Telefone</TableHead>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((associado) => (
              <TableRow key={associado.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {associado.nome} {associado.sobrenome}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {associado.cpf}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {associado.creci || '-'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {associado.telefone}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {associado.email}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      title="Ver detalhes"
                      onClick={() => handleViewAssociado(associado.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button 
                        size="sm"
                        variant="default"
                        title="Editar"
                        onClick={() => handleEditAssociado(associado.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm"
                      variant="outline"
                      title="Gerenciar usuário"
                      onClick={() => handleUserManagement(associado.id)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AssociadoPagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default AssociadoSearchResult;
