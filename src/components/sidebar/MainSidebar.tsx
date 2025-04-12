
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import SidebarMenuItems from './SidebarMenuItems';
import SidebarHeaderContent from './SidebarHeaderContent';

interface MainSidebarProps {
  location: {
    pathname: string;
  };
}

const MainSidebar: React.FC<MainSidebarProps> = ({ location }) => {
  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="bg-[#1A1F2C] text-white z-30 w-[200px]"
      style={{ "--sidebar-width": "200px", "--sidebar-width-icon": "64px" } as React.CSSProperties}
    >
      <SidebarHeaderContent />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItems location={location} />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default MainSidebar;
