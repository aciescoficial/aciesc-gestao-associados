
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './EmpresaForm';
import { Database } from '@/integrations/supabase/types';

interface EmpresaNichoInfoProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
}

const EmpresaNichoInfo: React.FC<EmpresaNichoInfoProps> = ({ register, errors }) => {
  const nichos: Database['public']['Enums']['nicho_type'][] = [
    "Alimentação", 
    "Saúde", 
    "Educação", 
    "Serviços", 
    "Comércio", 
    "Lazer", 
    "Tecnologia", 
    "Outro"
  ];

  return (
    <>
      {/* Nicho */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Nicho*</label>
        <select 
          className={`wp-input w-full ${errors.nicho ? 'border-wp-error' : ''}`}
          {...register('nicho', { required: "Nicho é obrigatório" })}
        >
          <option value="">Selecione um nicho</option>
          {nichos.map((nicho, index) => (
            <option key={index} value={nicho}>{nicho}</option>
          ))}
        </select>
        {errors.nicho && <p className="text-wp-error text-sm">{errors.nicho.message}</p>}
      </div>
      
      {/* Desconto */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Desconto Oferecido*</label>
        <input
          type="text"
          className={`wp-input w-full ${errors.desconto ? 'border-wp-error' : ''}`}
          placeholder="10% em todos os produtos"
          {...register('desconto', { required: "Desconto é obrigatório" })}
        />
        {errors.desconto && <p className="text-wp-error text-sm">{errors.desconto.message}</p>}
      </div>
      
      {/* Produtos/Serviços */}
      <div className="space-y-2 md:col-span-2">
        <label className="block text-sm font-medium">Produtos/Serviços*</label>
        <textarea
          className={`wp-input w-full h-32 ${errors.produtos ? 'border-wp-error' : ''}`}
          placeholder="Descreva os produtos/serviços oferecidos pela empresa"
          {...register('produtos', { required: "Produtos/Serviços é obrigatório" })}
        ></textarea>
        {errors.produtos && <p className="text-wp-error text-sm">{errors.produtos.message}</p>}
      </div>
    </>
  );
};

export default EmpresaNichoInfo;
