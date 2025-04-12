
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
          "hover:bg-aciesc-dark transition-colors duration-200 h-10 w-10 flex items-center justify-center rounded-md",
          isActive && "bg-aciesc-dark text-white"
        )}
      >
        <Link to={path || "#"} className="flex items-center justify-center text-white">
          {Icon && <Icon className="h-5 w-5" />}
          <span className="sr-only">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemComponent>
  );
};

export default SidebarMenuItem;
