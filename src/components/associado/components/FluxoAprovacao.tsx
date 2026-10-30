
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const FluxoAprovacao: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Fluxo de Associação à ACIESC</h2>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="bg-gray-50 p-4 rounded-lg text-center w-full md:w-1/4">
          <div className="bg-primary/10 rounded-full p-3 inline-flex mb-2">
            <span className="text-primary font-bold text-lg">1</span>
          </div>
          <h3 className="font-medium mb-2">Cadastro de Interesse</h3>
          <p className="text-sm text-gray-600">Corretor preenche formulário com dados pessoais e aceita termos</p>
        </div>
        
        <ArrowRight className="hidden md:block text-gray-400" />
        
        <div className="bg-gray-50 p-4 rounded-lg text-center w-full md:w-1/4">
          <div className="bg-primary/10 rounded-full p-3 inline-flex mb-2">
            <span className="text-primary font-bold text-lg">2</span>
          </div>
          <h3 className="font-medium mb-2">Geração de Pagamento</h3>
          <p className="text-sm text-gray-600">Sistema gera automaticamente link de pagamento</p>
        </div>
        
        <ArrowRight className="hidden md:block text-gray-400" />
        
        <div className="bg-gray-50 p-4 rounded-lg text-center w-full md:w-1/4">
          <div className="bg-primary/10 rounded-full p-3 inline-flex mb-2">
            <span className="text-primary font-bold text-lg">3</span>
          </div>
          <h3 className="font-medium mb-2">Pagamento</h3>
          <p className="text-sm text-gray-600">Corretor efetua o pagamento da anuidade</p>
        </div>
        
        <ArrowRight className="hidden md:block text-gray-400" />
        
        <div className="bg-gray-50 p-4 rounded-lg text-center w-full md:w-1/4">
          <div className="bg-primary/10 rounded-full p-3 inline-flex mb-2">
            <span className="text-primary font-bold text-lg">4</span>
          </div>
          <h3 className="font-medium mb-2">Confirmação</h3>
          <p className="text-sm text-gray-600">Pagamento confirmado e usuário ativo no sistema</p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium mb-2 text-blue-700">Notas sobre o Processo:</h3>
        <ul className="list-disc pl-5 space-y-1 text-blue-700">
          <li>Todo o processo é automatizado, sem necessidade de aprovação manual</li>
          <li>A criação do usuário ocorre imediatamente após o envio do formulário</li>
          <li>O acesso completo ao sistema é liberado após a confirmação do pagamento</li>
          <li>O administrador pode verificar os pagamentos pendentes na aba "Pagamentos Pendentes"</li>
        </ul>
      </div>
    </Card>
  );
};

export default FluxoAprovacao;
