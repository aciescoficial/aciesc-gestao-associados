
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface EntregaTabProps {
  permiteEntrega: boolean;
  setPermiteEntrega: (value: boolean) => void;
  permiteRetirada: boolean;
  setPermiteRetirada: (value: boolean) => void;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
}

const EntregaTab: React.FC<EntregaTabProps> = ({ 
  permiteEntrega, 
  setPermiteEntrega, 
  permiteRetirada, 
  setPermiteRetirada, 
  saveConfig, 
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Entrega</CardTitle>
        <CardDescription>Configure as opções de entrega das carteirinhas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="permite-entrega">Permitir entrega no endereço</Label>
            <p className="text-sm text-muted-foreground">
              Quando ativado, os associados poderão optar por receber a carteirinha em seu endereço
            </p>
          </div>
          <Switch
            id="permite-entrega"
            checked={permiteEntrega}
            onCheckedChange={setPermiteEntrega}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="permite-retirada">Permitir retirada pessoal</Label>
            <p className="text-sm text-muted-foreground">
              Quando ativado, os associados poderão optar por retirar a carteirinha pessoalmente
            </p>
          </div>
          <Switch
            id="permite-retirada"
            checked={permiteRetirada}
            onCheckedChange={setPermiteRetirada}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveConfig} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EntregaTab;
