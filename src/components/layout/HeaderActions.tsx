
import React, { useState } from 'react';
import { MessageSquare, HelpCircle } from 'lucide-react';
import UserProfileMenu from '../auth/UserProfileMenu';
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
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationsDropdown from '../notifications/NotificationsDropdown';

const HeaderActions: React.FC = () => {
  const isMobile = useIsMobile();
  const [unreadMessages, setUnreadMessages] = useState(3);

  // Mock messages data
  const recentMessages = [
    { id: 1, title: 'Pagamento confirmado', preview: 'Seu pagamento foi processado com sucesso', date: '2 horas atrás', read: false },
    { id: 2, title: 'Promoção especial', preview: 'Confira nossos novos descontos exclusivos', date: 'Ontem', read: false },
    { id: 3, title: 'Lembrete de reunião', preview: 'Reunião amanhã às 15:00', date: '2 dias atrás', read: true },
    { id: 4, title: 'Atualização de sistema', preview: 'Nova versão disponível do sistema', date: '3 dias atrás', read: true },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Notifications Dropdown */}
      <NotificationsDropdown />
      
      {/* Messages */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="z-50 w-80 p-0 bg-white shadow-md">
                <div className="p-2 border-b">
                  <h4 className="font-medium">Mensagens</h4>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {recentMessages.map(message => (
                    <div key={message.id} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}>
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">{message.title}</p>
                        <span className="text-xs text-gray-500">{message.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{message.preview}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t text-center">
                  <Button variant="link" size="sm" className="w-full">
                    Ver todas as mensagens
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent>Mensagens</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Help */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="z-50 w-80 p-0 bg-white shadow-md">
                <div className="p-2 border-b">
                  <h4 className="font-medium">Ajuda</h4>
                </div>
                <div className="p-3">
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      FAQ - Perguntas frequentes
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Vídeos de treinamento
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Contato via WhatsApp
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent>Ajuda</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* User Profile Menu */}
      <UserProfileMenu />
    </div>
  );
};

export default HeaderActions;
