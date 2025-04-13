
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Save, Send } from 'lucide-react';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { sendTestEmail, getTemplateTestData } from './services/emailService';

interface EmailTemplate {
  id: string;
  nome: string;
  assunto: string;
  corpo: string;
  codigo: string;
}

const defaultTemplates = [
  {
    nome: 'Aprovação de Interesse',
    assunto: 'Sua solicitação de associação à ACIESC foi aprovada',
    corpo: `Olá {nome},

Temos o prazer de informar que sua solicitação de associação à ACIESC foi aprovada!

Para finalizar seu cadastro, clique no link abaixo para realizar o pagamento:
{link_pagamento}

Após a confirmação do pagamento, você receberá um email para criar sua senha e acessar nossa plataforma.

Atenciosamente,
Equipe ACIESC`,
    codigo: 'aprovacao_interesse'
  },
  {
    nome: 'Confirmação de Pagamento',
    assunto: 'Pagamento confirmado - Finalize seu cadastro na ACIESC',
    corpo: `Olá {nome},

Seu pagamento foi confirmado com sucesso!

Para finalizar seu cadastro e criar sua senha, clique no link abaixo:
{link_cadastro}

Este link é válido por 24 horas.

Atenciosamente,
Equipe ACIESC`,
    codigo: 'confirmacao_pagamento'
  }
];

const EmailTemplatesConfig: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [testEmailTo, setTestEmailTo] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [currentTemplateForTest, setCurrentTemplateForTest] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const { data, error } = await extendedSupabase
          .from('email_templates')
          .select('*')
          .order('nome');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setTemplates(data);
          setActiveTab(data[0].codigo);
        } else {
          // Nenhum template encontrado, criar os padrões
          await initializeDefaultTemplates();
        }
      } catch (error: any) {
        console.error('Erro ao buscar templates:', error);
        toast({
          title: 'Erro ao carregar templates',
          description: error.message || 'Ocorreu um erro ao buscar os templates de email',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, [toast]);
  
  const initializeDefaultTemplates = async () => {
    try {
      // Inserir templates padrão
      const { data, error } = await extendedSupabase
        .from('email_templates')
        .insert(defaultTemplates)
        .select();
        
      if (error) throw error;
      
      if (data) {
        setTemplates(data);
        setActiveTab(data[0].codigo);
      }
    } catch (error: any) {
      console.error('Erro ao inicializar templates:', error);
      toast({
        title: 'Erro ao criar templates padrão',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  const handleSave = async (template: EmailTemplate) => {
    setSaving(template.id);
    try {
      const { error } = await extendedSupabase
        .from('email_templates')
        .update({
          assunto: template.assunto,
          corpo: template.corpo
        })
        .eq('id', template.id);
        
      if (error) throw error;
      
      toast({
        title: 'Template salvo',
        description: 'O template de email foi atualizado com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: 'Erro ao salvar template',
        description: error.message || 'Ocorreu um erro ao salvar o template',
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };
  
  const updateTemplateField = (id: string, field: keyof EmailTemplate, value: string) => {
    setTemplates(currentTemplates => 
      currentTemplates.map(template => 
        template.id === id ? { ...template, [field]: value } : template
      )
    );
  };

  const openTestEmailDialog = (templateCode: string) => {
    setCurrentTemplateForTest(templateCode);
    setIsTestDialogOpen(true);
  };

  const handleSendTestEmail = async () => {
    if (!testEmailTo) {
      toast({
        title: 'Email obrigatório',
        description: 'Por favor, informe um email para envio do teste.',
        variant: 'destructive'
      });
      return;
    }

    setIsSendingTest(true);
    try {
      // Get test data for the specific template
      const testData = currentTemplateForTest ? getTemplateTestData(currentTemplateForTest) : undefined;
      
      await sendTestEmail({
        to: testEmailTo,
        template_id: currentTemplateForTest || undefined,
        test_data: testData
      });
      
      toast({
        title: 'Email de teste enviado',
        description: `Um email de teste foi enviado para ${testEmailTo}`
      });
      
      setIsTestDialogOpen(false);
      setTestEmailTo('');
    } catch (error: any) {
      console.error('Erro ao enviar email de teste:', error);
      toast({
        title: 'Erro ao enviar email de teste',
        description: error.message || 'Ocorreu um erro ao enviar o email de teste',
        variant: 'destructive'
      });
    } finally {
      setIsSendingTest(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Templates de Email</h2>
        <Button 
          variant="outline" 
          onClick={() => openTestEmailDialog('')}
          className="flex items-center gap-2"
        >
          <Send size={16} />
          Enviar Email Teste
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 size={30} className="animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <div className="wp-notice-warning">
          <p>Nenhum template configurado. Inicializando templates padrão...</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {templates.map(template => (
              <TabsTrigger key={template.codigo} value={template.codigo}>
                {template.nome}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {templates.map(template => (
            <TabsContent key={template.codigo} value={template.codigo} className="space-y-4">
              <div>
                <Label htmlFor={`subject-${template.id}`}>Assunto</Label>
                <input
                  id={`subject-${template.id}`}
                  className="w-full px-3 py-2 border rounded mt-1"
                  value={template.assunto}
                  onChange={(e) => updateTemplateField(template.id, 'assunto', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`body-${template.id}`}>Corpo do Email</Label>
                <Textarea
                  id={`body-${template.id}`}
                  className="min-h-[300px] font-mono text-sm mt-1"
                  value={template.corpo}
                  onChange={(e) => updateTemplateField(template.id, 'corpo', e.target.value)}
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium mb-1">Variáveis disponíveis:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><code>{'{nome}'}</code> - Nome do destinatário</li>
                  <li><code>{'{email}'}</code> - Email do destinatário</li>
                  {template.codigo === 'aprovacao_interesse' && (
                    <li><code>{'{link_pagamento}'}</code> - Link para pagamento</li>
                  )}
                  {template.codigo === 'confirmacao_pagamento' && (
                    <li><code>{'{link_cadastro}'}</code> - Link para finalizar cadastro</li>
                  )}
                </ul>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => handleSave(template)}
                  disabled={saving === template.id}
                  className="flex items-center gap-2"
                >
                  {saving === template.id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Salvar alterações
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => openTestEmailDialog(template.codigo)}
                  className="flex items-center gap-2"
                >
                  <Send size={16} />
                  Testar Template
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Test Email Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enviar Email de Teste</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="test-email" className="col-span-4">
                Email para envio do teste:
              </Label>
              <Input
                id="test-email"
                type="email"
                value={testEmailTo}
                onChange={(e) => setTestEmailTo(e.target.value)}
                className="col-span-4"
                placeholder="exemplo@email.com"
              />
            </div>
            {currentTemplateForTest && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Template: </span>
                  {templates.find(t => t.codigo === currentTemplateForTest)?.nome || currentTemplateForTest}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Será enviado um email de teste usando este template com dados fictícios.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendTestEmail} disabled={isSendingTest}>
              {isSendingTest ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Teste'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplatesConfig;
