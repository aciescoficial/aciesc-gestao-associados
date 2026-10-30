
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Message, MessageStatus, MessageSortType, NewMessageData } from '../types';
import { useMessageSort } from './useMessageSort';
import { useMessageFilter } from './useMessageFilter';
import * as messageService from '../services/messageService';

export const useMessages = () => {
  const [filter, setFilter] = useState<MessageStatus>('all');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sortType, setSortType] = useState<MessageSortType>('date');
  const [isFetching, setIsFetching] = useState(false);

  // Fetch messages from Supabase
  const fetchMessages = useCallback(async () => {
    setIsFetching(true);
    try {
      const messagesData = await messageService.fetchMessages();
      setMessages(messagesData);
      toast.success('Mensagens atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Não foi possível atualizar as mensagens. Tente novamente.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        }, 
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  // Apply filters and sorting
  const sortedMessages = useMessageSort(messages, sortType);
  const filteredMessages = useMessageFilter(sortedMessages, filter);

  // Message counts
  const unreadCount = messages.filter(m => !m.read).length;
  const readCount = messages.filter(m => m.read).length;

  // Message operations
  const markAsRead = useCallback(async (id: string) => {
    try {
      await messageService.markMessageAsRead(id);
      toast.success('Mensagem marcada como lida');
      await fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Erro ao marcar mensagem como lida');
    }
  }, [fetchMessages]);

  const markAllAsRead = useCallback(async () => {
    try {
      await messageService.markAllAsRead(messages);
      toast.success('Todas as mensagens foram marcadas como lidas');
      await fetchMessages();
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Erro ao marcar mensagens como lidas');
    }
  }, [messages, fetchMessages]);

  const addMessage = useCallback(async (messageData: NewMessageData) => {
    try {
      await messageService.addMessage(messageData);
      toast.success('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    try {
      await messageService.deleteMessage(id);
      toast.success('Mensagem excluída com sucesso');
      await fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Erro ao excluir mensagem');
    }
  }, [fetchMessages]);

  return {
    filter,
    setFilter,
    messages,
    filteredMessages,
    unreadCount,
    readCount,
    markAsRead,
    markAllAsRead,
    sortType,
    setSortType,
    fetchMessages,
    isFetching,
    addMessage,
    deleteMessage
  };
};

export default useMessages;
