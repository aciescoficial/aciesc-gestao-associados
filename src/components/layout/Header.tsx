
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SystemVersion from './SystemVersion';
import HeaderActions from './HeaderActions';
import NotificationBanner from './NotificationBanner';

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <NotificationBanner />
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
