
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';

const CodigoIncorporacao: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('iframe');
  
  // URL base do site
  const baseUrl = window.location.origin;
  
  // Código de incorporação via iframe
  const iframeCode = `<iframe src="${baseUrl}/formulario-interesse" width="100%" height="800px" frameborder="0"></iframe>`;
  
  // Código para link direto
  const linkCode = `<a href="${baseUrl}/formulario-interesse" target="_blank" rel="noopener noreferrer">Clique aqui para se associar à ACIESC</a>`;
  
  // Código para botão
  const buttonCode = `<a href="${baseUrl}/formulario-interesse" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Associe-se à ACIESC</a>`;
  
  // Função para copiar o código
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // Determinar o código ativo
  const getActiveCode = () => {
    switch (activeTab) {
      case 'iframe':
        return iframeCode;
      case 'link':
        return linkCode;
      case 'button':
        return buttonCode;
      default:
        return iframeCode;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="iframe" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="iframe">iFrame</TabsTrigger>
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="button">Botão</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">
                {activeTab === 'iframe' && 'Incorporar o formulário em seu site'}
                {activeTab === 'link' && 'Link direto para o formulário'}
                {activeTab === 'button' && 'Botão personalizado para seu site'}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'iframe' && 'Copie o código abaixo e cole no HTML da sua página para incorporar o formulário completo.'}
                {activeTab === 'link' && 'Insira este link em sua página para direcionar o usuário ao formulário.'}
                {activeTab === 'button' && 'Use este botão personalizado para direcionar o usuário ao formulário.'}
              </p>
            </div>
            
            <div className="relative">
              <Card className="p-4 bg-muted/50 font-mono text-sm overflow-x-auto">
                <code className="whitespace-pre-wrap break-all">
                  {getActiveCode()}
                </code>
              </Card>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(getActiveCode())}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">{copied ? 'Copiado!' : 'Copiar'}</span>
              </Button>
            </div>
            
            {activeTab === 'iframe' && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Dicas para incorporação:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Ajuste a largura (width) e altura (height) conforme necessário para seu site</li>
                  <li>Se precisar de mais espaço, aumente o valor de height para evitar barras de rolagem</li>
                  <li>O formulário se adapta automaticamente em dispositivos móveis</li>
                </ul>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium">Visualização:</h3>
        <div className="mt-4 border rounded p-4 bg-white">
          {activeTab === 'iframe' && (
            <div className="text-center p-6 border-2 border-dashed">
              [Previsualização do iFrame com o formulário de interesse]
            </div>
          )}
          
          {activeTab === 'link' && (
            <div className="text-center">
              <a href={`${baseUrl}/formulario-interesse`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Clique aqui para se associar à ACIESC
              </a>
            </div>
          )}
          
          {activeTab === 'button' && (
            <div className="text-center">
              <a 
                href={`${baseUrl}/formulario-interesse`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90"
              >
                Associe-se à ACIESC
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodigoIncorporacao;
