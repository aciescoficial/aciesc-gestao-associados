
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { empresaSugestoesService } from '../../services/empresaSugestoesService';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { BasicInfoFields } from './fields/BasicInfoFields';
import { ContactInfoFields } from './fields/ContactInfoFields';
import { DetailsFields } from './fields/DetailsFields';
import { sugestaoFormSchema } from './schema';
import type { SugestaoFormValues } from './types';

interface SugestaoEmpresaFormProps {
  onClose: () => void;
}

export const SugestaoEmpresaForm: React.FC<SugestaoEmpresaFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const form = useForm<SugestaoFormValues>({
    resolver: zodResolver(sugestaoFormSchema),
    defaultValues: {
      nome_empresa: "",
      cidade: "",
      estado: "",
      telefone: "",
      instagram: "",
      site: "",
      contato: "",
      motivo: "",
      produtos: "",
    },
  });

  const onSubmit = async (data: SugestaoFormValues) => {
    try {
      await empresaSugestoesService.createSugestao(data);
      
      toast({
        title: "Sugestão enviada!",
        description: "Obrigado por sua sugestão. Nossa equipe irá analisá-la em breve.",
      });
      
      form.reset();
      onClose();
      
    } catch (error: any) {
      console.error("Error submitting suggestion:", error);
      toast({
        title: "Erro ao enviar sugestão",
        description: error.message || "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <BasicInfoFields form={form} />
      <ContactInfoFields form={form} />
      <DetailsFields form={form} />
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          <Send className="mr-2 h-4 w-4" />
          Enviar Sugestão
        </Button>
      </DialogFooter>
    </form>
  );
};
