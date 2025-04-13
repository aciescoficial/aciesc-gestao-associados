
import React, { useState, useMemo, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import { useMessages } from '../mensagens/hooks/useMessages';

const HeaderActions: React.FC = () => {
  const isMobile = useIsMobile();
  const { unreadCount, messages } = useMessages();

  // Get most recent messages for the dropdown, memoized to prevent unnecessary re-renders
  const recentMessages = useMemo(() => {
    // Sort messages by date (most recent first) and take only the first 4
    return messages
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4)
      .map(msg => ({
        id: msg.id,
        title: msg.title,
        preview: msg.content.substring(0, 60) + (msg.content.length > 60 ? '...' : ''),
        date: formatRelativeDate(msg.date),
        read: msg.read
      }));
  }, [messages]);

  // Helper function to format dates in a relative way
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

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
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="z-50 w-80 p-0 bg-white shadow-md">
                <div className="p-2 border-b">
                  <h4 className="font-medium">Mensagens</h4>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {recentMessages.length > 0 ? (
                    recentMessages.map(message => (
                      <div key={message.id} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{message.title}</p>
                          <span className="text-xs text-gray-500">{message.date}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{message.preview}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Nenhuma mensagem recente
                    </div>
                  )}
                </div>
                <div className="p-2 border-t text-center">
                  <Link to="/mensagens">
                    <Button variant="link" size="sm" className="w-full">
                      Ver todas as mensagens
                    </Button>
                  </Link>
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
