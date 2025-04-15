
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegisterForm } from './hooks/useRegisterForm';
import RegisterFormFields from './components/RegisterFormFields';

interface RegisterFormProps {
  recaptchaLoaded: boolean;
  setRecaptchaLoaded: (loaded: boolean) => void;
  setRecaptchaToken: (token: string) => void;
}

const RegisterForm = ({
  recaptchaLoaded,
  setRecaptchaLoaded,
  setRecaptchaToken
}: RegisterFormProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    isLoading,
    showPassword,
    setShowPassword,
    organizationType,
    setOrganizationType,
    handleSignUp
  } = useRegisterForm();

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSignUp(e);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>
          Crie uma nova conta para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterFormFields
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          name={name}
          setName={setName}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          organizationType={organizationType}
          setOrganizationType={setOrganizationType}
          isLoading={isLoading}
          recaptchaLoaded={false}
          recaptchaToken={null}
          isRecaptchaEnabled={false}
          handleSubmit={handleFormSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
