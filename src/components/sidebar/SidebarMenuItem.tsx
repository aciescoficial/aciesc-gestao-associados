
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
          "hover:bg-[#2A2F3C] transition-colors duration-200",
          isActive && "bg-[#2A2F3C] text-white"
        )}
      >
        <Link to={path || "#"} className="flex items-center text-white">
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          <span className="truncate">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemComponent>
  );
};

export default SidebarMenuItem;
