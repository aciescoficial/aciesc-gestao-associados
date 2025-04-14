import { useState } from 'react';
import { useAuth } from '../hooks/useAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Mail } from "lucide-react";
import { UserRole } from '@/components/usuarios/types';
import { useRecaptcha } from './hooks/useRecaptcha';

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
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [organizationType, setOrganizationType] = useState<UserRole>('user');
  const [recaptchaToken, setRecaptchaTokenLocal] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize reCAPTCHA
  const { isEnabled } = useRecaptcha(
    'register-recaptcha', 
    recaptchaLoaded, 
    setRecaptchaLoaded, 
    (token: string) => {
      setRecaptchaTokenLocal(token);
      setRecaptchaToken(token);
    }
  );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Fixed: Changed to pass only required parameters to signUp
      const { error } = await signUp(email, password, name, organizationType);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: error.message,
        });
      } else {
        toast({
          title: "Conta criada com sucesso",
          description: "Verifique seu email para confirmar sua conta.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao criar sua conta",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Fixed: Removed passing options to signInWithGoogle if function doesn't accept parameters
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>
          Crie uma nova conta para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-register">E-mail</Label>
            <Input 
              id="email-register" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-register">Senha</Label>
            <div className="relative">
              <Input 
                id="password-register" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Conta</Label>
            <Select 
              value={organizationType} 
              onValueChange={(value) => setOrganizationType(value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de conta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Associado</SelectItem>
                <SelectItem value="empresa">Empresa</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div id="register-recaptcha" className="flex justify-center">
            {isEnabled && !recaptchaLoaded && (
              <div className="border border-gray-200 rounded p-2 bg-gray-50 flex justify-center items-center h-[78px] w-full">
                <div className="text-sm text-gray-500">Carregando reCAPTCHA...</div>
              </div>
            )}
            <div className="recaptcha-badge"></div>
          </div>

          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || (isEnabled && !recaptchaToken)}
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading || (isEnabled && !recaptchaToken)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
