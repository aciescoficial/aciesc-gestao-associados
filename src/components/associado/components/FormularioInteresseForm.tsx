
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { formInteresseSchema, FormInteresseData } from '../schemas/formInteresseSchema';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface AssociationType {
  id: string;
  title: string;
  value: number;
  description: string | null;
}

interface FormularioInteresseFormProps {
  onSubmit: (data: FormInteresseData) => Promise<void>;
  isSubmitting: boolean;
}

const FormularioInteresseForm: React.FC<FormularioInteresseFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const [associationTypes, setAssociationTypes] = useState<AssociationType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  
  const form = useForm<FormInteresseData>({
    resolver: zodResolver(formInteresseSchema),
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
      associationTypeId: "",
      isCorretor: false,
      aceitaTermos: false,
    },
  });
  
  // Load association types when component mounts
  useEffect(() => {
    const loadAssociationTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('association_types')
          .select('id, title, value, description')
          .eq('active', true)
          .order('value');
          
        if (error) throw error;
        
        setAssociationTypes(data || []);
      } catch (error) {
        console.error("Erro ao carregar tipos de associação:", error);
      } finally {
        setLoadingTypes(false);
      }
    };
    
    loadAssociationTypes();
  }, []);
  
  return (
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
                <FormLabel>CRECI</FormLabel>
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
          name="associationTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Associação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de associação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingTypes ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : (
                    associationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.title} - {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(type.value)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <div className="space-y-4 border border-gray-200 rounded-md p-4 bg-gray-50">
          <FormField
            control={form.control}
            name="isCorretor"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Confirmo que sou Corretor de Imóveis com registro ativo no CRECI
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="aceitaTermos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Li e aceito os termos do regulamento para me tornar associado da ACIESC
                  </FormLabel>
                  <FormDescription>
                    <a 
                      href="https://www.aciesc.com.br/regulamento" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-primary underline"
                    >
                      Clique aqui para ler o regulamento
                    </a>
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
        
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
  );
};

export default FormularioInteresseForm;
