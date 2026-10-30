
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './types/formTypes';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmpresaContatoProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
}

const EmpresaContato: React.FC<EmpresaContatoProps> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="telefone">Telefone*</Label>
        <Input
          id="telefone"
          type="text"
          placeholder="(00) 00000-0000"
          {...register('telefone', { required: "Telefone é obrigatório" })}
          className={errors.telefone ? "border-red-500" : ""}
        />
        {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="email">E-mail*</Label>
        <Input
          id="email"
          type="email"
          {...register('email', { 
            required: "E-mail é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "E-mail inválido"
            } 
          })}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="site">Site</Label>
        <Input
          id="site"
          type="url"
          placeholder="https://www.example.com"
          {...register('site')}
        />
      </div>
      
      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          type="text"
          placeholder="@seuinstagram"
          {...register('instagram')}
        />
      </div>
      
      <div>
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          id="whatsapp"
          type="text"
          placeholder="(00) 00000-0000"
          {...register('whatsapp')}
        />
      </div>
    </div>
  );
};

export default EmpresaContato;
