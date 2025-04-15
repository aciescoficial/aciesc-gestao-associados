
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import { useToast } from "@/hooks/use-toast";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    // Check for registration success query param
    const params = new URLSearchParams(location.search);
    const registered = params.get('registered');
    
    if (registered === 'true') {
      toast({
        title: "Registro concluído",
        description: "Sua conta foi criada com sucesso. Agora você pode fazer login.",
      });
    }
    
    // Check if we should show the register tab
    if (location.pathname === '/cadastro') {
      setActiveTab('register');
    }
  }, [location, toast]);

  // Don't show anything while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-wp-body p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ACIESC</h1>
          <p className="text-muted-foreground">Gestão de Associados</p>
        </div>

        {showForgotPassword ? (
          <ForgotPasswordForm 
            onBack={() => setShowForgotPassword(false)} 
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                onForgotPassword={() => setShowForgotPassword(true)} 
              />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        )}
        
        <Card className="mt-6 p-4 text-center text-sm text-muted-foreground">
          <p>
            Para administradores, acesse a página de{' '}
            <a 
              href="/admin/setup" 
              className="text-primary hover:underline"
            >
              configuração inicial
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
