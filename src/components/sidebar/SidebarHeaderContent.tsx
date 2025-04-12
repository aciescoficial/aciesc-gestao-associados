
import React from 'react';
import { SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';

const SidebarHeaderContent: React.FC = () => {
  return (
    <SidebarHeader className="py-2 border-b border-aciesc-dark flex justify-center">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-white flex items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-md text-white font-bold bg-aciesc-dark">
            A
          </div>
        </div>
        <SidebarTrigger className="text-white hover:text-gray-200 ml-2" />
      </div>
    </SidebarHeader>
  );
};

export default SidebarHeaderContent;
