
import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordFormProps {
  onBack: () => void;
  recaptchaLoaded: boolean;
}

const ForgotPasswordForm = ({ onBack, recaptchaLoaded }: ForgotPasswordFormProps) => {
  const { resetPassword } = useAuth();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!forgotPasswordEmail) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, informe seu e-mail.",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await resetPassword(forgotPasswordEmail);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao recuperar senha",
        description: error.message,
      });
    } else {
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      onBack();
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar Senha</CardTitle>
        <CardDescription>
          Informe seu e-mail para receber instruções de recuperação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">E-mail</Label>
            <Input 
              id="reset-email" 
              type="email" 
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar E-mail"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="ghost" 
          onClick={onBack}
        >
          Voltar para Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
