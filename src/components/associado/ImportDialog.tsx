
// refactored version with step components
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImportAssociadoData, ImportValidationData } from './types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Check, Loader2 } from 'lucide-react';

// Step components
import StepFieldValidation from './import-dialog/StepFieldValidation';
import StepPreview from './import-dialog/StepPreview';
import StepUserConfig from './import-dialog/StepUserConfig';
import StepSummary from './import-dialog/StepSummary';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importData: ImportAssociadoData[];
  validationData: ImportValidationData[];
  setValidationData: (data: ImportValidationData[]) => void;
  isSubmitting: boolean;
  onConfirm: () => Promise<void>;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onOpenChange,
  importData,
  validationData,
  setValidationData,
  isSubmitting,
  onConfirm
}) => {
  const [activeStep, setActiveStep] = useState<string>("step1");
  const [criarUsuarios, setCriarUsuarios] = useState<boolean>(() => {
    const saved = localStorage.getItem('importarCriarUsuarios');
    return saved === 'true';
  });
  const [validationChecked, setValidationChecked] = useState<boolean>(false);

  // Reset step when dialog opens
  useEffect(() => {
    if (open) {
      setActiveStep("step1");
      setValidationChecked(false);
    }
  }, [open]);

  // Save criarUsuarios preference to localStorage
  useEffect(() => {
    localStorage.setItem('importarCriarUsuarios', criarUsuarios ? 'true' : 'false');
  }, [criarUsuarios]);

  const totalSteps = 4;
  const currentStepNumber = parseInt(activeStep.replace('step', ''));
  const progressValue = (currentStepNumber / totalSteps) * 100;

  // Validation: consider ignored fields as valid
  const isValidationValid = validationData.every(v => v.isValid || v.ignored);

  // Check for critical fields (nome, sobrenome, email, cpf, cidade, celular)
  const criticalFields = ["nome", "sobrenome", "email", "cpf", "cidade", "celular"];
  const hasAllCriticalFields = criticalFields.every(field => {
    const fieldValidation = validationData.find(v => v.fieldName === field);
    return fieldValidation && !fieldValidation.ignored && fieldValidation.isValid;
  });

  const validateStep1 = () => {
    setValidationChecked(true);
    
    if (!isValidationValid) {
      return false;
    }
    
    if (!hasAllCriticalFields) {
      // The user can still proceed, but we should warn them
      const missingFields = criticalFields.filter(field => {
        const fieldValidation = validationData.find(v => v.fieldName === field);
        return !fieldValidation || fieldValidation.ignored || !fieldValidation.isValid;
      });
      
      console.warn("Missing critical fields:", missingFields);
    }
    
    return true;
  };

  const goToNextStep = () => {
    if (currentStepNumber === 1 && !validateStep1()) {
      return;
    }
    
    const nextStep = `step${currentStepNumber + 1}`;
    setActiveStep(nextStep);
  };

  const goToPreviousStep = () => {
    const prevStep = `step${currentStepNumber - 1}`;
    setActiveStep(prevStep);
  };

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar Associados</DialogTitle>
          <DialogDescription>
            Siga as etapas para importar seus associados.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Etapa {currentStepNumber} de {totalSteps}</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full h-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="step1" disabled={isSubmitting}>
                <span className="flex items-center gap-2">
                  {currentStepNumber > 1 && <Check size={16} className="text-green-500" />}
                  1. Validação de Campos
                </span>
              </TabsTrigger>
              <TabsTrigger value="step2" disabled={!isValidationValid || isSubmitting}>
                <span className="flex items-center gap-2">
                  {currentStepNumber > 2 && <Check size={16} className="text-green-500" />}
                  2. Pré-visualização
                </span>
              </TabsTrigger>
              <TabsTrigger value="step3" disabled={!isValidationValid || isSubmitting}>
                <span className="flex items-center gap-2">
                  {currentStepNumber > 3 && <Check size={16} className="text-green-500" />}
                  3. Configurar Usuários
                </span>
              </TabsTrigger>
              <TabsTrigger value="step4" disabled={!isValidationValid || isSubmitting}>
                <span className="flex items-center gap-2">
                  {currentStepNumber > 3 && <Check size={16} className="text-green-500" />}
                  4. Confirmar Importação
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 180px)' }}>
              <TabsContent value="step1" className="m-0">
                <StepFieldValidation
                  validationData={validationData}
                  setValidationData={setValidationData}
                  importData={importData}
                />
                
                {validationChecked && !isValidationValid && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded-md">
                    <p className="text-sm font-medium">
                      Alguns campos apresentam problemas de validação. 
                      Marque-os como "Ignorar" ou corrija os dados antes de prosseguir.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="step2" className="m-0">
                <StepPreview
                  importData={importData}
                  validationData={validationData}
                />
              </TabsContent>

              <TabsContent value="step3" className="m-0">
                <StepUserConfig
                  criarUsuarios={criarUsuarios}
                  setCriarUsuarios={setCriarUsuarios}
                />
              </TabsContent>

              <TabsContent value="step4" className="m-0">
                <StepSummary
                  importData={importData}
                  criarUsuarios={criarUsuarios}
                  validationData={validationData}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-4 mt-2">
          <div>
            {currentStepNumber > 1 && (
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isSubmitting}
              >
                Voltar
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>

            {currentStepNumber < totalSteps ? (
              <Button
                onClick={goToNextStep}
                disabled={currentStepNumber === 1 && !isValidationValid || isSubmitting}
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="min-w-[180px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Importando...
                  </span>
                ) : (
                  `Importar ${importData.length} Registros`
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
