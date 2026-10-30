
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mensagemSchema, type MensagemFormValues } from '../schema';
import TipoEnvioField from '../form-fields/TipoEnvioField';
import DestinatarioField from '../form-fields/DestinatarioField';
import EmailDestinatarioField from '../form-fields/EmailDestinatarioField';
import GrupoDestinatariosField from '../form-fields/GrupoDestinatariosField';
import UserTagField from '../form-fields/UserTagField';
import UserSelectionField from '../form-fields/UserSelectionField';
import AssuntoField from '../form-fields/AssuntoField';
import MensagemField from '../form-fields/MensagemField';
import EnviarCopiaField from '../form-fields/EnviarCopiaField';
import SubmitButton from './SubmitButton';
import { useFormSubmission } from '../hooks/useFormSubmission';
import EmailSystemStatus from '../components/EmailSystemStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const MensagensForm: React.FC = () => {
  // Configuração do formulário com React Hook Form e validação Zod
  const form = useForm<MensagemFormValues>({
    resolver: zodResolver(mensagemSchema),
    defaultValues: {
      assunto: '',
      mensagem: '',
      tipoEnvio: 'email',
      destinatario: 'usuario',
      enviarCopia: false,
      selectedUsers: [],
    },
  });

  // Tipo de destinatário e envio selecionados
  const tipoDestinatario = form.watch('destinatario');
  const tipoEnvio = form.watch('tipoEnvio');
  const userTag = form.watch('userTag');
  
  // Reset user selection when tag changes
  useEffect(() => {
    form.setValue('selectedUsers', []);
  }, [userTag, form]);
  
  // Usar nosso hook personalizado para gerenciar o envio
  const { onSubmit, isLoading } = useFormSubmission(form.reset);
  
  // Aba ativa para seleção de destinatários
  const [activeTab, setActiveTab] = useState<string>("single");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Configurações de Envio</h3>
            {tipoEnvio === 'email' && <EmailSystemStatus />}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <TipoEnvioField control={form.control} />
            <DestinatarioField control={form.control} />
          </div>
          
          {tipoDestinatario === 'usuario' && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="single">Usuário Individual</TabsTrigger>
                <TabsTrigger value="multiple">Múltiplos Usuários</TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="pt-4">
                <EmailDestinatarioField control={form.control} />
              </TabsContent>
              
              <TabsContent value="multiple" className="space-y-4 pt-4">
                <UserTagField control={form.control} />
                <UserSelectionField control={form.control} userTag={userTag} />
                
                {form.watch('selectedUsers')?.length === 0 && (
                  <Alert variant="default" className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Selecione pelo menos um usuário para enviar a mensagem.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {tipoDestinatario === 'grupo' && (
            <div className="space-y-4">
              <GrupoDestinatariosField control={form.control} />
              <UserTagField control={form.control} />
              
              <Alert variant="default" className="bg-muted/50">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  A mensagem será enviada para todos os usuários do grupo selecionado.
                  {userTag && userTag !== 'todos' && " Apenas usuários com a tag selecionada receberão a mensagem."}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Conteúdo da Mensagem</h3>
          <AssuntoField control={form.control} />
          <MensagemField control={form.control} />
          {tipoEnvio === 'email' && <EnviarCopiaField control={form.control} />}
          
          {/* Botão de envio */}
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>
    </Form>
  );
};

export default React.memo(MensagensForm);
