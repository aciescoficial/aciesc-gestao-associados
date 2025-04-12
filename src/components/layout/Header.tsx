
import React from 'react';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import SystemVersion from './SystemVersion';
import HeaderActions from './HeaderActions';
import NotificationBanner from './NotificationBanner';
import { SidebarTrigger } from '../ui/sidebar';

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <NotificationBanner />
      <header className="bg-aciesc-primary text-white py-3 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <SidebarTrigger className="text-white mr-3 hover:text-gray-200" />
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
