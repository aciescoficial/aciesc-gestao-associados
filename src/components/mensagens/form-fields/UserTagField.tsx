
import React from 'react';
import { Control } from 'react-hook-form';
import { MensagemFormValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserTags } from '../hooks/useUserTags';

interface UserTagFieldProps {
  control: Control<MensagemFormValues>;
}

const UserTagField: React.FC<UserTagFieldProps> = ({ control }) => {
  const { tags, isLoading } = useUserTags();
  
  return (
    <FormField
      control={control}
      name="userTag"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Filtrar por Tag</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder={isLoading ? "Carregando tags..." : "Selecione uma tag"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default UserTagField;
