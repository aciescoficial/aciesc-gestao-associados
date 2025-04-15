
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Building, MapPin, Tag, External, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmpresaConveniada, listarEmpresasConveniadas } from './services/empresasService';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const EmpresasConveniadas: React.FC = () => {
  const [empresas, setEmpresas] = useState<EmpresaConveniada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroNicho, setFiltroNicho] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  
  // Nichos para filtro
  const nichos = ['Alimentação', 'Saúde', 'Educação', 'Vestuário', 'Automotivo', 'Serviços'];
  
  // Dados de exemplo para usar como fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  useEffect(() => {
    loadEmpresas();
  }, [currentPage, filtroNicho]);
  
  const loadEmpresas = async () => {
    setIsLoading(true);
    try {
      const response = await listarEmpresasConveniadas(currentPage, itemsPerPage);
      setEmpresas(response.dados);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtro de empresas
  const filteredEmpresas = empresas.filter(empresa => 
    (searchTerm === '' || 
      empresa.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.desconto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.cidade.toLowerCase().includes(searchTerm.toLowerCase())
    ) && 
    (filtroNicho === 'todos' || empresa.nicho === filtroNicho)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadEmpresas();
  };

  // Gerar componentes de paginação
  const renderPagination = () => {
    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            let pageNum: number;
            
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                  className="cursor-pointer"
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
                <PaginationLink
                  onClick={() => setCurrentPage(totalPages)}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Empresas Conveniadas</h1>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <Input
                placeholder="Buscar por nome, desconto, cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search size={18} className="mr-2" />
                Buscar
              </Button>
            </form>
            
            <Select value={filtroNicho} onValueChange={setFiltroNicho}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por nicho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os nichos</SelectItem>
                {nichos.map(nicho => (
                  <SelectItem key={nicho} value={nicho}>{nicho}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="cards">Cartões</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cards">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEmpresas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEmpresas.map((empresa) => (
                    <div key={empresa.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={empresa.logo_url} alt={empresa.nome_fantasia} />
                          <AvatarFallback className="bg-aciesc-primary text-white">
                            {getInitials(empresa.nome_fantasia)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                          <h3 className="font-medium text-base">{empresa.nome_fantasia}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Tag size={14} className="mr-1" />
                            <span className="font-semibold text-green-600">{empresa.desconto} de desconto</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin size={14} className="mr-1" />
                            <span>{empresa.cidade}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone size={14} className="mr-1" />
                            <span>Contato via app</span>
                            <Button size="sm" variant="link" className="p-0 h-auto ml-2">
                              <External size={12} className="mr-1" />
                              Saiba mais
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building size={40} className="mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-medium text-lg">Nenhuma empresa encontrada</h3>
                  <p className="text-muted-foreground">
                    Não encontramos empresas para os filtros selecionados.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list">
              {isLoading ? (
                <div className="space-y-2">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-3 w-1/5" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEmpresas.length > 0 ? (
                <div className="space-y-2">
                  {filteredEmpresas.map((empresa) => (
                    <div key={empresa.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={empresa.logo_url} alt={empresa.nome_fantasia} />
                          <AvatarFallback className="bg-aciesc-primary text-white text-xs">
                            {getInitials(empresa.nome_fantasia)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{empresa.nome_fantasia}</h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Tag size={12} className="mr-1" />
                            <span className="font-semibold text-green-600 mr-2">{empresa.desconto}</span>
                            <MapPin size={12} className="mr-1" />
                            <span>{empresa.cidade}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0">
                          <External size={14} className="mr-1" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building size={40} className="mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-medium text-lg">Nenhuma empresa encontrada</h3>
                  <p className="text-muted-foreground">
                    Não encontramos empresas para os filtros selecionados.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {!isLoading && totalPages > 1 && renderPagination()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmpresasConveniadas;
