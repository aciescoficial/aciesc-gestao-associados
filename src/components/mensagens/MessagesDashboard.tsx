
import React, { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Send, PlusCircle, Search, AlertTriangle, Filter } from 'lucide-react';
import { useMessages, MessagePriority } from './hooks/useMessages';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MessagesDashboard: React.FC = () => {
  const { 
    filter, 
    setFilter, 
    filteredMessages, 
    unreadCount, 
    readCount, 
    markAsRead, 
    markAllAsRead, 
    deleteMessage,
    messages
  } = useMessages();

  // Local state for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<MessagePriority | 'all'>('all');
  
  // Filtered messages based on search query and priority filter
  const displayedMessages = React.useMemo(() => {
    return filteredMessages.filter(message => {
      const matchesSearch = searchQuery === '' || 
        message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    });
  }, [filteredMessages, searchQuery, priorityFilter]);

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

  // Format relative date
  const formatRelativeDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
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
  ), [getPriorityBadge, markAsRead, deleteMessage, formatRelativeDate]);

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
      
      {/* Search and filter bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar mensagens..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Prioridade
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filtrar por prioridade</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem 
              checked={priorityFilter === 'all'}
              onCheckedChange={() => setPriorityFilter('all')}
            >
              Todas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={priorityFilter === 'normal'}
              onCheckedChange={() => setPriorityFilter('normal')}
            >
              Normal
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={priorityFilter === 'high'}
              onCheckedChange={() => setPriorityFilter('high')}
            >
              Alta
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={priorityFilter === 'urgent'}
              onCheckedChange={() => setPriorityFilter('urgent')}
            >
              Urgente
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          {displayedMessages.length > 0 ? (
            displayedMessages.map(renderMessageCard)
          ) : (
            <div className="text-center p-8 border rounded-md bg-gray-50 flex flex-col items-center">
              <AlertTriangle className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-500">
                {searchQuery 
                  ? 'Nenhuma mensagem encontrada para esta busca' 
                  : filter === 'all' 
                    ? 'Nenhuma mensagem encontrada'
                    : filter === 'unread' 
                      ? 'Nenhuma mensagem não lida'
                      : 'Nenhuma mensagem lida'
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(MessagesDashboard);
