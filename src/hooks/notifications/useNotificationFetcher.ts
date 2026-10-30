
import { useState, useCallback, useEffect } from 'react';
import { NotificationMessage } from '@/components/layout/types/NotificationTypes';
import { getCacheStatus, fetchCachedMessages } from './notificationUtils';

interface UseNotificationFetcherProps {
  cacheDuration?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  debug?: boolean;
}

// Sample notification data (in a real app, this would come from an API)
const sampleMessages: NotificationMessage[] = [
  {
    id: '1',
    text: 'Sua mensalidade está próxima do vencimento.',
    type: 'payment',
    action: { url: '/financeiro/pagamentos', text: 'Ver detalhes' }
  },
  {
    id: '2',
    text: 'Há um novo evento de networking disponível.',
    type: 'event',
    action: { url: '/eventos', text: 'Ver evento' }
  },
  {
    id: '3',
    text: 'Atualize suas informações cadastrais.',
    type: 'inactive',
    action: { url: '/perfil', text: 'Atualizar' }
  },
  {
    id: '4',
    text: 'Nova mensagem recebida no sistema.',
    type: 'info',
    action: { url: '/mensagens', text: 'Ver mensagens' }
  }
];

export function useNotificationFetcher({
  cacheDuration = 5 * 60 * 1000,
  enableRetry = true,
  maxRetries = 3,
  debug = false
}: UseNotificationFetcherProps) {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [lastFetched, setLastFetched] = useState<number | undefined>();
  const [retryCount, setRetryCount] = useState(0);

  // Function to fetch messages from API or cache
  const fetchMessages = useCallback(async () => {
    // Check if we have recent data in cache
    const cacheStatus = getCacheStatus(lastFetched, cacheDuration);
    
    if (cacheStatus.status === 'valid' && messages.length > 0) {
      if (debug) console.log("Using cached notification messages");
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    setErrorMessage(undefined);
    
    try {
      // In a real app, this would be an API call
      // For now, we're simulating with a delay and sample data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate occasional errors for testing retry logic
      const shouldFailForTesting = Math.random() > 0.9;
      if (shouldFailForTesting && enableRetry && retryCount < maxRetries) {
        throw new Error("Simulated fetch error for testing retry logic");
      }
      
      // Get messages from simulated API or fetch cached messages
      const fetchedMessages = await fetchCachedMessages() || sampleMessages;
      
      setMessages(fetchedMessages);
      setLastFetched(Date.now());
      setRetryCount(0);
      
      if (debug) console.log("Notifications fetched successfully");
    } catch (error: any) {
      setHasError(true);
      setErrorMessage(error.message || "Failed to fetch notifications");
      
      if (debug) console.error("Error fetching notifications:", error);
      
      // Implement retry logic
      if (enableRetry && retryCount < maxRetries) {
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        
        // Exponential backoff
        const delay = Math.pow(2, nextRetryCount) * 1000;
        
        if (debug) console.log(`Retrying in ${delay}ms (attempt ${nextRetryCount}/${maxRetries})`);
        
        setTimeout(() => {
          fetchMessages();
        }, delay);
      }
    } finally {
      setIsLoading(false);
    }
  }, [lastFetched, messages.length, cacheDuration, debug, enableRetry, retryCount, maxRetries]);
  
  // Function to manually refresh messages
  const refreshMessages = useCallback(() => {
    setLastFetched(undefined);
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    hasError,
    errorMessage,
    lastFetched,
    fetchMessages,
    refreshMessages
  };
}
