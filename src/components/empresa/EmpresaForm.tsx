import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import EmpresaDadosGerais from './EmpresaDadosGerais';
import EmpresaContato from './EmpresaContato';
import EmpresaEndereco from './EmpresaEndereco';
import EmpresaNichoInfo from './EmpresaNichoInfo';
import EmpresaImageUpload from './EmpresaImageUpload';
import { Database } from '@/integrations/supabase/types';
import LocationPicker from './map/LocationPicker';

type NichoType = Database['public']['Enums']['nicho_type'];
type StatusType = Database['public']['Enums']['status_type'];

export interface EmpresaFormData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  site: string;
  instagram: string;
  whatsapp: string;
  nicho: NichoType;
  desconto: string;
  produtos: string;
  logoUrl: string;
  capaUrl: string;
  videoUrl: string;
}

const EmpresaForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmpresaFormData>();
  
  const onSubmit = async (data: EmpresaFormData) => {
    setIsSubmitting(true);
    
    try {
      // Map form data to database schema
      const empresaData = {
        razao_social: data.razaoSocial,
        nome_fantasia: data.nomeFantasia,
        cnpj: data.cnpj,
        responsavel: data.responsavel,
        telefone: data.telefone,
        email: data.email,
        endereco: data.endereco,
        cidade: data.cidade,
        cep: data.cep,
        site: data.site || null,
        instagram: data.instagram || null,
        whatsapp: data.whatsapp || null,
        nicho: data.nicho,
        desconto: data.desconto,
        produtos: data.produtos,
        logo_url: data.logoUrl || null,
        capa_url: data.capaUrl || null,
        video_url: data.videoUrl || null,
        latitude: latitude,
        longitude: longitude,
        status: 'pendente' as StatusType
      };
      
      // Insert data into the empresas table
      const { error } = await supabase
        .from('empresas')
        .insert(empresaData);
        
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "A empresa foi cadastrada e está aguardando aprovação por um administrador.",
      });
      
      reset();
    } catch (error: any) {
      console.error("Error inserting data:", error);
      
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao cadastrar a empresa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmpresaDadosGerais register={register} errors={errors} />
        <EmpresaContato register={register} errors={errors} />
        <EmpresaEndereco register={register} errors={errors} />
        <EmpresaNichoInfo register={register} errors={errors} />
        <EmpresaImageUpload 
          register={register}
          errors={errors}
          setValue={setValue}
        />
      </div>

      <div className="wp-card">
        <h3 className="wp-subheader mb-4">Localização no Mapa</h3>
        <LocationPicker
          onLocationSelected={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
          initialLatitude={latitude}
          initialLongitude={longitude}
        />
      </div>
      
      <div className="wp-notice-warning">
        <p className="font-medium">Atenção</p>
        <p className="text-sm">Após o cadastro, a empresa ficará com status pendente de aprovação até que os dados sejam verificados.</p>
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
  );
};

export default EmpresaForm;
