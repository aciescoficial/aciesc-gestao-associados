
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';

type StatusType = Database['public']['Enums']['status_type'];

interface ConveniadoFormData {
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  cidade: string;
  cpf: string;
  creci: string;
  placaPrincipal: string;
  placaSecundaria: string;
}

const CadastroConveniado: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConveniadoFormData>();
  
  const onSubmit = async (data: ConveniadoFormData) => {
    setIsSubmitting(true);
    
    try {
      // Map form data to database schema
      const conveniadoData = {
        nome: data.nome,
        sobrenome: data.sobrenome,
        telefone: data.telefone,
        email: data.email,
        cidade: data.cidade,
        cpf: data.cpf,
        creci: data.creci || null,
        placa_principal: data.placaPrincipal || null,
        placa_secundaria: data.placaSecundaria || null,
        status: 'pendente' as StatusType
      };
      
      // Insert data into the conveniados table
      const { error } = await supabase
        .from('conveniados')
        .insert(conveniadoData);
        
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "O conveniado foi cadastrado e está aguardando aprovação.",
      });
      
      reset();
    } catch (error: any) {
      console.error("Error inserting data:", error);
      
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao cadastrar o conveniado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Cadastrar Conveniado</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Nome*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.nome ? 'border-wp-error' : ''}`}
                {...register('nome', { required: "Nome é obrigatório" })}
              />
              {errors.nome && <p className="text-wp-error text-sm">{errors.nome.message}</p>}
            </div>
            
            {/* Sobrenome */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Sobrenome*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.sobrenome ? 'border-wp-error' : ''}`}
                {...register('sobrenome', { required: "Sobrenome é obrigatório" })}
              />
              {errors.sobrenome && <p className="text-wp-error text-sm">{errors.sobrenome.message}</p>}
            </div>
            
            {/* Telefone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Telefone*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.telefone ? 'border-wp-error' : ''}`}
                placeholder="(00) 00000-0000"
                {...register('telefone', { required: "Telefone é obrigatório" })}
              />
              {errors.telefone && <p className="text-wp-error text-sm">{errors.telefone.message}</p>}
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">E-mail*</label>
              <input
                type="email"
                className={`wp-input w-full ${errors.email ? 'border-wp-error' : ''}`}
                {...register('email', { 
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido"
                  } 
                })}
              />
              {errors.email && <p className="text-wp-error text-sm">{errors.email.message}</p>}
            </div>
            
            {/* Cidade */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Cidade*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.cidade ? 'border-wp-error' : ''}`}
                {...register('cidade', { required: "Cidade é obrigatória" })}
              />
              {errors.cidade && <p className="text-wp-error text-sm">{errors.cidade.message}</p>}
            </div>
            
            {/* CPF */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">CPF*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.cpf ? 'border-wp-error' : ''}`}
                placeholder="000.000.000-00"
                {...register('cpf', { required: "CPF é obrigatório" })}
              />
              {errors.cpf && <p className="text-wp-error text-sm">{errors.cpf.message}</p>}
            </div>
            
            {/* CRECI */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Número CRECI</label>
              <input
                type="text"
                className="wp-input w-full"
                {...register('creci')}
              />
            </div>
            
            {/* Placa Principal */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Placa do Seu Carro - Principal</label>
              <input
                type="text"
                className="wp-input w-full"
                placeholder="AAA0A00"
                {...register('placaPrincipal')}
              />
            </div>
            
            {/* Placa Secundária */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Placa do Seu Carro - Secundário</label>
              <input
                type="text"
                className="wp-input w-full"
                placeholder="AAA0A00"
                {...register('placaSecundaria')}
              />
            </div>
          </div>
          
          <div className="wp-notice-warning">
            <p className="font-medium">Atenção</p>
            <p className="text-sm">Após o cadastro, o conveniado ficará com status pendente de aprovação até que a documentação seja verificada.</p>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="wp-button-secondary mr-2"
              onClick={() => reset()}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="wp-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroConveniado;
