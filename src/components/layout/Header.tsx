
import React from 'react';
import { Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import SystemVersion from './SystemVersion';
import HeaderActions from './HeaderActions';
import NotificationBanner from './NotificationBanner';
import { SidebarTrigger } from '../ui/sidebar';
import { Input } from '../ui/input';

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <NotificationBanner />
      <header className="bg-white border-b border-gray-200 py-2 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-gray-500 mr-2 hover:text-gray-700 md:hidden" />
          <div className="relative max-w-md hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search..." 
              className="pl-8 bg-gray-50 border-gray-200 focus:bg-white w-[300px]" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <SystemVersion />
          <HeaderActions />
        </div>
      </header>
    </>
  );
};

export default Header;
