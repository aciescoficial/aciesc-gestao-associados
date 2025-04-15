
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuthContext';
import { useToast } from "@/hooks/use-toast";
import { UserRole } from '@/components/usuarios/types';
import { useNavigate } from 'react-router-dom';

export const useLoginForm = (onForgotPassword: () => void) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [organizationType, setOrganizationType] = useState<UserRole>('user');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Tentando login com email:', email);
      
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos",
        });
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        
        let errorMessage = "Ocorreu um erro durante o login";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao entrar",
          description: errorMessage,
        });
      } else if (data) {
        console.log('Login bem sucedido');
        toast({
          title: "Login realizado",
          description: "Você foi autenticado com sucesso.",
        });
        
        navigate('/');
      }
    } catch (error: any) {
      console.error('Exception during login:', error);
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: error.message || "Ocorreu um erro durante o login",
      });
    } finally {
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
    onForgotPassword
  };
};
