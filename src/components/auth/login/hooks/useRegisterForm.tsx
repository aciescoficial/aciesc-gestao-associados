
import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { UserRole } from '@/components/usuarios/types';
import { useNavigate } from 'react-router-dom';

export const useRegisterForm = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [organizationType, setOrganizationType] = useState<UserRole>('user');
  const [skipEmailVerification, setSkipEmailVerification] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }
    
    setIsLoading(true);
    setIsRateLimited(false);
    
    try {
      console.log("Tentando registrar com email:", email, "e tipo:", organizationType);
      
      const { success, error } = await signUp(email, password, name, {
        role: organizationType,
        skipEmailVerification
      });
      
      if (!success) {
        console.error("Signup error:", error);
        
        let errorMessage = error || "Erro ao criar conta";
        
        if (error?.includes('rate limit') || error?.includes('limite')) {
          setIsRateLimited(true);
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: errorMessage,
        });
      } else {
        toast({
          title: "Conta criada com sucesso",
          description: skipEmailVerification 
            ? "Sua conta foi criada. Você já pode fazer login."
            : "Sua conta foi criada. Verifique seu email para confirmar o cadastro.",
        });
        
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setOrganizationType('user');
        setSkipEmailVerification(false);
        
        navigate('/login?registered=true');
      }
    } catch (error: any) {
      console.error("Exception during signup:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao criar sua conta",
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
    skipEmailVerification,
    setSkipEmailVerification,
    isRateLimited,
    handleSignUp
  };
};
