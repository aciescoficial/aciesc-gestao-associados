
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Key, Mail } from "lucide-react";
import { UserRole } from '@/components/usuarios/types';
import { useRecaptcha } from './hooks/useRecaptcha';

interface LoginFormProps {
  onForgotPassword: () => void;
  recaptchaLoaded: boolean;
  setRecaptchaLoaded: (loaded: boolean) => void;
  setRecaptchaToken: (token: string) => void;
}

const LoginForm = ({ 
  onForgotPassword,
  recaptchaLoaded,
  setRecaptchaLoaded,
  setRecaptchaToken
}: LoginFormProps) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [organizationType, setOrganizationType] = useState<UserRole>('user');
  const [recaptchaToken, setRecaptchaTokenLocal] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize reCAPTCHA
  const { isEnabled } = useRecaptcha(
    'login-recaptcha', 
    recaptchaLoaded, 
    setRecaptchaLoaded, 
    (token: string) => {
      setRecaptchaTokenLocal(token);
      setRecaptchaToken(token);
    }
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add reCAPTCHA token to options if available
      const options = recaptchaToken ? { 
        captchaToken: recaptchaToken 
      } : undefined;
      
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
      // Add reCAPTCHA token to options if available
      const options = recaptchaToken ? { 
        captchaToken: recaptchaToken 
      } : undefined;
      
      const { error } = await signInWithGoogle(options);
      
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Acesse sua conta para gerenciar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de Acesso</Label>
          <Select 
            value={organizationType} 
            onValueChange={(value) => setOrganizationType(value as UserRole)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de acesso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Associado</SelectItem>
              <SelectItem value="empresa">Empresa</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input 
                id="password" 
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
          
          <div id="login-recaptcha" className="flex justify-center">
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
              {isLoading ? "Entrando..." : "Entrar"}
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
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          onClick={onForgotPassword}
          className="text-blue-600"
        >
          <Key className="w-4 h-4 mr-2" />
          Esqueceu sua senha?
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
