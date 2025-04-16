
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuthContext';
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

  // Check if passwords match whenever either password field changes
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!name || !email || !password) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
      });
      return;
    }

    // Validate password strength
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
      
      // Call the signUp function from auth service
      const { data, error } = await signUp(email, password, name, organizationType, skipEmailVerification);
      
      if (error) {
        console.error("Signup error:", error);
        
        let errorMessage = error.message || "Erro ao criar conta";
        
        if (error.message?.includes('already registered') || error.message?.includes('já está registrado')) {
          errorMessage = "Este email já está registrado. Tente fazer login.";
        } else if (error.message?.includes('rate limit') || error.message?.includes('limite') || error.code === 'rate_limit' || error.status === 429) {
          errorMessage = "Limite de cadastros excedido. Por favor, tente novamente mais tarde.";
          setIsRateLimited(true);
        } else if (error.message?.includes('violates row-level security') || error.message?.includes('policy')) {
          errorMessage = "Erro de permissão: Novos usuários só podem ser criados por administradores do sistema.";
        } else if (error.message?.includes('not allowed') || error.message?.includes('permission denied')) {
          errorMessage = "Usuário não autorizado. Entre em contato com um administrador para criar este tipo de conta.";
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: errorMessage,
        });
      } else if (data) {
        // Registration successful
        toast({
          title: "Conta criada com sucesso",
          description: skipEmailVerification 
            ? "Sua conta foi criada. Você já pode fazer login."
            : "Sua conta foi criada. Verifique seu email para confirmar o cadastro.",
        });
        
        // Reset form fields on success
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setOrganizationType('user');
        setSkipEmailVerification(false);
        
        // Navigate to login page
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
