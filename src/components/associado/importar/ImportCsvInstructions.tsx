
import React from "react";

// Guidance on CSV columns for import
export const ImportCsvInstructions: React.FC = () => (
  <div className="text-sm text-muted-foreground mt-6 max-w-lg mx-auto text-left">
    <h3 className="font-medium mb-2">Formato esperado (colunas):</h3>
    <ul className="list-disc list-inside space-y-1">
      <li>Nome, Sobrenome, CPF (campos obrigatórios)</li>
      <li>Email, Celular (recomendados para contato)</li>
      <li>CRECI-SC (para corretores)</li>
      <li>Cidade, Estado, CEP, Rua, etc (para endereço)</li>
      <li>Placa Principal, Placa Secundária (para veículos)</li>
    </ul>
  </div>
);
