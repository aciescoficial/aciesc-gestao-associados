
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegisterForm } from './hooks/useRegisterForm';
import RegisterFormFields from './components/RegisterFormFields';

const RegisterForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    isLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordsMatch,
    organizationType,
    setOrganizationType,
    isRateLimited,
    retryCount,
    retryCountdown,
    handleSignUp
  } = useRegisterForm();

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSignUp(e);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo cadastro</CardTitle>
        <CardDescription>
          Crie uma conta para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterFormFields
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          name={name}
          setName={setName}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          passwordsMatch={passwordsMatch}
          organizationType={organizationType}
          setOrganizationType={setOrganizationType}
          isRateLimited={isRateLimited}
          retryCount={retryCount}
          retryCountdown={retryCountdown}
          isLoading={isLoading}
          handleSubmit={handleFormSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
