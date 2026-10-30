
import { NotificationMessage, NotificationCacheStatus } from '@/components/layout/types/NotificationTypes';

// Helper to determine cache status
export function getCacheStatus(
  lastFetched: number | undefined,
  cacheDuration: number
): NotificationCacheStatus {
  if (!lastFetched) {
    return { status: 'none' };
  }
  
  const now = Date.now();
  const elapsed = now - lastFetched;
  
  if (elapsed < cacheDuration) {
    return { 
      status: 'valid',
      timestamp: lastFetched
    };
  }
  
  return {
    status: 'expired',
    timestamp: lastFetched
  };
}

// Helper to fetch messages and cache them
export async function fetchCachedMessages(): Promise<NotificationMessage[]> {
  try {
    // In a real app, this would be an API call
    // For demonstration, we're using local storage for now
    const cached = localStorage.getItem('cachedNotifications');
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching cached messages:', error);
    return [];
  }
}
