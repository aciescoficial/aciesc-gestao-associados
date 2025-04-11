
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
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="py-4">
        <div className="px-2 flex items-center justify-between">
          <h1 className="text-xl font-bold">ACIESC</h1>
          <SidebarTrigger />
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
