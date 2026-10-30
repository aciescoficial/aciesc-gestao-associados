
import React from 'react';
import { Control } from 'react-hook-form';
import { MensagemFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GrupoDestinatariosFieldProps {
  control: Control<MensagemFormValues>;
}

const GrupoDestinatariosField: React.FC<GrupoDestinatariosFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="grupoDestinatarios"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Grupo de Destinatários</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="associados">Associados</SelectItem>
                <SelectItem value="empresas">Empresas</SelectItem>
                <SelectItem value="diretoria">Diretoria</SelectItem>
                <SelectItem value="todos">Todos os Usuários</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default GrupoDestinatariosField;
