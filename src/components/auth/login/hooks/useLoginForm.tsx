
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuthContext';
import { useToast } from "@/hooks/use-toast";
import { UserRole } from '@/components/usuarios/types';

export const useLoginForm = (onForgotPassword: () => void) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [organizationType, setOrganizationType] = useState<UserRole>('user');
  const { toast } = useToast();
  
  const handleSignIn = async (e: React.FormEvent, recaptchaToken: string | null = null) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Tentando login com email:', email, 'e token recaptcha:', recaptchaToken ? 'presente' : 'ausente');
      
      const options = recaptchaToken 
        ? { captchaToken: recaptchaToken } 
        : undefined;
      
      // Use captchaToken if provided
      const { error } = await signIn(email, password);
      
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
