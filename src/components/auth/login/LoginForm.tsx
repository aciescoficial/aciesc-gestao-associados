
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecaptcha } from './hooks/useRecaptcha';
import { useLoginForm } from './hooks/useLoginForm';
import LoginFormFields from './components/LoginFormFields';
import ForgotPasswordFooter from './components/ForgotPasswordFooter';

interface LoginFormProps {
  onForgotPassword: () => void;
  recaptchaLoaded: boolean;
  setRecaptchaLoaded: (loaded: boolean) => void;
  setRecaptchaToken: (token: string) => void;
}

const LoginForm = ({ 
  onForgotPassword,
  recaptchaLoaded,
  setRecaptchaLoaded,
  setRecaptchaToken
}: LoginFormProps) => {
  const [recaptchaToken, setRecaptchaTokenLocal] = useState<string | null>(null);
  
  const {
    email,
    setEmail,
    password, 
    setPassword,
    isLoading,
    showPassword,
    setShowPassword,
    organizationType,
    setOrganizationType,
    handleSignIn,
    handleGoogleSignIn
  } = useLoginForm(onForgotPassword);

  // Initialize reCAPTCHA
  const { isEnabled } = useRecaptcha(
    'login-recaptcha', 
    recaptchaLoaded, 
    setRecaptchaLoaded, 
    (token: string) => {
      setRecaptchaTokenLocal(token);
      setRecaptchaToken(token);
    }
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSignIn(e, recaptchaToken);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Acesse sua conta para gerenciar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginFormFields
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          organizationType={organizationType}
          setOrganizationType={setOrganizationType}
          isLoading={isLoading}
          recaptchaLoaded={recaptchaLoaded}
          recaptchaToken={recaptchaToken}
          isRecaptchaEnabled={isEnabled}
          handleSubmit={handleFormSubmit}
          handleGoogleSignIn={handleGoogleSignIn}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <ForgotPasswordFooter onForgotPassword={onForgotPassword} />
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
