
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
  
  // Function to fetch important messages
  const fetchImportantMessages = async () => {
    try {
      // Using the email_templates table as a temporary solution
      // This should be replaced with a proper system_messages table
      const { data, error } = await extendedSupabase
        .from('email_templates')
        .select('*')
        .eq('codigo', 'sistema_alerta')
        .limit(5);
      
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
      } else {
        // When testing locally, if no messages in the database, use local storage
        const storedMessages = window.localStorage.getItem('demoMessages');
        if (storedMessages) {
          setImportantMessages(JSON.parse(storedMessages));
        } else {
          setImportantMessages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching important messages:", error);
    }
  };
  
  useEffect(() => {
    fetchImportantMessages();
    
    // Update messages every 5 minutes
    const interval = setInterval(fetchImportantMessages, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
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
