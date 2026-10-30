
import React from 'react';
import { Card } from '@/components/ui/card';
import CodigoIncorporacao from '@/components/associado/components/CodigoIncorporacao';

const FormEmbed: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Código de Incorporação do Formulário</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Configure e obtenha o código de incorporação do formulário de interesse para novos associados.
      </p>
      <CodigoIncorporacao />
    </Card>
  );
};

export default FormEmbed;
