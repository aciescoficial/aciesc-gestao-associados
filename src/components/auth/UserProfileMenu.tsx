
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Settings, LogOut, User, UserCog } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const UserProfileMenu = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setUserName(data.name || '');
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to="/login">Login</Link>
      </Button>
    );
  }
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (userName) {
      const nameParts = userName.trim().split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return userName.substring(0, 2).toUpperCase();
    }
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || undefined} alt={userName} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/perfil" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Administração</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/configuracoes" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/usuarios/gerenciar" className="flex items-center">
                <UserCog className="mr-2 h-4 w-4" />
                <span>Gerenciar Usuários</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
