
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinanceiroRelatoriosFilterProps {
  onApplyFilters: () => void;
}

export const FinanceiroRelatoriosFilter: React.FC<FinanceiroRelatoriosFilterProps> = ({
  onApplyFilters
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('todos');
  const [dateFromFilter, setDateFromFilter] = useState<Date | undefined>(undefined);
  const [dateToFilter, setDateToFilter] = useState<Date | undefined>(undefined);
  const [valueMinFilter, setValueMinFilter] = useState<string>('');
  const [valueMaxFilter, setValueMaxFilter] = useState<string>('');

  const handleApplyFilters = () => {
    // In a real implementation, we would pass these filters to the parent component
    onApplyFilters();
  };

  const handleResetFilters = () => {
    setStatusFilter('todos');
    setPaymentMethodFilter('todos');
    setDateFromFilter(undefined);
    setDateToFilter(undefined);
    setValueMinFilter('');
    setValueMaxFilter('');
  };

  return (
    <div className="bg-muted/30 border rounded-md p-4 space-y-4">
      <h3 className="text-sm font-medium">Filtrar por:</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status filter */}
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Payment method filter */}
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Forma de pagamento</label>
          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="boleto">Boleto Bancário</SelectItem>
              <SelectItem value="pix">Pix</SelectItem>
              <SelectItem value="cartao">Cartão de Crédito</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Value range filter */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Valor mínimo</label>
            <Input
              type="number"
              placeholder="R$ 0,00"
              value={valueMinFilter}
              onChange={(e) => setValueMinFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Valor máximo</label>
            <Input
              type="number"
              placeholder="R$ 9.999,99"
              value={valueMaxFilter}
              onChange={(e) => setValueMaxFilter(e.target.value)}
            />
          </div>
        </div>
        
        {/* Date range filter */}
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">De</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFromFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFromFilter ? format(dateFromFilter, 'dd/MM/yyyy') : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFromFilter}
                onSelect={setDateFromFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Até</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateToFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateToFilter ? format(dateToFilter, 'dd/MM/yyyy') : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateToFilter}
                onSelect={setDateToFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleResetFilters}>
          Limpar filtros
        </Button>
        <Button onClick={handleApplyFilters}>
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
};
