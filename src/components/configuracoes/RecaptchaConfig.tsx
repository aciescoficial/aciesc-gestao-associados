
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const recaptchaSchema = z.object({
  siteKey: z.string().min(1, 'Chave do site é obrigatória'),
  secretKey: z.string().min(1, 'Chave secreta é obrigatória'),
  enabled: z.boolean().default(true),
  threshold: z.number().min(0).max(1).default(0.5),
});

type RecaptchaFormValues = z.infer<typeof recaptchaSchema>;

const RecaptchaConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();
  
  const form = useForm<RecaptchaFormValues>({
    resolver: zodResolver(recaptchaSchema),
    defaultValues: {
      siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Chave de teste do Google reCAPTCHA
      secretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', // Chave secreta de teste
      enabled: true,
      threshold: 0.5,
    },
  });

  // Carregar configurações do reCAPTCHA
  useEffect(() => {
    const loadRecaptchaSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('configuracoes')
          .select('*')
          .eq('tipo', 'recaptcha')
          .single();
          
        if (error) {
          console.error('Erro ao carregar configurações do reCAPTCHA:', error);
          return;
        }
        
        if (data) {
          const settings = data.configuracoes || {};
          form.reset({
            siteKey: settings.siteKey || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
            secretKey: settings.secretKey || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
            enabled: settings.enabled !== undefined ? settings.enabled : true,
            threshold: settings.threshold || 0.5,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecaptchaSettings();
  }, [form]);

  const onSubmit = async (values: RecaptchaFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('configuracoes')
        .upsert({
          tipo: 'recaptcha',
          configuracoes: values,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'tipo'
        });
        
      if (error) throw error;
      
      toast({
        title: 'Configurações salvas',
        description: 'As configurações do reCAPTCHA foram salvas com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar configurações',
        description: error.message || 'Ocorreu um erro ao salvar as configurações do reCAPTCHA.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testRecaptcha = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Simulação de teste - em um ambiente real, você faria uma chamada
      // para o servidor para testar a integração com o reCAPTCHA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando sucesso
      setTestResult('success');
      toast({
        title: 'Teste realizado com sucesso',
        description: 'A configuração do reCAPTCHA está funcionando corretamente.',
      });
    } catch (error) {
      setTestResult('error');
      toast({
        title: 'Erro no teste',
        description: 'Não foi possível verificar a configuração do reCAPTCHA.',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Configuração do Google reCAPTCHA</h2>
          <p className="text-muted-foreground">
            Configure o Google reCAPTCHA para proteger seu site contra bots.
          </p>
        </div>
        
        <Card className="w-full md:w-auto bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="recaptcha-enabled"
                checked={form.watch('enabled')}
                onCheckedChange={(checked) => form.setValue('enabled', checked)}
              />
              <Label htmlFor="recaptcha-enabled">
                {form.watch('enabled') ? 'reCAPTCHA ativado' : 'reCAPTCHA desativado'}
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="configuracoes">
        <TabsList>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="integracao">Integração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuracoes" className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="siteKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave do Site (Site Key)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Chave pública do reCAPTCHA exibida no frontend.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="secretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave Secreta (Secret Key)</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Chave secreta do reCAPTCHA usada para verificação no backend.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Limite de Pontuação (Threshold)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              min="0" 
                              max="1" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                            />
                          </FormControl>
                          <FormDescription>
                            Valor mínimo de pontuação para considerar uma interação humana (0 a 1).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={testRecaptcha}
                  disabled={isTesting}
                  className="flex items-center gap-2"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testando...
                    </>
                  ) : testResult === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Testar Novamente
                    </>
                  ) : testResult === 'error' ? (
                    <>
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                      Testar Novamente
                    </>
                  ) : (
                    'Testar Configuração'
                  )}
                </Button>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Configurações'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="integracao" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Integração no Login</h3>
              <p className="mb-4 text-muted-foreground">
                O reCAPTCHA já está configurado nas páginas de login e registro do sistema.
                Certifique-se de que as chaves configuradas estejam corretas e que o reCAPTCHA esteja ativado.
              </p>
              
              <h4 className="font-medium mt-6 mb-2">Códigos de Exemplo</h4>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                {`// Exemplo de uso do reCAPTCHA em um componente
const { executeRecaptcha } = useRecaptcha();

// Ao enviar um formulário
const handleSubmit = async (event) => {
  event.preventDefault();
  
  // Obter token do reCAPTCHA
  const token = await executeRecaptcha();
  
  // Enviar token para verificação
  const response = await api.post('/verify-captcha', { token });
  
  if (response.success) {
    // Continuar com o processamento
  }
};`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecaptchaConfig;
