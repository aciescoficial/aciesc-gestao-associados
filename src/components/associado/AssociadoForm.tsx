
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DadosPessoaisForm } from "./DadosPessoaisForm";
import { EnderecoForm } from "./EnderecoForm";
import { ContatoForm } from "./ContatoForm";
import { FinanceiroForm } from "./FinanceiroForm";
import { VeiculoForm } from "./VeiculoForm";
import FormNavigationTabs from './FormNavigationTabs';
import StepNavigation from './StepNavigation';
import { useAssociadoForm } from './hooks/useAssociadoForm';

const AssociadoForm: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    submitting,
    fotoPreview,
    form,
    handleFotoUpload,
    handleFotoRemove,
    handleFormSubmit
  } = useAssociadoForm();
  
  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <FormNavigationTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <TabsContent value="dados-pessoais">
          <DadosPessoaisForm 
            form={form} 
            fotoPreview={fotoPreview}
            onFotoUpload={handleFotoUpload}
            onFotoRemove={handleFotoRemove}
          />
          
          <StepNavigation 
            currentStep="dados-pessoais" 
            setActiveTab={setActiveTab} 
          />
        </TabsContent>
        
        <TabsContent value="contato">
          <ContatoForm form={form} />
          
          <StepNavigation 
            currentStep="contato" 
            setActiveTab={setActiveTab} 
          />
        </TabsContent>
        
        <TabsContent value="endereco">
          <EnderecoForm form={form} />
          
          <StepNavigation 
            currentStep="endereco" 
            setActiveTab={setActiveTab} 
          />
        </TabsContent>
        
        <TabsContent value="veiculo">
          <VeiculoForm form={form} />
          
          <StepNavigation 
            currentStep="veiculo" 
            setActiveTab={setActiveTab} 
          />
        </TabsContent>
        
        <TabsContent value="financeiro">
          <FinanceiroForm form={form} />
          
          <StepNavigation 
            currentStep="financeiro" 
            setActiveTab={setActiveTab} 
            isSubmitting={submitting}
            isLastStep={true}
          />
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default AssociadoForm;
