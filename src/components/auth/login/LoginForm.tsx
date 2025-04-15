
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoginForm } from './hooks/useLoginForm';
import LoginFormFields from './components/LoginFormFields';
import ForgotPasswordFooter from './components/ForgotPasswordFooter';

interface LoginFormProps {
  onForgotPassword: () => void;
}

const LoginForm = ({ 
  onForgotPassword
}: LoginFormProps) => {
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
    handleSignIn
  } = useLoginForm(onForgotPassword);

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSignIn(e, null);
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
          handleSubmit={handleFormSubmit}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <ForgotPasswordFooter onForgotPassword={onForgotPassword} />
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
