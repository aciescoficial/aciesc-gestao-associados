
import React from 'react';
import AprovacaoInteresse from './AprovacaoInteresse';
import FormularioInteresseEmbed from './FormularioInteresseEmbed';

const AprovacaoInteressePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Aprovação de Associados</h1>
      
      <div className="wp-notice-info mb-6">
        <p className="font-medium mb-1">Fluxo de aprovação:</p>
        <ol className="ml-4 list-decimal text-sm space-y-1">
          <li>Interessados preenchem o formulário no site</li>
          <li>Administrador analisa os dados e CRECI</li>
          <li>Se aprovado, gera link de pagamento pelo Asaas</li>
          <li>Após pagamento confirmado, usuário finaliza cadastro</li>
        </ol>
      </div>
      
      <FormularioInteresseEmbed />
      
      <AprovacaoInteresse />
    </div>
  );
};

export default AprovacaoInteressePage;
