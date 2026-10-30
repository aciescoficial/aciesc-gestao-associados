
import React from 'react';
import { Control } from 'react-hook-form';
import { MensagemFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface AssuntoFieldProps {
  control: Control<MensagemFormValues>;
}

const AssuntoField: React.FC<AssuntoFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
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
  );
};

export default AssuntoField;
