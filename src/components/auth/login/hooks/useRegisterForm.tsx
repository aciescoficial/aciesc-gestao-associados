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
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [retryTimerId, setRetryTimerId] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (retryCountdown > 0) {
      const timerId = setTimeout(() => {
        setRetryCountdown(prev => prev - 1);
      }, 1000);
      setRetryTimerId(timerId);
      return () => clearTimeout(timerId);
    } else if (retryTimerId) {
      clearTimeout(retryTimerId);
      setRetryTimerId(null);
    }
  }, [retryCountdown]);

  useEffect(() => {
    return () => {
      if (retryTimerId) {
        clearTimeout(retryTimerId);
      }
    };
  }, []);

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
    
    try {
      console.log("Tentando registrar com email:", email, "e tipo:", organizationType);
      
      const { success, error } = await signUp(email, password, name, {
        role: organizationType,
        retryCount
      });
      
      if (!success && error != null) {
        console.error("Signup error:", error);
        
        type RateLimitError = {
          code?: string;
          retryAfter?: number | null;
          message?: string;
        };
        
        const typedError = error as RateLimitError;
        
        let errorMessage = "Erro ao criar conta";
        
        const isRateLimit = 
          (typedError.code === 'rate_limit') || 
          (typeof error === 'object' && 
           'message' in error && 
           (error as { message: string }).message.includes('rate limit'));
        
        if (isRateLimit) {
          setIsRateLimited(true);
          setRetryCount(prev => prev + 1);
          
          const retryTime = typedError.retryAfter ?? 60; // Default to 60 seconds
          
          setRetryCountdown(retryTime);
          
          toast({
            variant: "destructive",
            title: "Limite de tentativas excedido",
            description: `${typedError.message || errorMessage}. Tentativa: ${retryCount + 1}. Tente novamente em ${retryTime} segundos.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao criar conta",
            description: typedError.message || errorMessage,
          });
        }
      } else {
        setIsRateLimited(false);
        setRetryCount(0);
        
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada. Verifique seu email para confirmar o cadastro.",
        });
        
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setOrganizationType('user');
        
        navigate('/login?registered=true');
      }
    } catch (error: any) {
      console.error("Exception during signup:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error?.message || "Ocorreu um erro durante o cadastro",
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
    isRateLimited,
    retryCount,
    retryCountdown,
    handleSignUp
  };
};
