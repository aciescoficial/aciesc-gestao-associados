
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './EmpresaForm';

interface EmpresaDadosGeraisProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
}

const EmpresaDadosGerais: React.FC<EmpresaDadosGeraisProps> = ({ register, errors }) => {
  return (
    <>
      {/* Razão Social */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Razão Social*</label>
        <input
          type="text"
          className={`wp-input w-full ${errors.razaoSocial ? 'border-wp-error' : ''}`}
          {...register('razaoSocial', { required: "Razão Social é obrigatória" })}
        />
        {errors.razaoSocial && <p className="text-wp-error text-sm">{errors.razaoSocial.message}</p>}
      </div>
      
      {/* Nome Fantasia */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Nome Fantasia*</label>
        <input
          type="text"
          className={`wp-input w-full ${errors.nomeFantasia ? 'border-wp-error' : ''}`}
          {...register('nomeFantasia', { required: "Nome Fantasia é obrigatório" })}
        />
        {errors.nomeFantasia && <p className="text-wp-error text-sm">{errors.nomeFantasia.message}</p>}
      </div>
      
      {/* CNPJ */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">CNPJ*</label>
        <input
          type="text"
          className={`wp-input w-full ${errors.cnpj ? 'border-wp-error' : ''}`}
          placeholder="00.000.000/0001-00"
          {...register('cnpj', { required: "CNPJ é obrigatório" })}
        />
        {errors.cnpj && <p className="text-wp-error text-sm">{errors.cnpj.message}</p>}
      </div>
      
      {/* Responsável */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Responsável*</label>
        <input
          type="text"
          className={`wp-input w-full ${errors.responsavel ? 'border-wp-error' : ''}`}
          {...register('responsavel', { required: "Responsável é obrigatório" })}
        />
        {errors.responsavel && <p className="text-wp-error text-sm">{errors.responsavel.message}</p>}
      </div>
    </>
  );
};

export default EmpresaDadosGerais;
