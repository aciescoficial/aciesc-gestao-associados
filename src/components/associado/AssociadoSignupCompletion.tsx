import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';

const formSchema = z.object({
  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(100, "A senha não pode ter mais de 100 caracteres"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

interface SignupData {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
}

const AssociadoSignupCompletion: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });
  
  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        if (!token) {
          setError("Token de verificação não encontrado");
          setTokenValid(false);
          return;
        }
        
        // Validate token
        const { data, error } = await extendedSupabase
          .from("signup_tokens")
          .select(`
            token,
            expires_at,
            associado_interesse_id,
            used,
            associado_interesse:associado_interesse_id (
              id,
              nome,
              sobrenome,
              email,
              cpf
            )
          `)
          .eq("token", token)
          .single();
          
        if (error || !data) {
          setError("Token inválido ou expirado");
          setTokenValid(false);
          return;
        }
        
        // Check if token expired
        const now = new Date();
        const expiresAt = new Date(data.expires_at);
        
        if (now > expiresAt) {
          setError("Este link expirou. Por favor, solicite um novo.");
          setTokenValid(false);
          return;
        }
        
        // Check if already used
        if (data.used) {
          setError("Este link já foi utilizado");
          setTokenValid(false);
          return;
        }
        
        // Token is valid
        setTokenValid(true);
        setSignupData({
          id: data.associado_interesse.id,
          nome: data.associado_interesse.nome,
          sobrenome: data.associado_interesse.sobrenome,
          email: data.associado_interesse.email,
          cpf: data.associado_interesse.cpf
        });
        
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setError("Ocorreu um erro ao validar o token");
        setTokenValid(false);
      } finally {
        setLoading(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!signupData) return;
    
    setSubmitting(true);
    try {
      // Create auth account
      const { error: signupError } = await extendedSupabase.auth.signUp({
        email: signupData.email,
        password: data.password,
        options: {
          data: {
            name: `${signupData.nome} ${signupData.sobrenome}`
          }
        }
      });
      
      if (signupError) throw signupError;
      
      // Create associado record
      const { error: associadoError } = await extendedSupabase
        .from("associados")
        .insert({
          nome: signupData.nome,
          sobrenome: signupData.sobrenome,
          email: signupData.email,
          cpf: signupData.cpf,
          cidade: 'Pendente atualização',
          telefone: 'Pendente atualização',
          status: 'ativo'
        });
        
      if (associadoError) throw associadoError;
      
      // Mark token as used
      await extendedSupabase
        .from("signup_tokens")
        .update({ used: true })
        .eq("token", token);
        
      setCompleted(true);
      
    } catch (error: any) {
      console.error("Erro ao finalizar cadastro:", error);
      toast({
        title: "Erro ao finalizar cadastro",
        description: error.message || "Ocorreu um erro ao finalizar seu cadastro",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!tokenValid) {
    return (
      <div className="text-center max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Link inválido</h2>
        <p className="text-gray-600 mb-4">{error || "Este link é inválido ou expirou."}</p>
        <Button asChild>
          <a href="/">Voltar ao início</a>
        </Button>
      </div>
    );
  }
  
  if (completed) {
    return (
      <div className="text-center max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Cadastro Concluído!</h2>
        <p className="text-gray-600 mb-6">
          Seu cadastro foi finalizado com sucesso. Agora você já pode fazer login na plataforma.
        </p>
        <Button asChild>
          <a href="/login">Fazer Login</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-6 text-center">Finalizar Cadastro</h2>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="font-medium">Bem-vindo(a), {signupData?.nome}!</p>
        <p className="text-sm text-gray-700">Para finalizar seu cadastro como associado, crie uma senha para sua conta.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirme sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full mt-4" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finalizando...
              </>
            ) : "Finalizar Cadastro"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AssociadoSignupCompletion;
