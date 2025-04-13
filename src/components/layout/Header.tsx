
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SystemVersion from './SystemVersion';
import HeaderActions from './HeaderActions';
import NotificationBanner, { NotificationMessage } from './NotificationBanner';
import { supabase } from '@/integrations/supabase/client';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { Skeleton } from "@/components/ui/skeleton";

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [importantMessages, setImportantMessages] = useState<NotificationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Function to fetch important messages with improved performance
  const fetchImportantMessages = async () => {
    // Check if we're already loading data to prevent duplicate requests
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // First check local storage for cached messages
      const cachedMessages = localStorage.getItem('cachedSystemMessages');
      const cacheTimestamp = localStorage.getItem('cachedSystemMessagesTimestamp');
      
      // Use cache if it's less than 5 minutes old
      if (cachedMessages && cacheTimestamp) {
        const timestamp = parseInt(cacheTimestamp, 10);
        const now = Date.now();
        
        // Cache valid for 5 minutes
        if (now - timestamp < 5 * 60 * 1000) {
          const parsedMessages = JSON.parse(cachedMessages);
          if (Array.isArray(parsedMessages)) {
            setImportantMessages(parsedMessages);
            setIsLoading(false);
            return;
          }
        }
      }
      
      // Using the email_templates table as a temporary solution
      // Set a timeout to abort if the query takes too long
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Query timeout")), 8000); // Increased to 8 second timeout
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
        const formattedMessages = data.map(template => ({
          id: template.id || String(Math.random()),
          text: template.assunto || 'Notificação do sistema', // Using the subject as the message text
          type: 'info' as 'payment' | 'event' | 'inactive' | 'info', // Default type
          action: template.corpo && template.corpo.includes('http') ? {
            url: template.corpo.match(/https?:\/\/[^\s]+/)?.[0] || '#',
            text: 'Saiba mais'
          } : undefined
        }));
        
        setImportantMessages(formattedMessages);
        setHasError(false);
        
        // Cache the messages
        localStorage.setItem('cachedSystemMessages', JSON.stringify(formattedMessages));
        localStorage.setItem('cachedSystemMessagesTimestamp', Date.now().toString());
      } else {
        // When testing locally, if no messages in the database, use demo messages
        const storedMessages = window.localStorage.getItem('demoMessages');
        if (storedMessages) {
          try {
            const parsedMessages = JSON.parse(storedMessages);
            if (Array.isArray(parsedMessages)) {
              setImportantMessages(parsedMessages);
            } else {
              setImportantMessages([]);
            }
          } catch (e) {
            setImportantMessages([]);
          }
        } else {
          setImportantMessages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching important messages:", error);
      setHasError(true);
      
      // On error, try to use cached messages or demo messages
      const cachedMessages = localStorage.getItem('cachedSystemMessages');
      if (cachedMessages) {
        try {
          const parsedMessages = JSON.parse(cachedMessages);
          if (Array.isArray(parsedMessages)) {
            setImportantMessages(parsedMessages);
          }
        } catch (e) {
          console.error("Error parsing cached messages:", e);
        }
      } else {
        const storedMessages = window.localStorage.getItem('demoMessages');
        if (storedMessages) {
          try {
            const parsedMessages = JSON.parse(storedMessages);
            if (Array.isArray(parsedMessages)) {
              setImportantMessages(parsedMessages);
            }
          } catch (e) {
            console.error("Error parsing demo messages:", e);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Use a larger delay on initial load to prioritize other UI components
    const initialLoadTimer = setTimeout(fetchImportantMessages, 2000);
    
    // Update messages every 10 minutes instead of 5
    const interval = setInterval(fetchImportantMessages, 10 * 60 * 1000);
    
    return () => {
      clearTimeout(initialLoadTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <ErrorBoundary>
      <header>
        <NotificationBanner messages={importantMessages} />
        <div className="bg-aciesc-primary text-white py-3 px-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <div className="flex items-center">
              <SystemVersion />
            </div>
          </div>
          
          <HeaderActions />
        </div>
      </header>
    </ErrorBoundary>
  );
};

// Simple error boundary component to prevent the entire page from crashing
const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Error caught by ErrorBoundary:", event.error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <header className="bg-aciesc-primary text-white py-3 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center">
            <SystemVersion />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </header>
    );
  }

  return <>{children}</>;
};

export default Header;
