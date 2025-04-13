
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Copy, CheckCheck, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CodigoIncorporacao: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  // Updated iframe code
  const embedCode = `<iframe src="https://preview--aciesc-gestao-associados.lovable.app/formulario-interesse" width="100%" height="700px" frameborder="0" style="border: none;"></iframe>`;
  
  // Form URL to copy
  const formUrl = "https://preview--aciesc-gestao-associados.lovable.app/formulario-interesse";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
      .then(() => {
        setCopied(true);
        toast({
          title: "Código copiado!",
          description: "O código de incorporação foi copiado para a área de transferência.",
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar: ', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o código. Tente selecionar e copiar manualmente.",
          variant: "destructive"
        });
      });
  };
  
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(formUrl)
      .then(() => {
        setUrlCopied(true);
        toast({
          title: "URL copiada!",
          description: "A URL do formulário foi copiada para a área de transferência.",
        });
        
        setTimeout(() => setUrlCopied(false), 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar URL: ', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar a URL. Tente selecionar e copiar manualmente.",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="wp-card">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">
            <Code className="h-5 w-5 inline mr-2" />
            Código para Incorporar no Site
          </h2>
          
          <p className="mb-4 text-muted-foreground">
            Adicione o formulário de interesse em qualquer página do seu site copiando e colando o código abaixo.
          </p>
          
          <div className="bg-slate-900 text-slate-50 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {embedCode}
            </pre>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCheck className="h-4 w-4" />
                  Código Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar Código
                </>
              )}
            </Button>
            
            <Button
              onClick={copyUrlToClipboard}
              variant="outline"
              className="flex items-center gap-2"
            >
              {urlCopied ? (
                <>
                  <CheckCheck className="h-4 w-4" />
                  URL Copiada
                </>
              ) : (
                <>
                  <Link className="h-4 w-4" />
                  Copiar Apenas URL
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6 mt-4 md:mt-0">
          <h3 className="font-medium mb-2">Instruções:</h3>
          <ol className="list-decimal ml-5 space-y-2 text-sm">
            <li>Copie o código HTML ao lado</li>
            <li>Acesse o painel de administração do seu site</li>
            <li>Edite a página onde deseja exibir o formulário</li>
            <li>No editor HTML, cole o código no local desejado</li>
            <li>Salve as alterações e teste o formulário</li>
          </ol>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm">
            <p className="font-medium mb-1">Observações:</p>
            <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
              <li>Você pode ajustar a largura (width) e altura (height) conforme necessário</li>
              <li>O formulário é totalmente responsivo e se adapta à largura disponível</li>
              <li>Todas as submissões serão enviadas diretamente para o seu painel administrativo</li>
              <li>Se preferir, você pode apenas compartilhar a URL do formulário</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodigoIncorporacao;
