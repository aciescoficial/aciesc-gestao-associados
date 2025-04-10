
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { toast } from 'sonner';

export type FilterPeriod = 'start' | 'year' | 'month' | 'custom';
export type DateFilterType = 'dueDate' | 'paymentDate';
export type BillingType = 'all' | 'subscription' | 'oneTime';
export type CashInclude = 'yes' | 'no';
export type ChartGroup = 'month' | 'day';

export interface FinanceiroFilters {
  period: FilterPeriod;
  dateFilterType: DateFilterType;
  billingType: BillingType;
  includeCash: CashInclude;
  chartGroupBy: ChartGroup;
}

interface FinanceiroResumoFilterProps {
  onApplyFilters: (filters: FinanceiroFilters) => void;
}

const FinanceiroResumoFilter: React.FC<FinanceiroResumoFilterProps> = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FinanceiroFilters>({
    period: 'month',
    dateFilterType: 'dueDate',
    billingType: 'all',
    includeCash: 'no',
    chartGroupBy: 'day',
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    toast.success('Filtros aplicados com sucesso');
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const defaultFilters: FinanceiroFilters = {
      period: 'month',
      dateFilterType: 'dueDate',
      billingType: 'all',
      includeCash: 'no',
      chartGroupBy: 'day',
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    toast.success('Filtros limpos com sucesso');
  };

  const handleFilterChange = (key: keyof FinanceiroFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={16} />
        <span>Filtros ({activeFiltersCount})</span>
      </Button>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="border rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Período de exibição */}
            <div>
              <h3 className="text-sm font-medium mb-4">Selecione o período de exibição</h3>
              <RadioGroup 
                value={filters.period} 
                onValueChange={(value) => handleFilterChange('period', value as FilterPeriod)}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="start" id="period-start" />
                  <label htmlFor="period-start">Desde o início</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="year" id="period-year" />
                  <label htmlFor="period-year">Este ano</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="month" id="period-month" />
                  <label htmlFor="period-month">Este mês</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="period-custom" />
                  <label htmlFor="period-custom">Personalizado</label>
                </div>
              </RadioGroup>
            </div>

            {/* Filtrar por data */}
            <div>
              <h3 className="text-sm font-medium mb-4">Filtrar por data</h3>
              <Select 
                value={filters.dateFilterType} 
                onValueChange={(value) => handleFilterChange('dateFilterType', value as DateFilterType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar tipo de data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Data de vencimento</SelectItem>
                  <SelectItem value="paymentDate">Data de pagamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipos de cobrança */}
            <div>
              <h3 className="text-sm font-medium mb-4">Tipos de cobrança</h3>
              <Select 
                value={filters.billingType} 
                onValueChange={(value) => handleFilterChange('billingType', value as BillingType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar tipo de cobrança" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="subscription">Assinaturas</SelectItem>
                  <SelectItem value="oneTime">Cobranças avulsas</SelectItem>
                </SelectContent>
              </Select>

              <h3 className="text-sm font-medium mt-6 mb-4">Incluir recebimento em dinheiro</h3>
              <Select 
                value={filters.includeCash} 
                onValueChange={(value) => handleFilterChange('includeCash', value as CashInclude)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Incluir recebimento em dinheiro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Sim</SelectItem>
                  <SelectItem value="no">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Agrupar gráfico */}
            <div>
              <h3 className="text-sm font-medium mb-4">Agrupar gráfico de faturamento</h3>
              <RadioGroup 
                value={filters.chartGroupBy} 
                onValueChange={(value) => handleFilterChange('chartGroupBy', value as ChartGroup)}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="month" id="chart-month" />
                  <label htmlFor="chart-month">Por mês</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="day" id="chart-day" />
                  <label htmlFor="chart-day">Por dia</label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
            >
              Limpar filtros
            </Button>
            <Button 
              onClick={handleApplyFilters}
            >
              Aplicar {activeFiltersCount} filtros
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FinanceiroResumoFilter;
