
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const RecaptchaIntegrationGuide: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Integração no Login</h3>
        <p className="mb-4 text-muted-foreground">
          O reCAPTCHA já está configurado nas páginas de login e registro do sistema.
          Certifique-se de que as chaves configuradas estejam corretas e que o reCAPTCHA esteja ativado.
        </p>
        
        <h4 className="font-medium mt-6 mb-2">Códigos de Exemplo</h4>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
          {`// Exemplo de uso do reCAPTCHA em um componente
const { executeRecaptcha } = useRecaptcha();

// Ao enviar um formulário
const handleSubmit = async (event) => {
  event.preventDefault();
  
  // Obter token do reCAPTCHA
  const token = await executeRecaptcha();
  
  // Enviar token para verificação
  const response = await api.post('/verify-captcha', { token });
  
  if (response.success) {
    // Continuar com o processamento
  }
};`}
        </pre>
      </CardContent>
    </Card>
  );
};

export default RecaptchaIntegrationGuide;
