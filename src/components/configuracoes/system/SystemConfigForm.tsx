
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSystemConfig } from './hooks/useSystemConfig';
import { toast } from '@/components/ui/use-toast';

export const SystemConfigForm = () => {
  const { showSystemMessages, toggleSystemMessages, isLoading } = useSystemConfig();

  const handleToggleSystemMessages = (checked: boolean) => {
    try {
      toggleSystemMessages(checked);
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(
        new CustomEvent('system-config-updated', { 
          detail: { showSystemMessages: checked } 
        })
      );

      toast({
        title: "Configuração atualizada",
        description: checked 
          ? "Mensagens de sistema ativadas" 
          : "Mensagens de sistema desativadas",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as configurações",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="system-messages"
            checked={showSystemMessages}
            onCheckedChange={handleToggleSystemMessages}
            disabled={isLoading}
          />
          <Label htmlFor="system-messages">
            Exibir mensagens importantes no dashboard
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Quando ativado, mensagens importantes serão exibidas no topo do dashboard.
        </p>
      </CardContent>
    </Card>
  );
};
