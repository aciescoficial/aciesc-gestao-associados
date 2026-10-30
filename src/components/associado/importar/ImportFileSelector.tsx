
import React from "react";
import { Button } from "@/components/ui/button";

interface ImportFileSelectorProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportClick: () => void;
  isAdmin: boolean;
  onBack: () => void;
}

export const ImportFileSelector: React.FC<ImportFileSelectorProps> = ({
  fileInputRef,
  onFileChange,
  onImportClick,
  isAdmin,
  onBack,
}) => (
  <div className="flex flex-col md:flex-row gap-4 mb-6">
    <input
      type="file"
      ref={fileInputRef}
      onChange={onFileChange}
      accept=".csv"
      className="hidden"
    />
    <Button onClick={onImportClick} className="w-full md:w-auto">
      Selecionar arquivo CSV
    </Button>
    <Button variant="outline" onClick={onBack}>
      Voltar
    </Button>
  </div>
);
