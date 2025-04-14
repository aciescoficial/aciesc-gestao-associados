
import React from 'react';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { RecaptchaFormValues } from './types';

interface RecaptchaFormFieldsProps {
  form: UseFormReturn<RecaptchaFormValues>;
}

const RecaptchaFormFields: React.FC<RecaptchaFormFieldsProps> = ({ form }) => {
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="siteKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chave do Site (Site Key)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Chave pública do reCAPTCHA exibida no frontend.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="secretKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chave Secreta (Secret Key)</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormDescription>
              Chave secreta do reCAPTCHA usada para verificação no backend.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="threshold"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Limite de Pontuação (Threshold)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.1" 
                min="0" 
                max="1" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))} 
              />
            </FormControl>
            <FormDescription>
              Valor mínimo de pontuação para considerar uma interação humana (0 a 1).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};

export default RecaptchaFormFields;
