
import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
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
  
  return (
    <div className="flex items-center gap-2">
      {/* Notifications Dropdown */}
      <NotificationsDropdown />
      
      {/* Messages - Temporarily disabled */}
      {/* Message component code removed for now */}
      
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
