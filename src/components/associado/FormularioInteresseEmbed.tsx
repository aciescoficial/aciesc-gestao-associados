
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormularioInteresseEmbed: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // URL do aplicativo para o formulário de interesse
  const appUrl = window.location.origin;
  
  // Código de incorporação para o formulário de interesse
  const embedCode = `<iframe src="${appUrl}/formulario-interesse" width="100%" height="700px" frameborder="0" style="border: none;"></iframe>`;
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode)
      .then(() => {
        setCopied(true);
        toast({
          title: "Código copiado!",
          description: "O código de incorporação foi copiado para a área de transferência.",
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o código. Tente selecioná-lo manualmente.",
          variant: "destructive"
        });
      });
  };
  
  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Código para Incorporar o Formulário de Interesse</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopyCode}
          className="flex gap-1 items-center"
        >
          {copied ? (
            <>
              <CheckIcon size={16} />
              Copiado
            </>
          ) : (
            <>
              <CopyIcon size={16} />
              Copiar Código
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-gray-100 p-3 rounded-md overflow-x-auto">
        <pre className="text-xs text-gray-800 whitespace-pre-wrap">{embedCode}</pre>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Adicione este código ao seu site para incorporar o formulário de interesse.</p>
        <p className="mt-2">Instruções:</p>
        <ol className="list-decimal ml-5 mt-1">
          <li>Copie o código acima</li>
          <li>Cole no editor do seu site onde deseja que o formulário apareça</li>
          <li>Salve as alterações</li>
        </ol>
      </div>
    </Card>
  );
};

export default FormularioInteresseEmbed;
