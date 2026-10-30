
import React from 'react';
import { Control } from 'react-hook-form';
import { MensagemFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DestinatarioFieldProps {
  control: Control<MensagemFormValues>;
}

const DestinatarioField: React.FC<DestinatarioFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="destinatario"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Destinatário</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="usuario" id="usuario" />
                <label htmlFor="usuario" className="text-sm font-medium leading-none cursor-pointer">
                  Usuário Específico
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grupo" id="grupo" />
                <label htmlFor="grupo" className="text-sm font-medium leading-none cursor-pointer">
                  Grupo de Usuários
                </label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default DestinatarioField;
