
import React from 'react';
import { SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';

const SidebarHeaderContent: React.FC = () => {
  return (
    <SidebarHeader className="py-4 border-b border-aciesc-dark">
      <div className="px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">ACIESC</h1>
        <SidebarTrigger className="text-white hover:text-gray-200" />
      </div>
    </SidebarHeader>
  );
};

export default SidebarHeaderContent;
