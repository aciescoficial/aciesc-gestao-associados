
import React from 'react';
import { Control } from 'react-hook-form';
import { MensagemFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface EmailDestinatarioFieldProps {
  control: Control<MensagemFormValues>;
}

const EmailDestinatarioField: React.FC<EmailDestinatarioFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="emailDestinatario"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email do Destinatário</FormLabel>
          <FormControl>
            <Input placeholder="email@exemplo.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailDestinatarioField;
