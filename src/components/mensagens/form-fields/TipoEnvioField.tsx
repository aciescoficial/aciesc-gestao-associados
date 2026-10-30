
import React from 'react';
import { Control } from 'react-hook-form';
import { MensagemFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSystemConfig } from '@/components/configuracoes/system/hooks/useSystemConfig';

interface TipoEnvioFieldProps {
  control: Control<MensagemFormValues>;
}

const TipoEnvioField: React.FC<TipoEnvioFieldProps> = ({ control }) => {
  // Check email system status
  const { configValues, isLoading } = useSystemConfig();
  const emailEnabled = configValues && !!configValues['GO_HIGH_LEVEL_API_KEY'];

  return (
    <FormField
      control={control}
      name="tipoEnvio"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Tipo de Envio</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                // If email is not enabled and user tries to select email, default to sistema
                field.onChange(value === 'email' && !emailEnabled ? 'sistema' : value);
              }}
              defaultValue={field.value}
              className="flex space-x-4"
            >
              {emailEnabled && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <label htmlFor="email" className="text-sm font-medium leading-none cursor-pointer">
                    Email
                  </label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sistema" id="sistema" />
                <label htmlFor="sistema" className="text-sm font-medium leading-none cursor-pointer">
                  Sistema
                </label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default TipoEnvioField;
