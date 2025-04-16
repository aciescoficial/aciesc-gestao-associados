
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { AssociadoFormData, tiposPagamento } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';

interface FinanceiroFormProps {
  form: UseFormReturn<AssociadoFormData>;
}

export const FinanceiroForm: React.FC<FinanceiroFormProps> = ({ form }) => {
  const { register, watch, setValue } = form;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('comprovantePagamento', e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-full">
          <h3 className="text-lg font-medium mb-2">Informações Financeiras</h3>
        </div>
        
        <div>
          <Label htmlFor="valorPago" className="flex items-center gap-2">
            <DollarSign size={16} />
            Valor Pago
          </Label>
          <Input
            id="valorPago"
            type="text"
            placeholder="R$ 0,00"
            {...register('valorPago')}
          />
        </div>
        
        <div>
          <Label htmlFor="dataUltimoPagamento">Data Último Pagamento</Label>
          <Input
            id="dataUltimoPagamento"
            type="date"
            {...register('dataUltimoPagamento')}
          />
        </div>
        
        <div>
          <Label htmlFor="valorDevido">Valor Devido</Label>
          <Input
            id="valorDevido"
            type="text"
            placeholder="R$ 0,00"
            {...register('valorDevido')}
          />
        </div>
        
        <div>
          <Label htmlFor="tipoPagamento">Tipo de Pagamento</Label>
          <Select 
            onValueChange={(value) => setValue('tipoPagamento', value)} 
            defaultValue={watch('tipoPagamento') || ''}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposPagamento.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-full">
          <Label htmlFor="comprovantePagamento">Comprovante de Pagamento</Label>
          <div className="flex items-center mt-2">
            <Input
              id="comprovantePagamento"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground ml-2">
              Formatos aceitos: JPG, PNG e PDF
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="criarUsuario"
            checked={watch('criarUsuario') || false}
            onCheckedChange={(checked) => setValue('criarUsuario', checked === true)}
          />
          <Label htmlFor="criarUsuario" className="font-medium">
            Criar usuário automaticamente
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-6">
          Se marcado, um usuário será criado e vinculado ao associado automaticamente. 
          Caso contrário, será enviado um email com link para criação de conta.
        </p>
      </div>
    </div>
  );
};
