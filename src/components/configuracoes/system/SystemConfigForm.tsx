
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { systemConfigSchema, SystemConfigValues } from '../types/systemConfig';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSystemConfig } from './hooks/useSystemConfig';
import { toast } from 'sonner';
import { AlertCircle, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SystemConfigForm: React.FC = () => {
  const { config, isLoading, saveConfig } = useSystemConfig();
  
  const form = useForm<SystemConfigValues>({
    resolver: zodResolver(systemConfigSchema),
    defaultValues: {
      showSystemMessages: true,
    },
  });

  React.useEffect(() => {
    if (config) {
      form.reset(config);
    }
  }, [config, form]);

  const onSubmit = async (values: SystemConfigValues) => {
    try {
      await saveConfig(values);
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      console.error('Error saving system config:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Carregando configurações...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Estas configurações afetam o comportamento global do sistema.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="showSystemMessages"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Mostrar mensagens de sistema</FormLabel>
                <FormDescription>
                  Quando ativado, exibe mensagens importantes do sistema no topo da página.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full sm:w-auto"
          disabled={!form.formState.isDirty}
        >
          <Save className="mr-2 h-4 w-4" /> Salvar configurações
        </Button>
      </form>
    </Form>
  );
};
