
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Users, GitBranch, Code, Copy, Link, Mail, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AprovacaoAprovados from './components/AprovacaoAprovados';
import FluxoAprovacao from './components/FluxoAprovacao';
import CodigoIncorporacao from './components/CodigoIncorporacao';
import { AssociadoInteresse } from './types/associadoInteresse';
import { DataTable } from '@/components/ui/data-table';
import { emailNotificationService } from '../comunicacao/services/emailNotificationService';
import { generateAssociadoPayment } from './services/associadoPaymentService';

/**
 * InteressadosPage displays all sign up interests and allows admin to manage them
 */
const InteressadosPage: React.FC = () => {
  const [interessados, setInteressados] = useState<AssociadoInteresse[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInteressados = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('associado_interesse')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure data has the proper types to match AssociadoInteresse
      const typedData = data?.map(item => ({
        ...item,
        status: (item.status || 'pendente') as 'pendente' | 'aprovado' | 'rejeitado'
      })) || [];
      
      setInteressados(typedData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar interessados",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteressados();
  }, []);

  const handleGerarLinkPagamento = async (interesse: AssociadoInteresse) => {
    try {
      // Verificar se já existe um link de pagamento
      if (interesse.pagamento_url) {
        toast({
          title: "Link de pagamento já existe",
          description: "Este interessado já possui um link de pagamento gerado.",
          variant: "warning"
        });
        return;
      }

      const { paymentUrl } = await generateAssociadoPayment({
        associadoInteresseId: interesse.id,
        associationTypeId: interesse.associationTypeId || "", // Enviar associationTypeId se disponível
        email: interesse.email,
        nome: interesse.nome,
        sobrenome: interesse.sobrenome,
        cpf: interesse.cpf
      });

      toast({
        title: "Link de pagamento gerado",
        description: "Link de pagamento gerado com sucesso.",
        variant: "success"
      });

      // Recarregar dados para mostrar o link atualizado
      fetchInteressados();
    } catch (error: any) {
      toast({
        title: "Erro ao gerar link de pagamento",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = (link: string | null) => {
    if (!link) {
      toast({
        title: "Link não disponível",
        description: "Não há link de pagamento para copiar.",
        variant: "warning"
      });
      return;
    }

    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "Link de pagamento copiado para a área de transferência.",
      variant: "success"
    });
  };

  const handleSendEmail = async (interesse: AssociadoInteresse) => {
    if (!interesse.pagamento_url) {
      toast({
        title: "Link de pagamento não disponível",
        description: "Gere um link de pagamento primeiro.",
        variant: "warning"
      });
      return;
    }

    try {
      const result = await emailNotificationService.sendEmail({
        to: interesse.email,
        subject: "Link de Pagamento da Associação ACIESC",
        body: `
          <h2>Olá ${interesse.nome} ${interesse.sobrenome},</h2>
          <p>Agradecemos pelo seu interesse em se associar à ACIESC.</p>
          <p>Para finalizar seu cadastro, por favor, realize o pagamento através do link abaixo:</p>
          <p><a href="${interesse.pagamento_url}" target="_blank">Clique aqui para acessar o pagamento</a></p>
          <p>Após a confirmação do pagamento, seu cadastro será finalizado automaticamente.</p>
          <p>Atenciosamente,<br>Equipe ACIESC</p>
        `
      });

      if (result.success) {
        toast({
          title: "Email enviado",
          description: "Link de pagamento enviado por email com sucesso.",
          variant: "success"
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const columns = [
    { key: 'nome', title: 'Nome', render: (value: string, record: AssociadoInteresse) => `${value} ${record.sobrenome}` },
    { key: 'email', title: 'Email' },
    { key: 'celular', title: 'Telefone' },
    { key: 'creci', title: 'CRECI' },
    { key: 'cidade', title: 'Cidade' },
    { key: 'estado', title: 'Estado' },
    { key: 'created_at', title: 'Data', render: (value: string) => new Date(value).toLocaleDateString('pt-BR') },
    { 
      key: 'pagamento_url', 
      title: 'Pagamento', 
      render: (value: string | null, record: AssociadoInteresse) => (
        <div className="flex gap-2">
          {!value ? (
            <Button 
              onClick={() => handleGerarLinkPagamento(record)}
              size="sm"
              variant="secondary"
              disabled={loading}
            >
              <Link className="h-4 w-4 mr-1" />
              Gerar Link
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => handleCopyLink(value)}
                size="sm" 
                variant="outline"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copiar
              </Button>
              <Button 
                onClick={() => handleSendEmail(record)} 
                size="sm"
                variant="outline"
              >
                <Mail className="h-4 w-4 mr-1" />
                Enviar
              </Button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="wp-header">Interessados</h1>
        <Button onClick={fetchInteressados} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-6">
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Todos Interessados</span>
          </TabsTrigger>
          <TabsTrigger value="aprovados" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Pagamentos Pendentes</span>
          </TabsTrigger>
          <TabsTrigger value="fluxo" className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <GitBranch className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visualize o processo de associação</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>Fluxo</span>
          </TabsTrigger>
          <TabsTrigger value="incorporacao" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Form Embed</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="mt-0">
          <DataTable
            columns={columns}
            data={interessados}
            searchable={true}
            searchKeys={['nome', 'sobrenome', 'email', 'cpf']}
          />
        </TabsContent>
        
        <TabsContent value="aprovados" className="mt-0">
          <AprovacaoAprovados />
        </TabsContent>
        
        <TabsContent value="fluxo" className="mt-0">
          <FluxoAprovacao />
        </TabsContent>
        
        <TabsContent value="incorporacao" className="mt-0">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Código de Incorporação do Formulário</h2>
            <p className="text-sm text-muted-foreground">
              Obtenha o código para incorporar o formulário de interesse em outros sites.
            </p>
            <CodigoIncorporacao />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteressadosPage;
