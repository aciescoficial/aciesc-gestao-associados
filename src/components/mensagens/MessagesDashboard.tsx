
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types for our messages
type MessageStatus = 'unread' | 'read' | 'all';
type MessagePriority = 'normal' | 'high' | 'urgent';

interface Message {
  id: string;
  title: string;
  content: string;
  sender: string;
  date: string;
  read: boolean;
  priority: MessagePriority;
}

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: '1',
    title: 'Pagamento de mensalidade',
    content: 'Sua mensalidade está próxima do vencimento. Por favor, efetue o pagamento para evitar a suspensão do seu acesso.',
    sender: 'Sistema',
    date: '2025-04-10',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Evento especial de networking',
    content: 'Estamos organizando um evento especial de networking para todos os associados. Confirme sua presença!',
    sender: 'Eventos ACIESC',
    date: '2025-04-08',
    read: false,
    priority: 'normal'
  },
  {
    id: '3',
    title: 'Atualização cadastral necessária',
    content: 'Precisamos que você atualize suas informações cadastrais para continuar oferecendo os melhores serviços.',
    sender: 'Administração',
    date: '2025-04-05',
    read: true,
    priority: 'normal'
  },
  {
    id: '4',
    title: 'Nova parceria firmada',
    content: 'Temos uma nova empresa parceira oferecendo descontos especiais para associados. Confira!',
    sender: 'Parcerias ACIESC',
    date: '2025-04-03',
    read: true,
    priority: 'normal'
  },
  {
    id: '5',
    title: 'URGENTE: Alteração de sistema',
    content: 'Nosso sistema estará em manutenção hoje à noite das 22h às 2h. Durante este período o acesso estará indisponível.',
    sender: 'Suporte Técnico',
    date: '2025-04-01',
    read: true,
    priority: 'urgent'
  }
];

const MessagesDashboard: React.FC = () => {
  const [filter, setFilter] = useState<MessageStatus>('all');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // Memoized filtered messages to prevent unnecessary recalculations
  const filteredMessages = useMemo(() => {
    if (filter === 'all') return messages;
    return messages.filter(message => 
      filter === 'unread' ? !message.read : message.read
    );
  }, [filter, messages]);

  // Memoized count values
  const unreadCount = useMemo(() => 
    messages.filter(m => !m.read).length, 
    [messages]
  );
  
  const readCount = useMemo(() => 
    messages.filter(m => m.read).length, 
    [messages]
  );

  // Mark message as read
  const markAsRead = (id: string) => {
    setMessages(prevMessages => prevMessages.map(message => 
      message.id === id ? { ...message, read: true } : message
    ));
  };

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

  const renderMessageCard = (message: Message) => (
    <Card key={message.id} className={`p-4 hover:bg-gray-50 ${!message.read ? 'border-l-4 border-l-blue-500' : ''}`}>
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
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="wp-header">Mensagens Recebidas</h1>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setFilter('all')}>
            Todas ({messages.length})
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

export default MessagesDashboard;
