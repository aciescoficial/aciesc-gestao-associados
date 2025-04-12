
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu
} from '@/components/ui/sidebar';
import SidebarMenuItem from './SidebarMenuItem';

interface SubmenuItem {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  roles?: string[];
}

interface SidebarSubmenuProps {
  header: string;
  submenu: SubmenuItem[];
  isExpanded: boolean;
  toggleMenu: () => void;
  isActive: (path: string) => boolean;
}

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({ 
  header, 
  submenu, 
  isExpanded, 
  toggleMenu, 
  isActive 
}) => {
  return (
    <SidebarGroup key={header}>
      <div 
        className="flex items-center justify-between cursor-pointer py-2 px-4 text-white hover:bg-aciesc-dark transition-colors"
        onClick={toggleMenu}
      >
        <SidebarGroupLabel className="text-white text-sm">{header}</SidebarGroupLabel>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-white" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white" />
        )}
      </div>
      
      {isExpanded && submenu && submenu.length > 0 && (
        <SidebarGroupContent className="bg-aciesc-dark bg-opacity-30">
          <SidebarMenu>
            {submenu.map((subItem, index) => (
              <SidebarMenuItem
                key={index}
                icon={subItem.icon}
                label={subItem.label}
                path={subItem.path}
                isActive={isActive(subItem.path!)}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
};

export default SidebarSubmenu;
