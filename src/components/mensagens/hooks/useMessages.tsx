
import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';

export type MessageStatus = 'unread' | 'read' | 'all';
export type MessagePriority = 'normal' | 'high' | 'urgent';

export interface Message {
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

export const useMessages = () => {
  const [filter, setFilter] = useState<MessageStatus>('all');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    if (filter === 'all') return messages;
    return messages.filter(message => 
      filter === 'unread' ? !message.read : message.read
    );
  }, [filter, messages]);

  // Message counts
  const unreadCount = useMemo(() => 
    messages.filter(m => !m.read).length, 
    [messages]
  );
  
  const readCount = useMemo(() => 
    messages.filter(m => m.read).length, 
    [messages]
  );

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setMessages(prevMessages => prevMessages.map(message => 
      message.id === id ? { ...message, read: true } : message
    ));
    toast.success('Mensagem marcada como lida');
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setMessages(prevMessages => prevMessages.map(message => 
      !message.read ? { ...message, read: true } : message
    ));
    toast.success('Todas as mensagens foram marcadas como lidas');
  }, []);

  // Delete message
  const deleteMessage = useCallback((id: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
    toast.success('Mensagem removida com sucesso');
  }, []);

  return {
    filter,
    setFilter,
    messages,
    filteredMessages,
    unreadCount,
    readCount,
    markAsRead,
    markAllAsRead,
    deleteMessage
  };
};

export default useMessages;
