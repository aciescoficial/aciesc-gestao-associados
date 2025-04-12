
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  SidebarMenuItem as SidebarMenuItemComponent, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

interface SidebarMenuItemProps {
  icon?: LucideIcon;
  label?: string;
  path?: string;
  isActive: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive 
}) => {
  return (
    <SidebarMenuItemComponent>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        tooltip={label}
        className={cn(
          "hover:bg-indigo-700 transition-colors duration-200 rounded-md px-3 py-2 my-1 flex items-center",
          isActive && "bg-indigo-800 text-white"
        )}
      >
        <Link to={path || "#"} className="flex items-center text-white w-full">
          {Icon && <Icon className="mr-3 h-5 w-5" />}
          <span className="text-sm">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemComponent>
  );
};

export default SidebarMenuItem;
