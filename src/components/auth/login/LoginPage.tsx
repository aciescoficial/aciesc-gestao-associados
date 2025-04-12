
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useToast } from "@/hooks/use-toast";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

// Declare global Google reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, parameters: any) => number;
    };
    onRecaptchaLoad: () => void;
  }
}

const LoginPage = () => {
  const { user } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-wp-body p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ACIESC</h1>
          <p className="text-muted-foreground">Gestão de Associados</p>
        </div>

        {showForgotPassword ? (
          <ForgotPasswordForm 
            onBack={() => setShowForgotPassword(false)} 
            recaptchaLoaded={recaptchaLoaded}
          />
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                onForgotPassword={() => setShowForgotPassword(true)} 
                recaptchaLoaded={recaptchaLoaded}
                setRecaptchaLoaded={setRecaptchaLoaded}
                setRecaptchaToken={setRecaptchaToken}
              />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm 
                recaptchaLoaded={recaptchaLoaded}
                setRecaptchaLoaded={setRecaptchaLoaded}
                setRecaptchaToken={setRecaptchaToken}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
