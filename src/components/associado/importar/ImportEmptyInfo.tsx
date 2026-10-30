
import React from "react";
import { ImportCsvInstructions } from "./ImportCsvInstructions";

export const ImportEmptyInfo: React.FC = () => (
  <div className="bg-muted/50 rounded-md p-6 text-center">
    <h2 className="text-xl font-semibold mb-2">Importação de Associados</h2>
    <p className="text-muted-foreground mb-4">
      Selecione um arquivo CSV com os dados dos associados para importar.
    </p>
    <ImportCsvInstructions />
  </div>
);
