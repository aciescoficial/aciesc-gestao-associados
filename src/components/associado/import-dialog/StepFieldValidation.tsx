
import React from "react";
import { ImportAssociadoData, ImportValidationData } from "../types";
import { ImportFieldValidation } from "../ImportFieldValidation";

interface StepFieldValidationProps {
  validationData: ImportValidationData[];
  setValidationData: (data: ImportValidationData[]) => void;
  importData: ImportAssociadoData[];
}

const StepFieldValidation: React.FC<StepFieldValidationProps> = ({
  validationData,
  setValidationData,
  importData
}) => (
  <ImportFieldValidation
    validationData={validationData}
    setValidationData={setValidationData}
    importData={importData}
  />
);

export default StepFieldValidation;
