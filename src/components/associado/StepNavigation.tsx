
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StepNavigationProps {
  currentStep: string;
  setActiveTab: (tab: string) => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep, 
  setActiveTab,
  isSubmitting = false,
  isLastStep = false
}) => {
  const getPreviousStep = () => {
    switch (currentStep) {
      case 'contato':
        return 'dados-pessoais';
      case 'endereco':
        return 'contato';
      case 'veiculo':
        return 'endereco';
      case 'financeiro':
        return 'veiculo';
      default:
        return currentStep;
    }
  };
  
  const getNextStep = () => {
    switch (currentStep) {
      case 'dados-pessoais':
        return 'contato';
      case 'contato':
        return 'endereco';
      case 'endereco':
        return 'veiculo';
      case 'veiculo':
        return 'financeiro';
      default:
        return currentStep;
    }
  };

  return (
    <div className="flex justify-between mt-6">
      {currentStep !== 'dados-pessoais' && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab(getPreviousStep())}
        >
          Anterior
        </Button>
      )}
      
      {!isLastStep ? (
        <div className={currentStep === 'dados-pessoais' ? 'ml-auto' : ''}>
          <Button
            type="button"
            onClick={() => setActiveTab(getNextStep())}
          >
            Próximo
          </Button>
        </div>
      ) : (
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Associado"
          )}
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
