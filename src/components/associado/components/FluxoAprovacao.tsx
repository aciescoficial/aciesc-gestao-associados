
import React from 'react';
import { Info, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';

const FluxoAprovacao: React.FC = () => {
  return (
    <div className="wp-card">
      <h2 className="text-xl font-semibold mb-4">Fluxo de Aprovação de Associados</h2>
      
      <div className="wp-notice-info mb-6">
        <p className="font-medium mb-1">Como funciona o fluxo de aprovação:</p>
        <ol className="ml-4 list-decimal text-sm space-y-2">
          <li>Interessados preenchem o formulário no site</li>
          <li>Administrador analisa os dados e CRECI</li>
          <li>Se aprovado, gera link de pagamento pelo Asaas</li>
          <li>Após pagamento confirmado, usuário finaliza cadastro</li>
        </ol>
      </div>
      
      <div className="hidden md:flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center mb-2">
            <Info className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium">Formulário</h3>
          </div>
          <p className="text-sm">Interessado preenche formulário com dados pessoais e motivo do interesse</p>
        </div>
        
        <div className="w-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        <div className="flex-1 border rounded-lg p-4 bg-yellow-50">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="font-medium">Análise</h3>
          </div>
          <p className="text-sm">Administrador analisa dados, valida documentos e toma decisão</p>
        </div>
        
        <div className="w-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        <div className="flex-1 border rounded-lg p-4 bg-purple-50">
          <div className="flex items-center mb-2">
            <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="font-medium">Pagamento</h3>
          </div>
          <p className="text-sm">Envio de link de pagamento e confirmação da transação</p>
        </div>
        
        <div className="w-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        <div className="flex-1 border rounded-lg p-4 bg-green-50">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium">Finalização</h3>
          </div>
          <p className="text-sm">Usuário completa o cadastro com dados complementares</p>
        </div>
      </div>
      
      {/* Versão mobile do fluxo */}
      <div className="md:hidden space-y-4">
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">1. Formulário</h3>
            </div>
          </div>
          <p className="text-sm">Interessado preenche formulário com dados pessoais e motivo do interesse</p>
        </div>
        
        <div className="border rounded-lg p-4 bg-yellow-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium">2. Análise</h3>
            </div>
          </div>
          <p className="text-sm">Administrador analisa dados, valida documentos e toma decisão</p>
        </div>
        
        <div className="border rounded-lg p-4 bg-purple-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="font-medium">3. Pagamento</h3>
            </div>
          </div>
          <p className="text-sm">Envio de link de pagamento e confirmação da transação</p>
        </div>
        
        <div className="border rounded-lg p-4 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="font-medium">4. Finalização</h3>
            </div>
          </div>
          <p className="text-sm">Usuário completa o cadastro com dados complementares</p>
        </div>
      </div>
    </div>
  );
};

export default FluxoAprovacao;
