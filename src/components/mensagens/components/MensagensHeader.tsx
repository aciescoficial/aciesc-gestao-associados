
import React from 'react';
import { Inbox, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MensagensHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="wp-header">Comunicação</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Envie mensagens para usuários do sistema ou por email
        </p>
      </div>
      
      <div className="flex items-center gap-2 self-stretch sm:self-auto">
        <Button asChild variant="outline" className="flex-1 sm:flex-auto">
          <Link to="/mensagens" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Caixa de Entrada
          </Link>
        </Button>
        <Button asChild className="flex-1 sm:flex-auto">
          <Link to="/mensagens/enviar" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Nova Mensagem
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default React.memo(MensagensHeader);
