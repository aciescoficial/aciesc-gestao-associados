
import React from 'react';
import { Check } from 'lucide-react';

const EmptyInteresseState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Check className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-medium">Nenhum interessado pendente</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Não há solicitações de interesse aguardando aprovação no momento.
      </p>
    </div>
  );
};

export default EmptyInteresseState;

