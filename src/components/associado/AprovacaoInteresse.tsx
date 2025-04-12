
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, FileText, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { generatePaymentLink } from '../financeiro/services/asaasService';

interface InteresseData {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci?: string;
  email: string;
  celular: string;
  cidade: string;
  estado: string;
  motivo_interesse: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  created_at: string;
  pagamento_url?: string;
}

const AprovacaoInteresse: React.FC = () => {
  const [interessados, setInteressados] = useState<InteresseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);
  const [tiposAssociacao, setTiposAssociacao] = useState<any[]>([]);
  const [selectedInteresse, setSelectedInteresse] = useState<InteresseData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTipoId, setSelectedTipoId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Buscar interessados
  useEffect(() => {
    const fetchInteressados = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('associado_interesse')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setInteressados(data || []);
        
        // Buscar tipos de associação
        const { data: tiposData, error: tiposError } = await supabase
          .from('association_types')
          .select('*')
          .eq('active', true);
          
        if (tiposError) throw tiposError;
        setTiposAssociacao(tiposData || []);
        
      } catch (error: any) {
        console.error('Erro ao buscar interessados:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: error.message || 'Ocorreu um erro ao buscar os dados',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInteressados();
  }, [toast]);
  
  const handleVerDetalhes = (interesse: InteresseData) => {
    setSelectedInteresse(interesse);
    setDialogOpen(true);
  };
  
  const handleRejeitar = async (id: string) => {
    setProcessando(id);
    try {
      const { error } = await supabase
        .from('associado_interesse')
        .update({ status: 'rejeitado' })
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualizar lista
      setInteressados(interessados.map(item => 
        item.id === id ? { ...item, status: 'rejeitado' } : item
      ));
      
      toast({
        title: 'Interesse rejeitado',
        description: 'O interesse foi rejeitado com sucesso',
      });
      
    } catch (error: any) {
      console.error('Erro ao rejeitar interesse:', error);
      toast({
        title: 'Erro ao rejeitar',
        description: error.message || 'Ocorreu um erro ao rejeitar o interesse',
        variant: 'destructive'
      });
    } finally {
      setProcessando(null);
    }
  };
  
  const handleAprovar = async () => {
    if (!selectedInteresse || !selectedTipoId) return;
    
    setProcessando(selectedInteresse.id);
    try {
      // Buscar tipo de associação
      const tipoAssociacao = tiposAssociacao.find(tipo => tipo.id === selectedTipoId);
      
      if (!tipoAssociacao) {
        throw new Error('Tipo de associação não encontrado');
      }
      
      // Gerar link de pagamento
      const paymentUrl = await generatePaymentLink(tipoAssociacao);
      
      // Atualizar registro de interesse
      const { error } = await supabase
        .from('associado_interesse')
        .update({ 
          status: 'aprovado',
          pagamento_url: paymentUrl
        })
        .eq('id', selectedInteresse.id);
      
      if (error) throw error;
      
      // Atualizar lista local
      setInteressados(interessados.map(item => 
        item.id === selectedInteresse.id ? 
          { ...item, status: 'aprovado', pagamento_url: paymentUrl } : 
          item
      ));
      
      // Fechar diálogo
      setDialogOpen(false);
      
      // Enviar e-mail (será implementado com um edge function)
      await enviarEmailAprovacao(selectedInteresse.email, selectedInteresse.nome, paymentUrl);
      
      toast({
        title: 'Interesse aprovado',
        description: 'O link de pagamento foi gerado e enviado por e-mail',
      });
      
    } catch (error: any) {
      console.error('Erro ao aprovar interesse:', error);
      toast({
        title: 'Erro ao aprovar',
        description: error.message || 'Ocorreu um erro ao aprovar o interesse',
        variant: 'destructive'
      });
    } finally {
      setProcessando(null);
    }
  };
  
  // Função que será implementada com um edge function posteriormente
  const enviarEmailAprovacao = async (email: string, nome: string, linkPagamento: string) => {
    // Simulação - será substituída pela chamada ao edge function
    console.log(`Enviando email para ${email} com link de pagamento: ${linkPagamento}`);
    // A implementação real usará o edge function com um template configurável
    return true;
  };
  
  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };
  
  return (
    <>
      <div className="wp-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="wp-subheader mb-0">Solicitações de Interesse</h2>
          {loading ? (
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          ) : (
            <span className="wp-badge bg-blue-100 text-blue-800">
              {interessados.filter(i => i.status === 'pendente').length} pendentes
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 size={30} className="animate-spin text-muted-foreground" />
          </div>
        ) : interessados.length === 0 ? (
          <div className="wp-notice-success">
            <p className="font-medium">Nenhuma solicitação!</p>
            <p>Não há solicitações de interesse no momento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="wp-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Cidade/UF</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {interessados.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome} {item.sobrenome}</td>
                    <td>{item.cpf}</td>
                    <td>{item.email}</td>
                    <td>{item.celular}</td>
                    <td>{item.cidade}/{item.estado}</td>
                    <td>{formatarData(item.created_at)}</td>
                    <td>
                      {item.status === 'pendente' && (
                        <span className="wp-badge bg-yellow-100 text-yellow-800">Pendente</span>
                      )}
                      {item.status === 'aprovado' && (
                        <span className="wp-badge bg-green-100 text-green-800">Aprovado</span>
                      )}
                      {item.status === 'rejeitado' && (
                        <span className="wp-badge bg-red-100 text-red-800">Rejeitado</span>
                      )}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleVerDetalhes(item)}
                          title="Ver detalhes"
                        >
                          <FileText size={18} />
                        </Button>
                        
                        {item.status === 'pendente' ? (
                          <>
                            <Button
                              size="icon"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleVerDetalhes(item)}
                              disabled={!!processando}
                              title="Aprovar"
                            >
                              {processando === item.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Check size={18} />
                              )}
                            </Button>
                            
                            <Button
                              size="icon"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleRejeitar(item.id)}
                              disabled={!!processando}
                              title="Rejeitar"
                            >
                              {processando === item.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <X size={18} />
                              )}
                            </Button>
                          </>
                        ) : item.status === 'aprovado' && item.pagamento_url ? (
                          <Button
                            size="icon"
                            variant="outline"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            onClick={() => window.open(item.pagamento_url, '_blank')}
                            title="Link de pagamento"
                          >
                            <ExternalLink size={18} />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Diálogo de detalhes */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
          </DialogHeader>
          
          {selectedInteresse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome completo</p>
                  <p className="font-medium">{selectedInteresse.nome} {selectedInteresse.sobrenome}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{selectedInteresse.cpf}</p>
                </div>
                
                {selectedInteresse.creci && (
                  <div>
                    <p className="text-sm text-muted-foreground">CRECI</p>
                    <p className="font-medium">{selectedInteresse.creci}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedInteresse.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{selectedInteresse.celular}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="font-medium">{selectedInteresse.cidade}/{selectedInteresse.estado}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Motivo do interesse</p>
                <p className="mt-1 border rounded p-2 text-sm">{selectedInteresse.motivo_interesse}</p>
              </div>
              
              {selectedInteresse.status === 'pendente' && (
                <div>
                  <p className="text-sm font-medium mb-2">Tipo de Associação</p>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedTipoId || ''}
                    onChange={(e) => setSelectedTipoId(e.target.value || null)}
                  >
                    <option value="">Selecione um tipo</option>
                    {tiposAssociacao.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.title} - R$ {tipo.value.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {selectedInteresse.pagamento_url && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Link de pagamento</p>
                  <a 
                    href={selectedInteresse.pagamento_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    <ExternalLink size={14} /> Acessar link de pagamento
                  </a>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {selectedInteresse?.status === 'pendente' && (
              <div className="flex gap-2 w-full sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="button"
                  onClick={handleAprovar}
                  disabled={!selectedTipoId || !!processando}
                >
                  {processando ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Aprovar e Gerar Link
                </Button>
              </div>
            )}
            
            {selectedInteresse?.status !== 'pendente' && (
              <Button
                type="button"
                onClick={() => setDialogOpen(false)}
              >
                Fechar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AprovacaoInteresse;
