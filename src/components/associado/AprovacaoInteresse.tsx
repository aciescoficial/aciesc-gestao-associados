
import React, { useEffect, useState } from 'react';
import { Check, X, Info, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { getAssociadoInteresses, updateInterestStatus } from './services/associadoInteressesService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';

export interface AssociadoInteresse {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  celular: string;
  cidade: string;
  estado: string;
  cpf: string;
  creci: string | null;
  motivo_interesse: string | null;
  status: string;
  created_at: string;
  pagamento_confirmado: boolean | null;
  pagamento_data: string | null;
  payment_proof_url: string | null;
}

const AprovacaoInteresse: React.FC = () => {
  const [interesses, setInteresses] = useState<AssociadoInteresse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isAdmin) {
      fetchPendingInterests();
    }
  }, [isAdmin]);

  const fetchPendingInterests = async () => {
    try {
      setIsLoading(true);
      const data = await getAssociadoInteresses();
      setInteresses(data);
    } catch (error) {
      console.error('Error fetching pending interests:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os interesses pendentes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, email: string, nome: string, sobrenome: string) => {
    try {
      await updateInterestStatus(id, 'aprovado');
      
      // Generate a signup token valid for 7 days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      const token = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      
      // Save the token to database
      const { error: tokenError } = await supabase
        .from('signup_tokens')
        .insert({
          associado_interesse_id: id,
          token,
          expires_at: expiresAt.toISOString(),
          used: false
        });
      
      if (tokenError) {
        throw tokenError;
      }
      
      // Update local state
      setInteresses(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Interesse aprovado',
        description: `Uma notificação foi enviada para ${nome} ${sobrenome} com instruções para cadastro.`,
      });
    } catch (error) {
      console.error('Error approving interest:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao aprovar o interesse. Tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      await updateInterestStatus(id, 'rejeitado');
      
      // Update local state
      setInteresses(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Interesse rejeitado',
        description: 'O interesse foi rejeitado com sucesso.',
      });
    } catch (error) {
      console.error('Error rejecting interest:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao rejeitar o interesse. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const renderMobileCard = (interesse: AssociadoInteresse) => {
    return (
      <div key={interesse.id} className="bg-white rounded-lg shadow-sm border p-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-base">
              {interesse.nome} {interesse.sobrenome}
              {interesse.creci && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  CRECI: {interesse.creci}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{interesse.email}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            interesse.pagamento_confirmado 
              ? 'bg-green-100 text-green-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {interesse.pagamento_confirmado ? 'Pago' : 'Pendente'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div>
            <p className="text-gray-500">CPF:</p>
            <p>{interesse.cpf}</p>
          </div>
          <div>
            <p className="text-gray-500">Telefone:</p>
            <p>{interesse.celular}</p>
          </div>
        </div>
        
        <div className="mt-2 text-sm">
          <p className="text-gray-500">Localização:</p>
          <p>{interesse.cidade}/{interesse.estado}</p>
        </div>
        
        <div className="mt-2 text-sm">
          <p className="text-gray-500">Data do interesse:</p>
          <p>{new Date(interesse.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => 
              handleApprove(
                interesse.id, 
                interesse.email,
                interesse.nome,
                interesse.sobrenome
              )
            }
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Aprovar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleReject(interesse.id)}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-1" />
            Rejeitar
          </Button>
        </div>
      </div>
    );
  };

  if (!isAdmin) {
    return (
      <div className="text-center p-6">
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Solicitações de Interesse</h2>
        <Button onClick={fetchPendingInterests} variant="outline" size="sm" disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Atualizar'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : interesses.length === 0 ? (
        <Alert>
          <AlertTitle>Nenhum interesse pendente</AlertTitle>
          <AlertDescription>
            Não há novos interesses de associação para avaliar no momento.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertTitle>Instruções</AlertTitle>
            <AlertDescription>
              Avalie cada solicitação de interesse. Ao aprovar, será enviado um email com link para cadastro.
            </AlertDescription>
          </Alert>
          
          {/* Exibição para dispositivos móveis */}
          {isMobile && (
            <div className="md:hidden">
              {interesses.map(renderMobileCard)}
            </div>
          )}
          
          {/* Exibição para desktop */}
          {!isMobile && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3">Nome</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Telefone</th>
                    <th className="text-left p-3">CPF</th>
                    <th className="text-left p-3">Cidade/UF</th>
                    <th className="text-left p-3">Data</th>
                    <th className="text-left p-3">Pagamento</th>
                    <th className="text-center p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {interesses.map((interesse) => (
                    <tr key={interesse.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {interesse.nome} {interesse.sobrenome}
                        {interesse.creci && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            CRECI: {interesse.creci}
                          </span>
                        )}
                      </td>
                      <td className="p-3">{interesse.email}</td>
                      <td className="p-3">{interesse.celular}</td>
                      <td className="p-3">{interesse.cpf}</td>
                      <td className="p-3">
                        {interesse.cidade}/{interesse.estado}
                      </td>
                      <td className="p-3">
                        {new Date(interesse.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3">
                        {interesse.pagamento_confirmado ? (
                          <span className="text-green-600 font-medium">Confirmado</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Pendente</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => 
                              handleApprove(
                                interesse.id, 
                                interesse.email,
                                interesse.nome,
                                interesse.sobrenome
                              )
                            }
                            className="flex items-center"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(interesse.id)}
                            className="flex items-center"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AprovacaoInteresse;
