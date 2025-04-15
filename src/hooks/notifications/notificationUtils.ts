
import { NotificationMessage, NotificationCacheStatus } from '@/components/layout/types/NotificationTypes';

// Cache configuration
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Debug logger function for notifications
 */
export function createDebugLogger(isDebugEnabled: boolean) {
  return (message: string, data?: any) => {
    if (isDebugEnabled) {
      console.log(`[useHeaderNotifications] ${message}`, data || '');
    }
  };
}

/**
 * Check if cached data is still valid based on timestamp and duration
 */
export function isCacheValid(timestamp: number | undefined, cacheDuration: number = DEFAULT_CACHE_DURATION): boolean {
  if (!timestamp || !cacheDuration) return false;
  return (Date.now() - timestamp) < cacheDuration;
}

/**
 * Get cache status with more details
 */
export function getCacheStatus(timestamp?: number, cacheDuration?: number): NotificationCacheStatus {
  if (!timestamp) {
    return { status: 'none' };
  }
  
  return {
    status: isCacheValid(timestamp, cacheDuration) ? 'valid' : 'expired',
    timestamp
  };
}

/**
 * Save messages to local storage cache
 */
export function saveMessagesToCache(messages: NotificationMessage[], logDebug: (message: string, data?: any) => void): void {
  try {
    localStorage.setItem('cachedSystemMessages', JSON.stringify(messages));
    localStorage.setItem('cachedSystemMessagesTimestamp', Date.now().toString());
    logDebug('Messages saved to cache', { messageCount: messages.length });
  } catch (e) {
    console.error('Error saving messages to cache:', e);
  }
}

/**
 * Load messages from local storage cache
 * Returns null if no valid cache found
 */
export function loadMessagesFromCache(
  cacheDuration: number | undefined, 
  logDebug: (message: string, data?: any) => void
): { messages: NotificationMessage[], timestamp: number } | null {
  try {
    const cachedMessages = localStorage.getItem('cachedSystemMessages');
    const cacheTimestamp = localStorage.getItem('cachedSystemMessagesTimestamp');
    
    if (cachedMessages && cacheTimestamp) {
      const timestamp = parseInt(cacheTimestamp, 10);
      
      if (isCacheValid(timestamp, cacheDuration)) {
        const parsedMessages = JSON.parse(cachedMessages);
        if (Array.isArray(parsedMessages)) {
          logDebug('Using cached messages', { messageCount: parsedMessages.length });
          return { messages: parsedMessages, timestamp };
        }
      } else {
        logDebug('Cache expired', { timestamp, now: Date.now(), diff: Date.now() - timestamp });
      }
    }
    return null;
  } catch (e) {
    console.error('Error loading messages from cache:', e);
    return null;
  }
}

/**
 * Clear notification cache
 */
export function clearNotificationCache(): void {
  localStorage.removeItem('cachedSystemMessages');
  localStorage.removeItem('cachedSystemMessagesTimestamp');
}

/**
 * Format messages from API data
 */
export function formatApiMessagesToNotifications(data: any[]): NotificationMessage[] {
  return data.map((template: any) => ({
    id: template.id || String(Math.random()),
    text: template.assunto || 'Notificação do sistema',
    type: 'info' as const,
    action: template.corpo && template.corpo.includes('http') ? {
      url: template.corpo.match(/https?:\/\/[^\s]+/)?.[0] || '#',
      text: 'Saiba mais'
    } : undefined
  }));
}

/**
 * Load demo messages for development and testing
 */
export function loadDemoMessages(): NotificationMessage[] | null {
  const storedMessages = window.localStorage.getItem('demoMessages');
  if (storedMessages) {
    try {
      const parsedMessages = JSON.parse(storedMessages);
      if (Array.isArray(parsedMessages)) {
        return parsedMessages;
      }
    } catch (e) {
      console.error("Error parsing demo messages:", e);
    }
  }
  return null;
}
