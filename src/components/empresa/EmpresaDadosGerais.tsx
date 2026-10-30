
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './types/formTypes';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmpresaDadosGeraisProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
}

const EmpresaDadosGerais: React.FC<EmpresaDadosGeraisProps> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor="razaoSocial">Razão Social*</Label>
        <Input 
          id="razaoSocial"
          type="text"
          {...register("razaoSocial", { required: "Razão Social é obrigatória" })} 
          className={errors.razaoSocial ? "border-red-500" : ""}
        />
        {errors.razaoSocial && <p className="text-red-500 text-sm mt-1">{errors.razaoSocial.message}</p>}
      </div>

      <div>
        <Label htmlFor="nomeFantasia">Nome Fantasia*</Label>
        <Input 
          id="nomeFantasia"
          type="text"
          {...register("nomeFantasia", { required: "Nome Fantasia é obrigatório" })} 
          className={errors.nomeFantasia ? "border-red-500" : ""}
        />
        {errors.nomeFantasia && <p className="text-red-500 text-sm mt-1">{errors.nomeFantasia.message}</p>}
      </div>

      <div>
        <Label htmlFor="cnpj">CNPJ*</Label>
        <Input 
          id="cnpj"
          type="text"
          placeholder="00.000.000/0000-00"
          {...register("cnpj", { required: "CNPJ é obrigatório" })}
          className={errors.cnpj ? "border-red-500" : ""}
        />
        {errors.cnpj && <p className="text-red-500 text-sm mt-1">{errors.cnpj.message}</p>}
      </div>

      <div>
        <Label htmlFor="responsavel">Responsável*</Label>
        <Input 
          id="responsavel"
          type="text"
          {...register("responsavel", { required: "Responsável é obrigatório" })} 
          className={errors.responsavel ? "border-red-500" : ""}
        />
        {errors.responsavel && <p className="text-red-500 text-sm mt-1">{errors.responsavel.message}</p>}
      </div>
    </div>
  );
};

export default EmpresaDadosGerais;
