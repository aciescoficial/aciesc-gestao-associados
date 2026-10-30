
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmpresaFormData } from './types/formTypes';
import { useEmpresaFormSubmit } from './hooks/useEmpresaFormSubmit';
import EmpresaDadosGerais from './EmpresaDadosGerais';
import EmpresaContato from './EmpresaContato';
import EmpresaEndereco from './EmpresaEndereco';
import EmpresaNichoInfo from './EmpresaNichoInfo';
import { EmpresaImageUpload } from './EmpresaImageUpload';
import LocationPicker from './map/LocationPicker';
import { FormActions } from './components/form/FormActions';

const EmpresaForm: React.FC = () => {
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dados-gerais');
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmpresaFormData>();
  const { handleSubmit: onSubmit, isSubmitting } = useEmpresaFormSubmit();

  const handleFormSubmit = (data: EmpresaFormData) => {
    onSubmit(data, reset, latitude, longitude);
  };

  const handleImageUpload = (url: string) => {
    setLogoUrl(url);
    setValue('logoUrl', url);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="endereco">Endereço</TabsTrigger>
          <TabsTrigger value="nicho">Nicho e Informações</TabsTrigger>
        </TabsList>

        <TabsContent value="dados-gerais" className="space-y-4">
          <div className="flex gap-6">
            <div className="w-48">
              <EmpresaImageUpload 
                onImageUpload={handleImageUpload}
                existingImageUrl={logoUrl}
              />
            </div>
            <div className="flex-1">
              <EmpresaDadosGerais register={register} errors={errors} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contato">
          <EmpresaContato register={register} errors={errors} />
        </TabsContent>

        <TabsContent value="endereco">
          <div className="space-y-6">
            <EmpresaEndereco register={register} errors={errors} />
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Localização no Mapa</h3>
              <LocationPicker
                onLocationSelected={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
                initialLatitude={latitude}
                initialLongitude={longitude}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nicho">
          <EmpresaNichoInfo register={register} errors={errors} />
        </TabsContent>
      </Tabs>

      <div className="wp-notice-warning">
        <p className="font-medium">Atenção</p>
        <p className="text-sm">Após o cadastro, a empresa ficará com status pendente de aprovação até que os dados sejam verificados.</p>
      </div>

      <FormActions isSubmitting={isSubmitting} onReset={reset} />
    </form>
  );
};

export default EmpresaForm;
