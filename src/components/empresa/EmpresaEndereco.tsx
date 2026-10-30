
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './types/formTypes';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmpresaEnderecoProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
}

const EmpresaEndereco: React.FC<EmpresaEnderecoProps> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Label htmlFor="endereco">Endereço*</Label>
        <Input
          id="endereco"
          type="text"
          {...register('endereco', { required: "Endereço é obrigatório" })}
          className={errors.endereco ? "border-red-500" : ""}
        />
        {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="cidade">Cidade*</Label>
        <Input
          id="cidade"
          type="text"
          {...register('cidade', { required: "Cidade é obrigatória" })}
          className={errors.cidade ? "border-red-500" : ""}
        />
        {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="cep">CEP*</Label>
        <Input
          id="cep"
          type="text"
          placeholder="00000-000"
          {...register('cep', { required: "CEP é obrigatório" })}
          className={errors.cep ? "border-red-500" : ""}
        />
        {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>}
      </div>
    </div>
  );
};

export default EmpresaEndereco;
