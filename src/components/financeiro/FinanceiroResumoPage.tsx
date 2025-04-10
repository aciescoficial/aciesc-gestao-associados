
import React, { useState } from 'react';
import { Users, Receipt, DollarSign, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { formatCurrency } from './utils';
import { type ChartData, type FinancialSummary } from './types';
import FinanceiroResumoFilter, { FinanceiroFilters } from './FinanceiroResumoFilter';

const FinanceiroResumoPage: React.FC = () => {
  // This would typically come from an API or database
  const [summaryData] = useState<FinancialSummary>({
    clients: { total: 19, defaulters: 0 },
    bills: { expected: 24, overdue: 0, received: 3 },
    revenue: { expected: 45514.23, confirmed: 967.23, received: 5787.00 }
  });

  // Mock chart data
  const [chartData] = useState<ChartData[]>([
    { date: '01/Abr/2025', expected: 0, received: 0 },
    { date: '03/Abr/2025', expected: 0, received: 1500 },
    { date: '05/Abr/2025', expected: 0, received: 1800 },
    { date: '07/Abr/2025', expected: 0, received: 0 },
    { date: '09/Abr/2025', expected: 1800, received: 2900 },
    { date: '11/Abr/2025', expected: 0, received: 0 },
    { date: '13/Abr/2025', expected: 0, received: 0 },
    { date: '15/Abr/2025', expected: 2000, received: 7000 },
    { date: '17/Abr/2025', expected: 0, received: 0 },
    { date: '19/Abr/2025', expected: 0, received: 12500 },
    { date: '21/Abr/2025', expected: 0, received: 0 },
    { date: '23/Abr/2025', expected: 0, received: 0 },
    { date: '25/Abr/2025', expected: 0, received: 2800 },
    { date: '27/Abr/2025', expected: 0, received: 3800 },
    { date: '29/Abr/2025', expected: 0, received: 0 },
  ]);

  const [filters, setFilters] = useState<FinanceiroFilters>({
    period: 'month',
    dateFilterType: 'dueDate',
    chartGroupBy: 'day',
  });

  const handleApplyFilters = (newFilters: FinanceiroFilters) => {
    setFilters(newFilters);
    // Aqui seria feita uma chamada à API para buscar dados filtrados
    console.log('Filtros aplicados:', newFilters);
  };

  // Function to open links in new windows/tabs
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Resumo Financeiro</h1>
      </div>

      <FinanceiroResumoFilter onApplyFilters={handleApplyFilters} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conveniados Section (antes era Clientes) */}
        <div className="wp-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-gray-500" />
              Conveniados
            </h2>
          </div>

          <div className="space-y-4">
            {/* EM DIA - Now clickable */}
            <div 
              className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => openInNewTab('/conveniados/listar?status=ativo')}
            >
              <div className="text-xs text-gray-500 mb-1">EM DIA</div>
              <div className="text-5xl font-bold text-green-500">
                {summaryData.clients.total}
              </div>
            </div>

            {/* INADIMPLENTES - Now clickable */}
            <div 
              className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => openInNewTab('/conveniados/listar?status=inadimplente')}
            >
              <div className="text-xs text-gray-500 mb-1">INADIMPLENTES</div>
              <div className="text-5xl font-bold text-red-600">
                {summaryData.clients.defaulters}
              </div>
            </div>
          </div>
        </div>

        {/* Cobranças Section */}
        <div className="wp-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-gray-500" />
              Cobranças
            </h2>
          </div>

          <div className="space-y-4">
            {/* PREVISTAS - Now clickable */}
            <div 
              className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => openInNewTab('/financeiro/cobrancas?status=prevista')}
            >
              <div className="text-xs text-gray-500 mb-1">PREVISTAS</div>
              <div className="text-5xl font-bold text-amber-500">
                {summaryData.bills.expected}
              </div>
            </div>

            {/* VENCIDAS - Now clickable */}
            <div 
              className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => openInNewTab('/financeiro/cobrancas?status=vencida')}
            >
              <div className="text-xs text-gray-500 mb-1">VENCIDAS</div>
              <div className="text-5xl font-bold text-red-600">
                {summaryData.bills.overdue}
              </div>
            </div>

            {/* RECEBIDAS - Now clickable */}
            <div 
              className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => openInNewTab('/financeiro/cobrancas?status=recebida')}
            >
              <div className="text-xs text-gray-500 mb-1">RECEBIDAS</div>
              <div className="text-5xl font-bold text-green-500">
                {summaryData.bills.received}
              </div>
            </div>
          </div>
        </div>

        {/* Faturamento Section */}
        <div className="wp-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
              Faturamento
            </h2>
          </div>

          <div className="space-y-4">
            {/* PREVISTO */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-xs text-gray-500 mb-1">PREVISTO</div>
              <div className="text-3xl font-bold text-amber-500 flex items-center">
                <span className="text-sm mr-1">R$</span>
                {new Intl.NumberFormat('pt-BR').format(summaryData.revenue.expected)}
              </div>
            </div>

            {/* CONFIRMADO */}
            <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-1">CONFIRMADO</div>
                <div className="text-3xl font-bold text-blue-800 flex items-center">
                  <span className="text-sm mr-1">R$</span>
                  {new Intl.NumberFormat('pt-BR').format(summaryData.revenue.confirmed)}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>

            {/* RECEBIDO */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-xs text-gray-500 mb-1">RECEBIDO</div>
              <div className="text-3xl font-bold text-green-500 flex items-center">
                <span className="text-sm mr-1">R$</span>
                {new Intl.NumberFormat('pt-BR').format(summaryData.revenue.received)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="wp-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
            Faturamento
          </h2>
        </div>

        <div className="h-72">
          <ChartContainer
            config={{
              expected: {
                label: "Previsto",
                theme: {
                  light: "#2c3e50",
                  dark: "#2c3e50"
                }
              },
              received: {
                label: "Recebido",
                theme: {
                  light: "#f39c12",
                  dark: "#f39c12"
                }
              }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 15, right: 25, bottom: 35, left: 25 }}
              >
                <defs>
                  <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2c3e50" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2c3e50" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f39c12" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f39c12" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickMargin={10}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickMargin={10}
                  tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          className="text-xs"
                          labelClassName="text-xs font-normal"
                          nameKey="name"
                          labelKey="date"
                          formatter={(value, name) => {
                            return [
                              `R$ ${formatCurrency(value as number).replace("R$", "")}`,
                              name === "expected" ? "Previsto" : "Recebido"
                            ];
                          }}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="expected"
                  name="expected"
                  stackId="1"
                  stroke="#2c3e50"
                  fill="url(#colorExpected)"
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="received"
                  name="received"
                  stackId="2"
                  stroke="#f39c12"
                  fill="url(#colorReceived)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default FinanceiroResumoPage;
