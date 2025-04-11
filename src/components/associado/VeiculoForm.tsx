
import React from 'react';
import { Car, Bike } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import { AssociadoFormData, tiposVeiculos } from './types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface VeiculoFormProps {
  form: UseFormReturn<AssociadoFormData>;
}

export const VeiculoForm: React.FC<VeiculoFormProps> = ({ form }) => {
  const { register, setValue, watch } = form;
  
  const tipoVeiculoPrincipal = watch('tipoVeiculoPrincipal');
  const tipoVeiculoSecundario = watch('tipoVeiculoSecundario');
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Informações do Veículo Principal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="placaPrincipal" className="flex items-center gap-2">
              <Car size={16} />
              Placa Principal
            </Label>
            <Input
              id="placaPrincipal"
              type="text"
              placeholder="AAA0A00"
              {...register('placaPrincipal')}
            />
          </div>
          
          <div>
            <Label htmlFor="tipoVeiculoPrincipal">Tipo de Veículo</Label>
            <Select
              value={tipoVeiculoPrincipal}
              onValueChange={(value) => setValue('tipoVeiculoPrincipal', value as 'Moto' | 'Carro')}
            >
              <SelectTrigger id="tipoVeiculoPrincipal">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {tiposVeiculos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo === 'Moto' ? (
                      <span className="flex items-center gap-2">
                        <Bike size={14} /> {tipo}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Car size={14} /> {tipo}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="modeloVeiculoPrincipal">Modelo do Veículo</Label>
            <Input
              id="modeloVeiculoPrincipal"
              type="text"
              placeholder="Ex: Honda Civic"
              {...register('modeloVeiculoPrincipal')}
            />
          </div>
          
          <div>
            <Label htmlFor="corVeiculoPrincipal">Cor do Veículo</Label>
            <Input
              id="corVeiculoPrincipal"
              type="text"
              placeholder="Ex: Prata"
              {...register('corVeiculoPrincipal')}
            />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Informações do Veículo Secundário</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="placaSecundaria">Placa Secundária</Label>
            <Input
              id="placaSecundaria"
              type="text"
              placeholder="AAA0A00"
              {...register('placaSecundaria')}
            />
          </div>
          
          <div>
            <Label htmlFor="tipoVeiculoSecundario">Tipo de Veículo</Label>
            <Select
              value={tipoVeiculoSecundario}
              onValueChange={(value) => setValue('tipoVeiculoSecundario', value as 'Moto' | 'Carro')}
            >
              <SelectTrigger id="tipoVeiculoSecundario">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {tiposVeiculos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo === 'Moto' ? (
                      <span className="flex items-center gap-2">
                        <Bike size={14} /> {tipo}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Car size={14} /> {tipo}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="modeloVeiculoSecundario">Modelo do Veículo</Label>
            <Input
              id="modeloVeiculoSecundario"
              type="text"
              placeholder="Ex: Honda CB 500"
              {...register('modeloVeiculoSecundario')}
            />
          </div>
          
          <div>
            <Label htmlFor="corVeiculoSecundario">Cor do Veículo</Label>
            <Input
              id="corVeiculoSecundario"
              type="text"
              placeholder="Ex: Preto"
              {...register('corVeiculoSecundario')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
