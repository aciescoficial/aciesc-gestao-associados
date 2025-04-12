
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
} from '@/components/ui/sidebar';
import SidebarMenuItems from './SidebarMenuItems';

interface MainSidebarProps {
  location: {
    pathname: string;
  };
}

const MainSidebar: React.FC<MainSidebarProps> = ({ location }) => {
  return (
    <Sidebar variant="sidebar" collapsible={true} className="bg-aciesc-primary text-white z-30">
      <SidebarHeader className="py-4 border-b border-aciesc-dark">
        <div className="px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">ACIESC</h1>
          <SidebarTrigger className="text-white hover:text-gray-200" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItems location={location} />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default MainSidebar;
