
import { useMemo } from 'react';
import { Message, MessageStatus } from '../types';

export const useMessageFilter = (messages: Message[], filter: MessageStatus) => {
  return useMemo(() => {
    if (filter === 'all') return messages;
    return messages.filter(message => 
      filter === 'unread' ? !message.read : message.read
    );
  }, [messages, filter]);
};
