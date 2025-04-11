
import React from 'react';
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
  toggleMenu: (menuId: string) => void;
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
        className="flex items-center justify-between cursor-pointer py-2 px-2"
        onClick={() => toggleMenu(header)}
      >
        <SidebarGroupLabel>{header}</SidebarGroupLabel>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </div>
      
      {isExpanded && submenu && submenu.length > 0 && (
        <SidebarGroupContent>
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
