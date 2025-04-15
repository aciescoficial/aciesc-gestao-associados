
import { useState, useEffect, useCallback } from 'react';
import { NotificationMessage } from '@/components/layout/types/NotificationTypes';
import { supabase } from '@/integrations/supabase/client';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { toast } from '@/components/ui/use-toast';

interface HeaderNotificationsOptions {
  cacheDuration?: number; // in milliseconds
  enableRetry?: boolean;
  maxRetries?: number;
  debug?: boolean;
}

interface NotificationsState {
  importantMessages: NotificationMessage[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastFetched?: number;
}

const DEFAULT_OPTIONS: HeaderNotificationsOptions = {
  cacheDuration: 5 * 60 * 1000, // 5 minutes default
  enableRetry: true,
  maxRetries: 3,
  debug: false,
};

export function useHeaderNotifications(options: HeaderNotificationsOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const [state, setState] = useState<NotificationsState>({
    importantMessages: [],
    isLoading: false,
    hasError: false,
  });

  // Debug logger function
  const logDebug = useCallback((message: string, data?: any) => {
    if (config.debug) {
      console.log(`[useHeaderNotifications] ${message}`, data || '');
    }
  }, [config.debug]);

  // Load system configuration
  useEffect(() => {
    const loadSystemConfig = async () => {
      try {
        // Try localStorage first for immediate effect
        const storedConfig = localStorage.getItem('systemConfig');
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          const showSystemMessages = parsedConfig.showSystemMessages ?? true;
          
          setState(prev => ({ 
            ...prev,
            showSystemMessages,
          }));
          logDebug('Loaded systemConfig from localStorage', { showSystemMessages });
          return;
        }
        
        // Fall back to database
        const { data, error } = await extendedSupabase
          .from('configuracoes')
          .select('*')
          .eq('tipo', 'sistema')
          .maybeSingle();
        
        if (error) {
          logDebug('No system config found, using defaults', error);
          return;
        }
        
        if (data?.configuracoes) {
          const showSystemMessages = data.configuracoes.showSystemMessages ?? true;
          setState(prev => ({ 
            ...prev,
            showSystemMessages,
          }));
          
          // Store for future use
          localStorage.setItem('systemConfig', JSON.stringify(data.configuracoes));
          logDebug('Loaded systemConfig from database', { showSystemMessages });
        }
      } catch (error) {
        console.error('Error loading system config:', error);
        setState(prev => ({ 
          ...prev,
          hasError: true,
          errorMessage: 'Failed to load system configuration'
        }));
      }
    };
    
    loadSystemConfig();
    
    // Listen for config updates
    const handleConfigUpdate = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.showSystemMessages === 'boolean') {
        setState(prev => ({ 
          ...prev,
          showSystemMessages: event.detail.showSystemMessages 
        }));
        logDebug('Config updated via event', { showSystemMessages: event.detail.showSystemMessages });
      }
    };
    
    window.addEventListener('system-config-updated', handleConfigUpdate as EventListener);
    
