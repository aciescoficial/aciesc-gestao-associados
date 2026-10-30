
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ImportInstructions = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium mb-1">Instruções para Importação</h4>
          <p className="text-sm text-muted-foreground">
            Prepare seu arquivo CSV seguindo estas diretrizes para garantir uma importação bem-sucedida.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h5 className="font-medium text-sm">Campos Obrigatórios:</h5>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Razão Social</li>
            <li>Nome Fantasia</li>
            <li>CNPJ</li>
            <li>Responsável</li>
            <li>Email</li>
            <li>Telefone</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h5 className="font-medium text-sm">Campos Opcionais:</h5>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Endereço</li>
            <li>Cidade</li>
            <li>CEP</li>
            <li>Site</li>
            <li>Instagram</li>
            <li>WhatsApp</li>
          </ul>
        </div>
      </div>

      <div className="bg-muted/30 rounded p-4 text-sm">
        <p className="font-medium mb-2">Formato do Arquivo:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Use arquivos no formato CSV (valores separados por vírgula)</li>
          <li>A primeira linha deve conter os cabeçalhos das colunas</li>
          <li>Certifique-se de que os CNPJs estejam no formato correto</li>
          <li>Telefones devem incluir DDD</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportInstructions;
