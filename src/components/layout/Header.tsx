
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SystemVersion from './SystemVersion';
import HeaderActions from './HeaderActions';
import NotificationBanner, { NotificationMessage } from './NotificationBanner';
import { supabase } from '@/integrations/supabase/client';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [importantMessages, setImportantMessages] = useState<NotificationMessage[]>([]);
  
  // Função para buscar mensagens importantes
  const fetchImportantMessages = async () => {
    try {
      // Esta é uma implementação de exemplo - você precisará ajustar conforme sua estrutura de dados
      const { data, error } = await supabase
        .from('system_messages')
        .select('*')
        .eq('is_important', true)
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Formatar as mensagens para o formato esperado pelo NotificationBanner
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          text: msg.message,
          type: msg.type || 'info',
          action: msg.action_url ? {
            url: msg.action_url,
            text: msg.action_text || 'Clique aqui'
          } : undefined
        }));
        
        setImportantMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens importantes:", error);
    }
  };
  
  useEffect(() => {
    fetchImportantMessages();
    
    // Atualiza as mensagens a cada 5 minutos
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
