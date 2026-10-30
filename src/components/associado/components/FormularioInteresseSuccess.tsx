
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface FormularioInteresseSuccessProps {
  onSubmitAnother: () => void;
  paymentUrl?: string;
}

const FormularioInteresseSuccess: React.FC<FormularioInteresseSuccessProps> = ({
  onSubmitAnother,
  paymentUrl
}) => {
  return (
    <div className="text-center p-6 bg-white rounded shadow-sm space-y-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Formulário Enviado com Sucesso!</h2>
      <p className="mb-4">Agradecemos seu interesse em se associar à ACIESC.</p>
      
      {paymentUrl ? (
        <Card className="p-4 border-green-200 bg-green-50">
          <h3 className="text-lg font-medium mb-2">Realize o pagamento para concluir sua associação</h3>
          <p className="mb-4">Clique no botão abaixo para acessar a página de pagamento.</p>
          <Button className="flex items-center gap-2" asChild>
            <a href={paymentUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Acessar Página de Pagamento
            </a>
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            Após o pagamento, você receberá um email com instruções para acessar sua conta.
          </p>
        </Card>
      ) : (
        <p className="mb-6">Um email de confirmação foi enviado para o endereço fornecido.</p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <Button onClick={onSubmitAnother} variant="outline">Enviar outro formulário</Button>
        <Button variant="outline" asChild>
          <a href="https://www.aciesc.com.br">Sair Agora</a>
        </Button>
      </div>
    </div>
  );
};

export default FormularioInteresseSuccess;
