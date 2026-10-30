
import React from "react";
import { ImportPreviewTable } from "../ImportPreviewTable";
import { ImportAssociadoData, ImportValidationData } from "../types";

interface StepPreviewProps {
  importData: ImportAssociadoData[];
  validationData: ImportValidationData[];
}

const StepPreview: React.FC<StepPreviewProps> = ({ importData, validationData }) => (
  <ImportPreviewTable
    importData={importData}
    validationData={validationData}
  />
);

export default StepPreview;
