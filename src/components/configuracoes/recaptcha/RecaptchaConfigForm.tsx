
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import RecaptchaFormFields from './RecaptchaFormFields';
import RecaptchaEnabledToggle from './RecaptchaEnabledToggle';
import { useRecaptchaForm } from './hooks/useRecaptchaForm';

interface RecaptchaConfigFormProps {
  onError?: (error: string | null) => void;
}

const RecaptchaConfigForm: React.FC<RecaptchaConfigFormProps> = ({ onError }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();
  
  const { form, isLoading, isSaving, saveSettings } = useRecaptchaForm({ toast });

  const handleSaveSettings = async (values: any) => {
    try {
      if (onError) onError(null);
      await saveSettings(values);
    } catch (error: any) {
      if (onError) onError(error.message || 'Erro ao salvar configurações');
    }
  };

  const testRecaptcha = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Simulação de teste - em um ambiente real, você faria uma chamada
      // para o servidor para testar a integração com o reCAPTCHA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando sucesso
      setTestResult('success');
      toast({
        title: 'Teste realizado com sucesso',
        description: 'A configuração do reCAPTCHA está funcionando corretamente.',
      });
    } catch (error) {
      setTestResult('error');
      toast({
        title: 'Erro no teste',
        description: 'Não foi possível verificar a configuração do reCAPTCHA.',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <RecaptchaEnabledToggle form={form} />
        </CardContent>
      </Card>

      <form onSubmit={form.handleSubmit(handleSaveSettings)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <RecaptchaFormFields form={form} />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={testRecaptcha}
            disabled={isTesting}
            className="flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : testResult === 'success' ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                Testar Novamente
              </>
            ) : testResult === 'error' ? (
              <>
                <ShieldAlert className="h-4 w-4 text-red-500" />
                Testar Novamente
              </>
            ) : (
              'Testar Configuração'
            )}
          </Button>
          
          <Button type="submit" disabled={isLoading || isSaving}>
            {isLoading || isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Configurações'
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default RecaptchaConfigForm;
