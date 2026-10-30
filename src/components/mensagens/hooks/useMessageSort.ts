
import { useMemo } from 'react';
import { Message, MessageSortType } from '../types';

export const useMessageSort = (messages: Message[], sortType: MessageSortType) => {
  return useMemo(() => {
    return [...messages].sort((a, b) => {
      switch (sortType) {
        case 'priority': {
          const priorityOrder = { urgent: 3, high: 2, normal: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'sender':
          return a.sender.localeCompare(b.sender);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [messages, sortType]);
};
