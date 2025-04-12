
import React, { useEffect, useState } from 'react';
import { Plus, Download, Search, Calendar, Building, User, Phone, Mail, ExternalLink, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

// Mock data for testing
const mockSugestoes = [
  {
    id: '1',
    nome: 'Café & Tal',
    email: 'contato@cafetal.com.br',
    telefone: '(48) 99999-8888',
    contato: 'Ana Silva',
    empresa: 'Café & Tal',
    status: 'novo',
    data_criacao: '2025-04-01T10:30:00Z'
  },
  {
    id: '2',
    nome: 'Tech Solutions',
    email: 'info@techsolutions.com.br',
    telefone: '(48) 98765-4321',
    contato: 'Roberto Mendes',
    empresa: 'Tech Solutions',
    status: 'cancelado',
    data_criacao: '2025-03-28T14:15:00Z'
  },
  {
    id: '3',
    nome: 'Moda Express',
    email: 'contato@modaexpress.com.br',
    telefone: '(48) 99988-7766',
    contato: 'Carla Rodrigues',
    empresa: 'Moda Express',
    status: 'em_progresso',
    data_criacao: '2025-03-15T09:45:00Z'
  },
  {
    id: '4',
    nome: 'Fitness Center',
    email: 'contato@fitnesscenter.com.br',
    telefone: '(48) 97777-6666',
    contato: 'Paulo Oliveira',
    empresa: 'Fitness Center',
    status: 'frio',
    data_criacao: '2025-03-10T16:20:00Z'
  },
  {
    id: '5',
    nome: 'Bella Casa Decorações',
    email: 'vendas@bellacasa.com.br',
    telefone: '(48) 96666-5555',
    contato: 'Márcia Santos',
    empresa: 'Bella Casa',
    status: 'ganho',
    data_criacao: '2025-03-05T11:30:00Z'
  },
  {
    id: '6',
    nome: 'DataTech Soluções',
    email: 'contato@datatech.com.br',
    telefone: '(48) 95555-4444',
    contato: 'Felipe Costa',
    empresa: 'DataTech',
    status: 'novo',
    data_criacao: '2025-03-01T08:15:00Z'
  }
];

interface SugestaoEmpresa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  contato: string;
  empresa: string;
  status: string;
  data_criacao: string;
}

const EmpresaSugestoes: React.FC = () => {
  const [sugestoes, setSugestoes] = useState<SugestaoEmpresa[]>([]);
  const [filteredSugestoes, setFilteredSugestoes] = useState<SugestaoEmpresa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const itemsPerPage = 5;

  useEffect(() => {
    // In a real scenario, fetch data from an API
    setSugestoes(mockSugestoes);
    setFilteredSugestoes(mockSugestoes);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sugestoes.filter(
        (sugestao) =>
          sugestao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sugestao.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sugestao.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sugestao.contato.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSugestoes(filtered);
      setCurrentPage(1);
    } else {
      setFilteredSugestoes(sugestoes);
    }
  }, [searchTerm, sugestoes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novo':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Novo</Badge>;
      case 'em_progresso':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Em progresso</Badge>;
      case 'ganho':
        return <Badge className="bg-green-500 hover:bg-green-600">Aprovado</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
      case 'frio':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Frio</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSugestoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSugestoes.length / itemsPerPage);

  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <PaginationLink 
          isActive={i === currentPage} 
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">{filteredSugestoes.length} Sugestões de Empresas</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Criar Sugestão
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
        <div className="flex w-full lg:w-auto space-x-3">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nome, email, empresa..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="relative w-full lg:w-64">
            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="date"
              className="pl-8"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead className="font-semibold">NOME</TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-1">
                      <Mail size={16} />
                      EMAIL
                    </div>
                  </TableHead>
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
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Nenhuma sugestão de empresa encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((sugestao) => (
                    <TableRow key={sugestao.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 font-semibold">
                              {sugestao.nome.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-blue-600">{sugestao.nome}</div>
                            <div>{getStatusBadge(sugestao.status)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{sugestao.email}</TableCell>
                      <TableCell>{sugestao.telefone}</TableCell>
                      <TableCell>{sugestao.contato}</TableCell>
                      <TableCell>{sugestao.empresa}</TableCell>
                      <TableCell>{formatDate(sugestao.data_criacao)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Opções">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <span className="mr-2">🗑️</span>
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredSugestoes.length > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {paginationItems}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default EmpresaSugestoes;
