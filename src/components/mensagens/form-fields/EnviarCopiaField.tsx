
import React from 'react';
import { Control } from 'react-hook-form';
import { MensagemFormValues } from '../schema';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface EnviarCopiaFieldProps {
  control: Control<MensagemFormValues>;
}

const EnviarCopiaField: React.FC<EnviarCopiaFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="enviarCopia"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              id="enviar-copia"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <label
              htmlFor="enviar-copia"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Enviar uma cópia para mim
            </label>
          </div>
        </FormItem>
      )}
    />
  );
};

export default EnviarCopiaField;
