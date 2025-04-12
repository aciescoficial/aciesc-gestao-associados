import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sobrenome: z.string().min(1, "Sobrenome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  creci: z.string().optional(),
  email: z.string().email("Email inválido"),
  celular: z.string().min(1, "Telefone é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  motivoInteresse: z.string().min(10, "Por favor, explique brevemente seu interesse"),
});

type FormData = z.infer<typeof formSchema>;

const FormularioInteresse: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      cpf: "",
      creci: "",
      email: "",
      celular: "",
      cidade: "",
      estado: "",
      motivoInteresse: "",
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Registrar na tabela de interesse
      const { error } = await extendedSupabase
        .from('associado_interesse')
        .insert({
          nome: data.nome,
          sobrenome: data.sobrenome,
          cpf: data.cpf,
          creci: data.creci,
          email: data.email,
          celular: data.celular,
          cidade: data.cidade,
          estado: data.estado,
          motivo_interesse: data.motivoInteresse,
          status: 'pendente'
        });
        
      if (error) throw error;
      
      setSubmitted(true);
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Recebemos seu interesse. Em breve entraremos em contato.",
      });
      
    } catch (error: any) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: error.message || "Ocorreu um erro ao enviar o formulário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="text-center p-6 bg-white rounded shadow-sm">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Formulário Enviado com Sucesso!</h2>
        <p className="mb-4">Agradecemos seu interesse em se associar à ACIESC.</p>
        <p className="mb-6">Suas informações foram recebidas e nossa equipe irá analisá-las. Entraremos em contato em breve através do e-mail fornecido.</p>
        <Button onClick={() => setSubmitted(false)}>Enviar outro formulário</Button>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Formulário de Interesse - ACIESC</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sobrenome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu sobrenome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="creci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRECI (se aplicável)</FormLabel>
                  <FormControl>
                    <Input placeholder="Número do CRECI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="UF" {...field} maxLength={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="motivoInteresse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Por que você gostaria de se associar à ACIESC?</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva brevemente seu interesse..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : "Enviar Formulário"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormularioInteresse;
