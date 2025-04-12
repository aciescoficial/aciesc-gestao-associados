
import React from 'react';
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
};

// Mock data for notifications
const mockNotifications: Notification[] = [
  { 
    id: '1', 
    title: 'Pagamento confirmado', 
    message: 'Seu pagamento foi processado com sucesso', 
    date: '2 horas atrás', 
    read: false,
    type: 'success'
  },
  { 
    id: '2', 
    title: 'Evento agendado', 
    message: 'Palestra de networking confirmada', 
    date: 'Ontem', 
    read: false,
    type: 'info'
  },
  { 
    id: '3', 
    title: 'Atualização pendente', 
    message: 'Atualize suas informações cadastrais', 
    date: '3 dias atrás', 
    read: true,
    type: 'warning'
  },
  { 
    id: '4', 
    title: 'Carteirinha disponível', 
    message: 'Sua carteirinha digital está pronta', 
    date: '1 semana atrás', 
    read: true,
    type: 'info'
  },
];

interface NotificationsDropdownProps {
  className?: string;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ className }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-l-4 border-green-500';
      case 'warning': return 'bg-yellow-100 border-l-4 border-yellow-500';
      case 'error': return 'bg-red-100 border-l-4 border-red-500';
      default: return 'bg-blue-50 border-l-4 border-blue-500';
    }
  };

  return (
    <div className={cn("relative", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="z-50 w-80 p-0 bg-white shadow-md">
                <div className="p-2 border-b flex justify-between items-center">
                  <h4 className="font-medium text-sm">Notificações</h4>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={markAllAsRead}
                    >
                      Marcar tudo como lido
                    </Button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "p-3 border-b hover:bg-gray-50 cursor-pointer",
                          !notification.read && "bg-blue-50",
                          getTypeColor(notification.type)
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <span className="text-xs text-gray-500">{notification.date}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Nenhuma notificação
                    </div>
                  )}
                </div>
                <div className="p-2 border-t text-center">
                  <Button variant="link" size="sm" className="w-full text-sm">
                    Ver todas as notificações
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent>Notificações</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NotificationsDropdown;
