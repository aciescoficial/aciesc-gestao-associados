
import React from "react";
import { ImportFileSelector } from "../importar/ImportFileSelector";

interface ImportarAssociadosHeaderProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportClick: () => void;
  isAdmin: boolean;
  onBack: () => void;
}

export const ImportarAssociadosHeader: React.FC<ImportarAssociadosHeaderProps> = ({
  fileInputRef,
  onFileChange,
  onImportClick,
  isAdmin,
  onBack
}) => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Importar Associados</h1>
    <ImportFileSelector
      fileInputRef={fileInputRef}
      onFileChange={onFileChange}
      onImportClick={onImportClick}
      isAdmin={isAdmin}
      onBack={onBack}
    />
  </div>
);
