
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Store } from 'lucide-react';

interface RetiradaTabProps {
  graficaEndereco: string;
  setGraficaEndereco: (value: string) => void;
  aciescEndereco: string;
  setAciescEndereco: (value: string) => void;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
}

const RetiradaTab: React.FC<RetiradaTabProps> = ({ 
  graficaEndereco, 
  setGraficaEndereco, 
  aciescEndereco, 
  setAciescEndereco, 
  saveConfig, 
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pontos de Retirada</CardTitle>
        <CardDescription>Configure os endereços dos pontos de retirada das carteirinhas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="grafica-endereco" className="flex items-center gap-2">
            <Store className="h-4 w-4" /> Endereço da Gráfica Parceira
          </Label>
          <Textarea
            id="grafica-endereco"
            value={graficaEndereco}
            onChange={(e) => setGraficaEndereco(e.target.value)}
            placeholder="Informe o endereço completo da gráfica"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="aciesc-endereco" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Endereço da ACIESC
          </Label>
          <Textarea
            id="aciesc-endereco"
            value={aciescEndereco}
            onChange={(e) => setAciescEndereco(e.target.value)}
            placeholder="Informe o endereço completo da sede da ACIESC"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveConfig} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Pontos de Retirada'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RetiradaTab;
