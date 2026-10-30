
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { SugestaoFormValues } from '../types';

interface BasicInfoFieldsProps {
  form: UseFormReturn<SugestaoFormValues>;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="nome_empresa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Empresa*</FormLabel>
            <FormControl>
              <Input placeholder="Nome da empresa" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contato"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Proprietário/Nome do Contato*</FormLabel>
            <FormControl>
              <Input placeholder="Nome do responsável ou contato" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
