
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { SugestaoFormValues } from '../types';

interface DetailsFieldsProps {
  form: UseFormReturn<SugestaoFormValues>;
}

export const DetailsFields: React.FC<DetailsFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="motivo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Por que você gostaria de ter essa empresa associada à ACIESC?*</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva brevemente o motivo da sugestão..." 
                className="resize-none" 
                rows={3}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="produtos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quais os principais produtos dessa empresa?*</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Liste os principais produtos ou serviços..." 
                className="resize-none" 
                rows={3}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
