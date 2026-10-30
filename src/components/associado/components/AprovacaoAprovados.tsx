
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, RefreshCw, ExternalLink } from 'lucide-react';

interface AssociadoInteresse {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  creci: string;
  celular: string;
  created_at: string;
  pagamento_url: string | null;
  pagamento_confirmado: boolean;
}

const AprovacaoAprovados: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [interessados, setInteressados] = useState<AssociadoInteresse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'nome' | 'email'>('nome');
  const [paymentFilter, setPaymentFilter] = useState<'todos' | 'pendente' | 'confirmado'>('pendente');

  const fetchInteressados = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('associado_interesse')
        .select('*')
        .eq('status', 'aprovado')
        .order('created_at', { ascending: false });

      if (paymentFilter === 'pendente') {
        query = query.eq('pagamento_confirmado', false);
      } else if (paymentFilter === 'confirmado') {
        query = query.eq('pagamento_confirmado', true);
      }

      if (searchTerm) {
        if (searchField === 'nome') {
          query = query.or(`nome.ilike.%${searchTerm}%,sobrenome.ilike.%${searchTerm}%`);
        } else {
          query = query.ilike('email', `%${searchTerm}%`);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setInteressados(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar interessados:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (id: string, paymentUrl: string | null) => {
    if (!paymentUrl) return;
    
    try {
      // Extrair o ID do pagamento da URL (isso depende do formato da URL)
      const paymentId = paymentUrl.split('/').pop();
      
      if (!paymentId) return;
      
      const { data, error } = await supabase.functions.invoke('asaas-payment-check', {
        body: { paymentId }
      });
      
      if (error) throw error;
      
      if (data?.isPaid) {
        // Atualizar o status do pagamento no banco de dados
        await supabase
          .from('associado_interesse')
          .update({ 
            pagamento_confirmado: true,
            pagamento_data: new Date().toISOString()
          })
          .eq('id', id);
          
        // Atualizar a lista local
        fetchInteressados();
      }
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInteressados();
  };

  useEffect(() => {
    fetchInteressados();
  }, [paymentFilter]);

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Pagamentos de Associados</h2>
        <div className="flex items-center gap-2">
          <Select 
            defaultValue={paymentFilter} 
            onValueChange={(value) => setPaymentFilter(value as 'todos' | 'pendente' | 'confirmado')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pagamento Pendente</SelectItem>
              <SelectItem value="confirmado">Pagamento Confirmado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={fetchInteressados} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar associados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          defaultValue={searchField}
          onValueChange={(value) => setSearchField(value as 'nome' | 'email')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Campo de busca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : interessados.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CRECI</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interessados.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{`${item.nome} ${item.sobrenome}`}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.creci}</TableCell>
                  <TableCell>{item.celular}</TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {item.pagamento_confirmado ? (
                      <Badge variant="success" className="bg-green-500">Confirmado</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.pagamento_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.pagamento_url} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Link
                        </a>
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {!item.pagamento_confirmado && item.pagamento_url && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => checkPaymentStatus(item.id, item.pagamento_url)}
                      >
                        Verificar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default AprovacaoAprovados;
