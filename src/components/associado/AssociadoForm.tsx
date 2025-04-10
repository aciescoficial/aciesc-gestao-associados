
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import DadosPessoaisForm from "./DadosPessoaisForm";
import EnderecoForm from "./EnderecoForm";
import ContatoForm from "./ContatoForm";
import FinanceiroForm from "./FinanceiroForm";
import { AssociadoFormData } from './types';
import { saveAssociado, uploadFoto } from './associadoService';

const AssociadoForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Schema for form validation
  const formSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    sobrenome: z.string().min(1, "Sobrenome é obrigatório"),
    cpf: z.string().min(11, "CPF inválido"),
    creci: z.string().optional(),
    dataNascimento: z.string().optional(),
    email: z.string().email("Email inválido"),
    celular: z.string().min(1, "Telefone é obrigatório"),
    rua: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    estado: z.string().optional(),
    cep: z.string().optional(),
    placaPrincipal: z.string().optional(),
    placaSecundaria: z.string().optional(),
    valorPago: z.string().optional(),
    dataUltimoPagamento: z.string().optional(),
    valorDevido: z.string().optional(),
    tipoPagamento: z.string().optional(),
    tipoAssociado: z.string().optional(),
    validade: z.string().optional(),
    foto: z
      .instanceof(FileList)
      .optional()
      .refine((files) => {
        if (!files) return true;
        return files.length === 0 || 
          (files[0] && (files[0].type === "image/jpeg" || files[0].type === "image/png"));
      }, "Arquivo deve ser uma imagem (JPEG ou PNG)")
  });
  
  const form = useForm<AssociadoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      cpf: "",
      creci: "",
      email: "",
      celular: "",
      cidade: "",
    },
  });
  
  const handleFormSubmit = async (data: AssociadoFormData) => {
    setSubmitting(true);
    
    try {
      const savedAssociado = await saveAssociado(data);
      
      // Upload photo if it exists
      if (data.foto && data.foto.length > 0) {
        await uploadFoto(savedAssociado.id, data.foto[0]);
      }
      
      toast({
        title: "Associado cadastrado com sucesso!",
        description: "O associado foi adicionado como pendente e aguarda aprovação.",
      });
      
      // Reset form
      form.reset();
      setActiveTab("dados-pessoais");
      
    } catch (error) {
      console.error("Erro ao cadastrar associado:", error);
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar o associado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="endereco">Endereço</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dados-pessoais">
          <DadosPessoaisForm form={form} />
          
          <div className="flex justify-end mt-6">
            <Button
              type="button"
              onClick={() => setActiveTab("contato")}
            >
              Próximo
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="contato">
          <ContatoForm form={form} />
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab("dados-pessoais")}
            >
              Anterior
            </Button>
            <Button
              type="button"
              onClick={() => setActiveTab("endereco")}
            >
              Próximo
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="endereco">
          <EnderecoForm form={form} />
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab("contato")}
            >
              Anterior
            </Button>
            <Button
              type="button"
              onClick={() => setActiveTab("financeiro")}
            >
              Próximo
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="financeiro">
          <FinanceiroForm form={form} />
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab("endereco")}
            >
              Anterior
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Associado"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default AssociadoForm;
