
export interface NotificationMessage {
  id: string;
  text: string;
  type: 'payment' | 'event' | 'inactive' | 'info';
  action?: {
    url: string;
    text: string;
  };
}
