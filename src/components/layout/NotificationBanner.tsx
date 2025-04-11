
import React from 'react';
import { Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NotificationBannerProps {
  message?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ 
  message = "Sua mensalidade vence todo dia 10, para evitar a suspensão da sua conta, efetue o pagamento." 
}) => {
  return (
    <div className="w-full bg-amber-50 text-amber-900 py-2 px-4 flex items-center justify-center">
      <Bell className="h-4 w-4 mr-2 flex-shrink-0" />
      <p className="text-center text-sm">{message}</p>
    </div>
  );
};

export default NotificationBanner;
