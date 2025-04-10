
import React, { useState } from 'react';
import { Filter, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type FilterPeriod = 'start' | 'year' | 'month' | 'custom';
export type DateFilterType = 'dueDate' | 'paymentDate';
export type ChartGroup = 'month' | 'day';

export interface FinanceiroFilters {
  period: FilterPeriod;
  dateFilterType: DateFilterType;
  startDate?: Date | null;
  endDate?: Date | null;
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
      chartGroupBy: 'day',
      startDate: null,
      endDate: null,
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    toast.success('Filtros limpos com sucesso');
  };

  const handleFilterChange = (key: keyof FinanceiroFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== null && value !== undefined && value !== ''
  ).length;

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

              {/* Date Range Selector for Custom Period */}
              {filters.period === 'custom' && (
                <div className="mt-4 space-y-4">
                  {/* Start Date */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Data de início</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarRange className="mr-2 h-4 w-4" />
                          {filters.startDate ? format(filters.startDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.startDate || undefined}
                          onSelect={(date) => handleFilterChange('startDate', date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* End Date */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Data de término</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarRange className="mr-2 h-4 w-4" />
                          {filters.endDate ? format(filters.endDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.endDate || undefined}
                          onSelect={(date) => handleFilterChange('endDate', date)}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
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
