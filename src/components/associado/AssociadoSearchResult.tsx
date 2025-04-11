
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserCheck, UserX, Clock, MapPin } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export type AssociadoStatus = 'pendente' | 'ativo' | 'inativo';

export interface Associado {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  telefone: string;
  cidade: string;
  creci?: string;
  status: AssociadoStatus;
  avatar_url?: string;
}

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
  const getStatusBadge = (status: AssociadoStatus) => {
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

  if (isSearching) {
    return (
      <div className="mt-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Buscando associados...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="mt-8">
        <div className="text-center p-12 text-gray-500">
          Use os filtros acima para buscar associados
        </div>
      </div>
    );
  }

  // Calculate total pages
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Resultados da Busca</h2>
        <span className="text-sm text-gray-500">
          Mostrando {results.length} de {totalCount} associados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((associado) => (
          <Card key={associado.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3"></div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-24 h-24 rounded overflow-hidden border-2 border-gray-200">
                  {associado.avatar_url ? (
                    <img 
                      src={associado.avatar_url} 
                      alt={`${associado.nome}`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      Sem foto
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {associado.nome} {associado.sobrenome}
                    </h3>
                    <div className="ml-2">
                      {getStatusBadge(associado.status)}
                    </div>
                  </div>
                  
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">CPF:</span> {associado.cpf}
                    </p>
                    {associado.creci && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">CRECI:</span> {associado.creci}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin size={14} className="mr-1" />
                      {associado.cidade}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs">Ver Detalhes</Button>
                    <Button size="sm" variant="default" className="text-xs">Gerar Carteirinha</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic for showing pages around current page
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                
                if (pageNum <= 0) return null;
                if (pageNum > totalPages) return null;
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AssociadoSearchResult;
