
// Refactored for maintainability: logic & UI splitted into hooks and components.

import React from "react";
import { useImportAssociados } from "./hooks/useImportAssociados";
import { ImportarAssociadosHeader } from "./ImportarAssociadosHeader";
import { ImportarAssociadosDialogController } from "./ImportarAssociadosDialogController";

const ImportarAssociadosPage: React.FC = () => {
  const {
    importData,
    validationData,
    isSubmitting,
    fileInputRef,
    isAdmin,
    handleImportClick,
    handleFileChange,
    handleConfirmImport,
    resetImport,
    setValidationData,
    navigate
  } = useImportAssociados();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ImportarAssociadosHeader
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onImportClick={handleImportClick}
        isAdmin={isAdmin}
        onBack={() => navigate("/associados/cadastro")}
      />
      <ImportarAssociadosDialogController
        importData={importData}
        validationData={validationData}
        setValidationData={setValidationData}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmImport}
        onDialogClose={resetImport}
      />
    </div>
  );
};

export default ImportarAssociadosPage;
