
import React from 'react';
import { SidebarHeader } from '@/components/ui/sidebar';
import LogoIcon from './LogoIcon';

const SidebarHeaderContent: React.FC = () => {
  return (
    <SidebarHeader className="py-4 flex items-center justify-center">
      <LogoIcon />
    </SidebarHeader>
  );
};

export default SidebarHeaderContent;
