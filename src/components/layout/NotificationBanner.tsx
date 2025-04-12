
import React from 'react';
import { Bell, Calendar, AlertTriangle, Link } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface NotificationMessage {
  id: string;
  text: string;
  type: 'payment' | 'event' | 'inactive' | 'info';
  action?: {
    url: string;
    text: string;
  };
}

interface NotificationBannerProps {
  messages?: NotificationMessage[];
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ messages = [] }) => {
  // Se não houver mensagens, não renderiza o banner
  if (messages.length === 0) {
    return null;
  }
  
  // Por enquanto, exibe apenas a primeira mensagem importante
  const currentMessage = messages[0];
  
  // Seleciona o ícone baseado no tipo da mensagem
  const renderIcon = () => {
    switch (currentMessage.type) {
      case 'payment':
        return <Bell className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'event':
        return <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'inactive':
        return <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'info':
      default:
        return <Bell className="h-4 w-4 mr-2 flex-shrink-0" />;
    }
  };
  
  // Define a cor de fundo baseada no tipo da mensagem
  const getBgColor = () => {
    switch (currentMessage.type) {
      case 'payment':
        return 'bg-amber-50 text-amber-900';
      case 'event':
        return 'bg-blue-50 text-blue-900';
      case 'inactive':
        return 'bg-red-50 text-red-900';
      case 'info':
      default:
        return 'bg-amber-50 text-amber-900';
    }
  };
  
  const handleActionClick = () => {
    if (currentMessage.action && currentMessage.action.url) {
      window.location.href = currentMessage.action.url;
    }
  };

  return (
    <div className={`w-full ${getBgColor()} py-2 px-4 flex items-center justify-center`}>
      {renderIcon()}
      <p className="text-center text-sm">{currentMessage.text}</p>
      {currentMessage.action && (
        <button 
          onClick={handleActionClick}
          className="ml-2 font-medium underline flex items-center text-sm"
        >
          {currentMessage.action.text}
          <Link className="h-3 w-3 ml-1" />
        </button>
      )}
    </div>
  );
};

export default NotificationBanner;
