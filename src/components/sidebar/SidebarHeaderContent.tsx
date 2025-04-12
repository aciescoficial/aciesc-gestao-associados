
import React from 'react';
import { SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { LogoIcon } from './icons/LogoIcon';

const SidebarHeaderContent: React.FC = () => {
  return (
    <SidebarHeader className="py-4 border-b border-aciesc-dark">
      <div className="px-2 flex items-center justify-between">
        <div className="flex items-center">
          <LogoIcon className="w-8 h-8 text-white" />
        </div>
        <SidebarTrigger className="text-white hover:text-gray-200" />
      </div>
    </SidebarHeader>
  );
};

export default SidebarHeaderContent;