    return () => {
      window.removeEventListener('system-config-updated', handleConfigUpdate as EventListener);
    };
  }, [logDebug]);
  
  // Function to check if cache is still valid
  const isCacheValid = useCallback((timestamp: number): boolean => {
    if (!timestamp || !config.cacheDuration) return false;
    return (Date.now() - timestamp) < config.cacheDuration;
  }, [config.cacheDuration]);

  // Function to load messages from cache
  const loadFromCache = useCallback((): boolean => {
    try {
      const cachedMessages = localStorage.getItem('cachedSystemMessages');
      const cacheTimestamp = localStorage.getItem('cachedSystemMessagesTimestamp');
      
      if (cachedMessages && cacheTimestamp) {
        const timestamp = parseInt(cacheTimestamp, 10);
        
        if (isCacheValid(timestamp)) {
          const parsedMessages = JSON.parse(cachedMessages);
          if (Array.isArray(parsedMessages)) {
            setState(prev => ({
              ...prev,
              importantMessages: parsedMessages,
              isLoading: false,
              lastFetched: timestamp
            }));
            logDebug('Using cached messages', { messageCount: parsedMessages.length });
            return true;
          }
        } else {
          logDebug('Cache expired', { timestamp, now: Date.now(), diff: Date.now() - timestamp });
        }
      }
      return false;
    } catch (e) {
      console.error('Error loading messages from cache:', e);
      return false;
    }
  }, [isCacheValid, logDebug]);

  // Function to save messages to cache
  const saveToCache = useCallback((messages: NotificationMessage[]) => {
    try {
      localStorage.setItem('cachedSystemMessages', JSON.stringify(messages));
      localStorage.setItem('cachedSystemMessagesTimestamp', Date.now().toString());
      logDebug('Messages saved to cache', { messageCount: messages.length });
    } catch (e) {
      console.error('Error saving messages to cache:', e);
    }
  }, [logDebug]);
  
  // Function to fetch important messages with improved performance
  const fetchImportantMessages = useCallback(async (retryCount = 0) => {
    // Skip if system messages are disabled
    if (!state.showSystemMessages) {
      setState(prev => ({ ...prev, importantMessages: [], isLoading: false }));
      return;
    }
    
    // Check if we're already loading data to prevent duplicate requests
    if (state.isLoading) {
      logDebug('Fetch already in progress, skipping');
      return;
    }
    
    // Try to load from cache first
    if (loadFromCache()) {
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true }));
    logDebug('Fetching messages from API');
    
    try {
      // Using the email_templates table as a temporary solution
      // Set a timeout to abort if the query takes too long
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Query timeout")), 8000);
      });
      
      // Use a simpler query to reduce database load
      const queryPromise = supabase
        .from('email_templates')
        .select('id, assunto, corpo, codigo')
        .eq('codigo', 'sistema_alerta')
        .limit(5);
        
      // Race between the query and timeout
      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise.then(() => ({ data: null, error: new Error("Query timeout") }))
      ]) as any;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Format messages from the email_templates table
        const formattedMessages = data.map((template: any) => ({
          id: template.id || String(Math.random()),
          text: template.assunto || 'Notificação do sistema', // Using the subject as the message text
          type: 'info' as 'payment' | 'event' | 'inactive' | 'info', // Default type
          action: template.corpo && template.corpo.includes('http') ? {
            url: template.corpo.match(/https?:\/\/[^\s]+/)?.[0] || '#',
            text: 'Saiba mais'
          } : undefined
        }));
        
        setState(prev => ({ 
          ...prev, 
          importantMessages: formattedMessages, 
          hasError: false,
          isLoading: false,
          errorMessage: undefined,
          lastFetched: Date.now()
        }));
        
        // Cache the messages
        saveToCache(formattedMessages);
      } else {
        // When testing locally, if no messages in the database, use demo messages
        const storedMessages = window.localStorage.getItem('demoMessages');
        if (storedMessages) {
          try {
            const parsedMessages = JSON.parse(storedMessages);
            if (Array.isArray(parsedMessages)) {
              setState(prev => ({ 
                ...prev, 
                importantMessages: parsedMessages,
                isLoading: false,
                lastFetched: Date.now()
              }));
              saveToCache(parsedMessages);
            } else {
              setState(prev => ({ ...prev, importantMessages: [], isLoading: false }));
            }
          } catch (e) {
            setState(prev => ({ ...prev, importantMessages: [], isLoading: false }));
          }
        } else {
          setState(prev => ({ ...prev, importantMessages: [], isLoading: false }));
        }
      }
    } catch (error) {
      console.error("Error fetching important messages:", error);
      
      // Implement retry logic
      if (config.enableRetry && retryCount < (config.maxRetries || 0)) {
        logDebug(`Retry attempt ${retryCount + 1} of ${config.maxRetries}`);
        
        setTimeout(() => {
          fetchImportantMessages(retryCount + 1);
        }, 2000 * Math.pow(2, retryCount)); // Exponential backoff
        
        return;
      }
      
      setState(prev => ({ 
        ...prev, 
        hasError: true,
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error fetching messages'
      }));
      
      // On error, try to use cached messages
      const cachedMessages = localStorage.getItem('cachedSystemMessages');
      if (cachedMessages) {
        try {
          const parsedMessages = JSON.parse(cachedMessages);
          if (Array.isArray(parsedMessages)) {
            setState(prev => ({ 
              ...prev, 
              importantMessages: parsedMessages,
              hasError: true, // Still set hasError true to indicate we're using stale data
              errorMessage: 'Using cached data due to fetch error',
            }));
            
            // Show error toast but still display cached data
            toast({
              title: "Notification Error",
              description: "Using cached notifications. Some information may be outdated.",
              variant: "destructive"
            });
          }
        } catch (e) {
          console.error("Error parsing cached messages:", e);
        }
      } else {
        // Try demo messages as last resort
        const storedMessages = window.localStorage.getItem('demoMessages');
        if (storedMessages) {
          try {
            const parsedMessages = JSON.parse(storedMessages);
            if (Array.isArray(parsedMessages)) {
              setState(prev => ({ 
                ...prev, 
                importantMessages: parsedMessages,
                hasError: true
              }));
            }
          } catch (e) {
            console.error("Error parsing demo messages:", e);
          }
        }
      }
    }
  }, [state.showSystemMessages, state.isLoading, loadFromCache, saveToCache, config.enableRetry, config.maxRetries, logDebug]);
  
  // Force refresh function for manual refresh
  const refreshMessages = useCallback(() => {
    // Clear cache and force fetch
    localStorage.removeItem('cachedSystemMessages');
    localStorage.removeItem('cachedSystemMessagesTimestamp');
    fetchImportantMessages();
    logDebug('Manually refreshing messages');
  }, [fetchImportantMessages, logDebug]);
  
  useEffect(() => {
    if (state.showSystemMessages) {
      // Use a larger delay on initial load to prioritize other UI components
      const initialLoadTimer = setTimeout(() => {
        fetchImportantMessages();
        logDebug('Initial load timer executed');
      }, 2000);
      
      // Update messages every 10 minutes
      const interval = setInterval(() => {
        fetchImportantMessages();
        logDebug('Refresh interval executed');
      }, 10 * 60 * 1000);
      
      return () => {
        clearTimeout(initialLoadTimer);
        clearInterval(interval);
        logDebug('Cleanup: cleared timers');
      };
    } else {
      // Clear messages if disabled
      setState(prev => ({ ...prev, importantMessages: [] }));
      logDebug('System messages disabled, clearing messages');
    }
  }, [state.showSystemMessages, fetchImportantMessages, logDebug]);

  return {
    importantMessages: state.importantMessages,
    isLoading: state.isLoading,
    hasError: state.hasError,
    errorMessage: state.errorMessage,
    lastFetched: state.lastFetched,
    refreshMessages,
    cacheStatus: state.lastFetched 
      ? isCacheValid(state.lastFetched) 
        ? 'valid' 
        : 'expired' 
      : 'none'
  };
}
