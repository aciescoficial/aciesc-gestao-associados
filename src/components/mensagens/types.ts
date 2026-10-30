
export type MessageStatus = 'unread' | 'read' | 'all';
export type MessagePriority = 'normal' | 'high' | 'urgent';
export type MessageSortType = 'date' | 'priority' | 'sender';

export interface Message {
  id: string;
  title: string;
  content: string;
  sender: string;
  date: string;
  read: boolean;
  priority: MessagePriority;
  read_by?: string[];
}

export interface NewMessageData {
  title: string;
  content: string;
  priority: MessagePriority;
  recipient_ids: string[];
}
