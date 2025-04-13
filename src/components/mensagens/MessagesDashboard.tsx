
import React, { useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Send, PlusCircle } from 'lucide-react';
import { useMessages, MessagePriority } from './hooks/useMessages';

const MessagesDashboard: React.FC = () => {
  const { 
    filter, 
    setFilter, 
    filteredMessages, 
    unreadCount, 
    readCount, 
    markAsRead, 
    markAllAsRead, 
    deleteMessage 
  } = useMessages();

  // Get priority badge color
  const getPriorityBadge = useCallback((priority: MessagePriority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-amber-500">Alta</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  }, []);

  const renderMessageCard = useCallback((message) => (
    <Card key={message.id} className={`p-4 hover:bg-gray-50 transition-colors ${!message.read ? 'border-l-4 border-l-blue-500' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{message.title}</h3>
            {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
            {getPriorityBadge(message.priority)}
          </div>
          <p className="text-sm text-gray-500 mt-1">De: {message.sender} • {message.date}</p>
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
  ), [getPriorityBadge, markAsRead, deleteMessage]);

  return (
    <div className="space-y-6">
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
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setFilter('all')}>
            Todas ({filteredMessages.length})
          </TabsTrigger>
          <TabsTrigger value="unread" onClick={() => setFilter('unread')}>
            Não Lidas ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read" onClick={() => setFilter('read')}>
            Lidas ({readCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter} className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map(renderMessageCard)
          ) : (
            <div className="text-center p-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">
                {filter === 'all' && 'Nenhuma mensagem encontrada'}
                {filter === 'unread' && 'Nenhuma mensagem não lida'}
                {filter === 'read' && 'Nenhuma mensagem lida'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(MessagesDashboard);
