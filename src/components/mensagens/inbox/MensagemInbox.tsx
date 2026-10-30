
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, MailOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeDate } from '../utils/dateUtils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  sender: string;
  priority: 'normal' | 'high' | 'urgent';
}

const mockMessages: Message[] = [
  {
    id: '1',
    title: 'Boas-vindas ao sistema',
    content: 'Seja bem-vindo ao nosso sistema de mensagens...',
    date: '2025-04-20',
    read: false,
    sender: 'Sistema',
    priority: 'normal'
  },
  {
    id: '2',
    title: 'Atualização importante',
    content: 'Novos recursos foram adicionados ao sistema...',
    date: '2025-04-19',
    read: true,
    sender: 'Administração',
    priority: 'high'
  }
];

const MensagemInbox: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !message.read) ||
                         (filter === 'read' && message.read);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = mockMessages.filter(m => !m.read).length;
  const readCount = mockMessages.filter(m => m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Caixa de Entrada</h1>
        <Button onClick={() => navigate('/mensagens/enviar')}>
          Nova Mensagem
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input 
          placeholder="Buscar mensagens..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setFilter('all')}>
            Todas ({mockMessages.length})
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
            filteredMessages.map(message => (
              <Card key={message.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {message.read ? (
                        <MailOpen className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Mail className="h-4 w-4 text-blue-500" />
                      )}
                      <h3 className="text-lg font-semibold">
                        {message.title}
                      </h3>
                      {message.priority === 'high' && (
                        <Badge variant="default" className="bg-amber-500">Alta</Badge>
                      )}
                      {message.priority === 'urgent' && (
                        <Badge variant="destructive">Urgente</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      De: {message.sender} • {formatRelativeDate(message.date)}
                    </p>
                    <p className="mt-2 text-gray-600 line-clamp-2">{message.content}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/mensagens/${message.id}`)}>
                    <span>Ver detalhes</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Mail className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg font-medium">Nenhuma mensagem encontrada</p>
              <p className="text-sm">Não há mensagens para exibir nesta categoria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MensagemInbox;
