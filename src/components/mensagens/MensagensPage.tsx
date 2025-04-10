
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Users, Mail, Bell } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRole } from '../usuarios/types';

// Schema para validação do formulário
const mensagemSchema = z.object({
  assunto: z.string().min(3, { message: 'O assunto deve ter pelo menos 3 caracteres' }),
  mensagem: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' }),
  tipoEnvio: z.enum(['email', 'notificacao', 'push', 'ambos']),
  destinatario: z.enum(['usuario', 'grupo']),
  emailDestinatario: z.string().email().optional(),
  grupoDestinatarios: z.enum(['associados', 'conveniados', 'diretoria', 'admin', 'todos']).optional(),
  enviarCopia: z.boolean().default(false),
});

type MensagemFormValues = z.infer<typeof mensagemSchema>;

const MensagensPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Configuração do formulário com React Hook Form e validação Zod
  const form = useForm<MensagemFormValues>({
    resolver: zodResolver(mensagemSchema),
    defaultValues: {
      assunto: '',
      mensagem: '',
      tipoEnvio: 'email',
      destinatario: 'usuario',
      enviarCopia: false,
    },
  });

  // Tipo de destinatário selecionado (usuário individual ou grupo)
  const tipoDestinatario = form.watch('destinatario');
  
  // Função para enviar o formulário
  const onSubmit = async (values: MensagemFormValues) => {
    setIsLoading(true);
    
    try {
      console.log('Enviando mensagem:', values);
      
      // Aqui iria a lógica para enviar a mensagem através de uma API
      // Simulando um envio com atraso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Mensagem enviada com sucesso!');
      form.reset();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="wp-header">Sistema de Mensagens</h1>
      </div>
      
      <div className="wp-card">
        <h2 className="text-xl font-semibold mb-4">Enviar Nova Mensagem</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tipo de envio */}
            <FormField
              control={form.control}
              name="tipoEnvio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Envio</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de envio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="notificacao">Notificação no sistema</SelectItem>
                      <SelectItem value="push">Notificação Push</SelectItem>
                      <SelectItem value="ambos">Todos os tipos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Escolha como deseja enviar sua mensagem
                  </FormDescription>
                </FormItem>
              )}
            />
            
            {/* Tipo de destinatário */}
            <FormField
              control={form.control}
              name="destinatario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinatário</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de destinatário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usuario">Usuário específico</SelectItem>
                      <SelectItem value="grupo">Grupo de usuários</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            {/* E-mail do destinatário (se for usuário específico) */}
            {tipoDestinatario === 'usuario' && (
              <FormField
                control={form.control}
                name="emailDestinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail do Destinatário</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Grupo de destinatários (se for grupo) */}
            {tipoDestinatario === 'grupo' && (
              <FormField
                control={form.control}
                name="grupoDestinatarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo de Destinatários</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="associados">Associados</SelectItem>
                        <SelectItem value="conveniados">Empresas Conveniadas</SelectItem>
                        <SelectItem value="diretoria">Diretoria</SelectItem>
                        <SelectItem value="admin">Administradores</SelectItem>
                        <SelectItem value="todos">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
            
            {/* Assunto da mensagem */}
            <FormField
              control={form.control}
              name="assunto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o assunto da mensagem" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Conteúdo da mensagem */}
            <FormField
              control={form.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite sua mensagem aqui..." 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Opção para enviar cópia para si mesmo */}
            <FormField
              control={form.control}
              name="enviarCopia"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enviar cópia para mim</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {/* Botão de envio */}
            <Button type="submit" disabled={isLoading} className="mt-4">
              {isLoading ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MensagensPage;
