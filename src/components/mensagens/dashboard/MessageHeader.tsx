
import React from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageHeaderProps {
  unreadCount: number;
  markAllAsRead: () => void;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ unreadCount, markAllAsRead }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="wp-header">Mensagens Recebidas</h1>
      <div className="flex gap-2">
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
          >
            Marcar todas como lidas
          </Button>
        )}
        <Button asChild>
          <Link to="/mensagens/enviar" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Enviar Nova Mensagem
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MessageHeader;
