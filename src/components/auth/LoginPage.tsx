
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Navigate, Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Key } from "lucide-react";
import { UserRole } from '@/components/usuarios/types';

const LoginPage = () => {
  const { signIn, signUp, user, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [organizationType, setOrganizationType] = useState<UserRole>('user');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: error.message,
      });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
    
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!forgotPasswordEmail) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, informe seu e-mail.",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await resetPassword(forgotPasswordEmail);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao recuperar senha",
        description: error.message,
      });
    } else {
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setShowForgotPassword(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-wp-body p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ACIESC</h1>
          <p className="text-muted-foreground">Gestão de Associados</p>
        </div>

        {showForgotPassword ? (
          <Card>
            <CardHeader>
              <CardTitle>Recuperar Senha</CardTitle>
              <CardDescription>
                Informe seu e-mail para receber instruções de recuperação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">E-mail</Label>
                  <Input 
                    id="reset-email" 
                    type="email" 
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar E-mail"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => setShowForgotPassword(false)}
              >
                Voltar para Login
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
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
                    
                    {/* reCAPTCHA placeholder - actual integration needs API keys */}
                    <div className="border border-gray-200 rounded p-2 bg-gray-50 flex justify-center items-center h-[78px]">
                      <div className="text-sm text-gray-500">reCAPTCHA será carregado aqui</div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="link"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-600"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Esqueceu sua senha?
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
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
                    
                    {/* reCAPTCHA placeholder - actual integration needs API keys */}
                    <div className="border border-gray-200 rounded p-2 bg-gray-50 flex justify-center items-center h-[78px]">
                      <div className="text-sm text-gray-500">reCAPTCHA será carregado aqui</div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
