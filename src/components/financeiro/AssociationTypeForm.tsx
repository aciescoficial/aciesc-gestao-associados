
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, InterestPaymentBy } from './types';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  value: z.coerce.number().positive('O valor deve ser maior que zero'),
  payment_methods: z.array(z.enum(['cartao', 'pix', 'boleto'])).min(1, 'Selecione pelo menos uma forma de pagamento'),
  max_installments: z.coerce.number().int().min(1).optional(),
  interest_payment_by: z.enum(['associacao', 'associado']).optional(),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AssociationTypeFormProps {
  onSuccess?: () => void;
  initialData?: FormValues;
  id?: string;
}

const paymentMethodOptions = [
  { id: 'cartao', label: 'Cartão de Crédito' },
  { id: 'pix', label: 'PIX' },
  { id: 'boleto', label: 'Boleto Bancário' },
];

const AssociationTypeForm: React.FC<AssociationTypeFormProps> = ({ onSuccess, initialData, id }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showInstallments, setShowInstallments] = useState(
    initialData?.payment_methods?.includes('cartao') ?? false
  );
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      value: 0,
      payment_methods: [],
      max_installments: 1,
      interest_payment_by: 'associado',
      active: true,
    },
  });

  const watchPaymentMethods = form.watch('payment_methods');

  React.useEffect(() => {
    const hasCard = watchPaymentMethods.includes('cartao');
    setShowInstallments(hasCard);
    
    if (!hasCard) {
      form.setValue('max_installments', 1);
      form.setValue('interest_payment_by', 'associado');
    }
  }, [watchPaymentMethods, form]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (id) {
        // Update existing association type
        const { error } = await supabase
          .from('association_types')
          .update({
            ...values,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: 'Sucesso',
          description: 'Tipo de associação atualizado com sucesso.',
        });
      } else {
        // Create new association type - Fix: ensure required fields are present
        const formData = {
          ...values,
          // Ensure required fields have values
          title: values.title || '',
          value: values.value || 0,
          payment_methods: values.payment_methods || [],
        };
        
        const { error } = await supabase
          .from('association_types')
          .insert(formData);
        
        if (error) throw error;
        
        toast({
          title: 'Sucesso',
          description: 'Tipo de associação criado com sucesso.',
        });
      }
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving association type:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o tipo de associação.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Associação Mensal" {...field} />
              </FormControl>
              <FormDescription>
                Nome do tipo de associação
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os benefícios deste tipo de associação"
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">R$</span>
                  <Input type="number" step="0.01" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="payment_methods"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Formas de Pagamento</FormLabel>
                <FormDescription>
                  Selecione as formas de pagamento disponíveis
                </FormDescription>
              </div>
              {paymentMethodOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="payment_methods"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.id as PaymentMethod)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...field.value, option.id as PaymentMethod]
                                : field.value?.filter(
                                    (value) => value !== option.id
                                  );
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        
        {showInstallments && (
          <>
            <FormField
              control={form.control}
              name="max_installments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de Parcelas</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="12" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número máximo de parcelas permitido
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interest_payment_by"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Pagamento de Juros</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="associacao" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Pago pela Associação
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="associado" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Pago pelo Associado
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <FormField
          control={form.control}
          name="active"
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
                  Ativo
                </FormLabel>
                <FormDescription>
                  Este tipo de associação está disponível para novos associados
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : id ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  );
};

export default AssociationTypeForm;
