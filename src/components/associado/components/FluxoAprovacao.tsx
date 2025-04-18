
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, UserPlus, Send, FileText } from 'lucide-react';

const FluxoAprovacao = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <h3 className="font-medium">1. Cadastro</h3>
              <p className="text-sm text-muted-foreground">
                Interessado preenche o formulário de interesse
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <Send className="h-8 w-8 text-yellow-500" />
              <h3 className="font-medium">2. Análise</h3>
              <p className="text-sm text-muted-foreground">
                Administrador analisa a solicitação
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <UserPlus className="h-8 w-8 text-green-500" />
              <h3 className="font-medium">3. Aprovação</h3>
              <p className="text-sm text-muted-foreground">
                Solicitação é aprovada ou rejeitada
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-purple-500" />
              <h3 className="font-medium">4. Cadastro</h3>
              <p className="text-sm text-muted-foreground">
                Associado completa seu cadastro
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="wp-notice-info">
        <p className="text-sm">
          Este é o fluxo padrão do processo de aprovação de novos associados. 
          Cada etapa é importante para garantir a qualidade dos membros da associação.
        </p>
      </div>
    </div>
  );
};

export default FluxoAprovacao;
