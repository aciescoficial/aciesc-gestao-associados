
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Copy, CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CodigoIncorporacao: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Exemplo de código de incorporação para o formulário
  const embedCode = `<iframe
  src="https://seudominio.com.br/formulario-interesse-embed"
  width="100%"
  height="650"
  frameborder="0"
  allowtransparency="true"
></iframe>`;

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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodigoIncorporacao;
