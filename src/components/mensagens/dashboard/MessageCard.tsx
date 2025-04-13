
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Message, MessagePriority } from '../hooks/useMessages';

interface MessageCardProps {
  message: Message;
  markAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  formatRelativeDate: (dateString: string) => string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  markAsRead,
  deleteMessage,
  formatRelativeDate
}) => {
  // Get priority badge color
  const getPriorityBadge = (priority: MessagePriority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-amber-500">Alta</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <Card className={`p-4 hover:bg-gray-50 transition-colors ${!message.read ? 'border-l-4 border-l-blue-500' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{message.title}</h3>
            {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
            {getPriorityBadge(message.priority)}
          </div>
          <p className="text-sm text-gray-500 mt-1">De: {message.sender} • {formatRelativeDate(message.date)}</p>
          <p className="mt-3">{message.content}</p>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          {!message.read && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => markAsRead(message.id)}
            >
              Marcar como lida
            </Button>
          )}
          <Button variant="ghost" size="sm">Ver detalhes</Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => deleteMessage(message.id)}
          >
            Excluir
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MessageCard;
