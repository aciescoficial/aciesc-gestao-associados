
import React from "react";
import { ImportDialog as ImportDialogPopup } from "../ImportDialog";
import { ImportEmptyInfo } from "../importar/ImportEmptyInfo";
import { ImportAssociadoData, ImportValidationData } from "../types";

interface ImportarAssociadosDialogControllerProps {
  importData: ImportAssociadoData[];
  validationData: ImportValidationData[];
  setValidationData: (data: ImportValidationData[]) => void;
  isSubmitting: boolean;
  onConfirm: () => Promise<void>;
  onDialogClose: () => void;
}

export const ImportarAssociadosDialogController: React.FC<ImportarAssociadosDialogControllerProps> = ({
  importData,
  validationData,
  setValidationData,
  isSubmitting,
  onConfirm,
  onDialogClose
}) => {
  if (importData.length > 0) {
    return (
      <ImportDialogPopup
        open={true}
        onOpenChange={(open) => {
          if (!open) onDialogClose();
        }}
        importData={importData}
        validationData={validationData}
        setValidationData={setValidationData}
        isSubmitting={isSubmitting}
        onConfirm={onConfirm}
      />
    );
  }

  return <ImportEmptyInfo />;
};
