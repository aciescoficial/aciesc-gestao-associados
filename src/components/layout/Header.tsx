
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SystemVersion from './SystemVersion';
import HeaderActions from './HeaderActions';
import NotificationBanner, { NotificationMessage } from './NotificationBanner';
import { supabase } from '@/integrations/supabase/client';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [importantMessages, setImportantMessages] = useState<NotificationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
          setImportantMessages(JSON.parse(cachedMessages));
          setIsLoading(false);
          return;
        }
      }
      
      // Using the email_templates table as a temporary solution
      // Set a timeout to abort if the query takes too long
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Query timeout")), 3000); // 3 second timeout
      });
      
      const queryPromise = extendedSupabase
        .from('email_templates')
        .select('*')
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
          id: template.id,
          text: template.assunto, // Using the subject as the message text
          type: 'info' as 'payment' | 'event' | 'inactive' | 'info', // Default type
          action: template.corpo.includes('http') ? {
            url: template.corpo.match(/https?:\/\/[^\s]+/)?.[0] || '#',
            text: 'Saiba mais'
          } : undefined
        }));
        
        setImportantMessages(formattedMessages);
        
        // Cache the messages
        localStorage.setItem('cachedSystemMessages', JSON.stringify(formattedMessages));
        localStorage.setItem('cachedSystemMessagesTimestamp', Date.now().toString());
      } else {
        // When testing locally, if no messages in the database, use demo messages
        const storedMessages = window.localStorage.getItem('demoMessages');
        if (storedMessages) {
          setImportantMessages(JSON.parse(storedMessages));
        } else {
          setImportantMessages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching important messages:", error);
      
      // On error, try to use cached messages or demo messages
      const cachedMessages = localStorage.getItem('cachedSystemMessages');
      if (cachedMessages) {
        setImportantMessages(JSON.parse(cachedMessages));
      } else {
        const storedMessages = window.localStorage.getItem('demoMessages');
        if (storedMessages) {
          setImportantMessages(JSON.parse(storedMessages));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Use a small delay on initial load to prioritize other UI components
    const initialLoadTimer = setTimeout(fetchImportantMessages, 500);
    
    // Update messages every 5 minutes
    const interval = setInterval(fetchImportantMessages, 5 * 60 * 1000);
    
    return () => {
      clearTimeout(initialLoadTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <NotificationBanner messages={importantMessages} />
      <header className="bg-aciesc-primary text-white py-3 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center">
            <SystemVersion />
          </div>
        </div>
        
        <HeaderActions />
      </header>
    </>
  );
};

export default Header;
