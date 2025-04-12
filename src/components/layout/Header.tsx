
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SystemVersion from './SystemVersion';
import HeaderActions from './HeaderActions';
import NotificationBanner from './NotificationBanner';
import { SidebarTrigger } from '../ui/sidebar';

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <NotificationBanner />
      <header className="bg-white border-b border-gray-200 text-gray-800 py-2 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <SidebarTrigger className="text-gray-600 mr-3 hover:text-gray-800" />
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
