
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuthContext';
import { useToast } from "@/hooks/use-toast";
import { UserRole } from '@/components/usuarios/types';

interface LoginFormOptions {
  captchaToken?: string;
}

export const useLoginForm = (onForgotPassword: () => void) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [organizationType, setOrganizationType] = useState<UserRole>('user');
  const { toast } = useToast();
  
  const handleSignIn = async (e: React.FormEvent, recaptchaToken: string | null) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add reCAPTCHA token to options if available
      const options: LoginFormOptions | undefined = recaptchaToken ? { 
        captchaToken: recaptchaToken 
      } : undefined;
      
      // Pass email and password, with options as the second argument
      const { error } = await signIn(email, password, options);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao entrar",
          description: error.message,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: error.message || "Ocorreu um erro durante o login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // signInWithGoogle doesn't accept parameters in this implementation
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao entrar com Google",
          description: error.message,
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar com Google",
        description: error.message || "Ocorreu um erro durante o login com Google",
      });
      setIsLoading(false);
    }
    // No need to set isLoading to false on success as user will be redirected
  };

  return {
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
    handleGoogleSignIn,
    onForgotPassword
  };
};
