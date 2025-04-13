
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface AprovacaoAlertasProps {
  showInstructions?: boolean;
}

const AprovacaoAlertas: React.FC<AprovacaoAlertasProps> = ({ showInstructions = true }) => {
  return (
    <>
      {showInstructions && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Instruções</AlertTitle>
          <AlertDescription>
            Avalie cada solicitação de interesse. Ao aprovar, será enviado um email com link para cadastro.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AprovacaoAlertas;
