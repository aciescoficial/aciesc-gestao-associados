
import React from 'react';
import { Control } from 'react-hook-form';
import { MensagemFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface MensagemFieldProps {
  control: Control<MensagemFormValues>;
}

const MensagemField: React.FC<MensagemFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="mensagem"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mensagem</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Digite sua mensagem aqui"
              className="min-h-[150px] resize-y"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MensagemField;
