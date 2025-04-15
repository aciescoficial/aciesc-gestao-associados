
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
    
    try {
      console.log("Tentando registrar com email:", email, "e tipo:", organizationType);
      
      // Direct sign-up with no captcha verification
      const { data, error } = await signUp(email, password, name, organizationType);
      
      if (error) {
        console.error("Signup error:", error);
        
        let errorMessage = error.message;
        
        if (error.message.includes('already registered') || error.message.includes('já está registrado')) {
          errorMessage = "Este email já está registrado. Tente fazer login.";
        } else if (error.message.includes('rate limit') || error.message.includes('limite')) {
          errorMessage = "Limite de cadastros excedido. Por favor, tente novamente mais tarde.";
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: errorMessage,
        });
      } else if (data) {
        // Se não houver mensagem de erro mas temos dados, significa que deu certo
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada. Você já pode fazer login.",
        });
        
        // Reset form fields on success
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setOrganizationType('user');
        
        // Navigate to login page
        navigate('/login');
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
    handleSignUp
  };
};
