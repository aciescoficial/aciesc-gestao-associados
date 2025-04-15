
export interface NotificationMessage {
  id: string;
  text: string;
  type: 'payment' | 'event' | 'inactive' | 'info';
  action?: {
    url: string;
    text: string;
  };
}

// Additional types for notification functionality
export interface HeaderNotificationsOptions {
  cacheDuration?: number; // in milliseconds
  enableRetry?: boolean;
  maxRetries?: number;
  debug?: boolean;
}

export interface NotificationsState {
  importantMessages: NotificationMessage[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastFetched?: number;
  showSystemMessages?: boolean;
}

export interface NotificationCacheStatus {
  status: 'valid' | 'expired' | 'none';
  timestamp?: number;
}

// Re-export for convenience
export type { NotificationMessage as default };
