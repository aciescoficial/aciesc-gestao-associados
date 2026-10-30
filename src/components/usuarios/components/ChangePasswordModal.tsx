
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
};

const ChangePasswordModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  userId,
  userEmail,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter no mínimo 6 caracteres',
        variant: 'destructive',
      });
      return;
    }
    
    setIsChanging(true);

    try {
      console.log('Chamando edge function para alterar senha');
      
      // Call the edge function to update the password
      const { data, error } = await supabase.functions.invoke('update-password', {
        body: {
          userId,
          password: newPassword,
          requestingUserId: user?.id,
        },
      });

      if (error) {
        console.error('Error calling update-password function:', error);
        throw new Error(error.message || 'Erro ao conectar com o serviço');
      }
      
      if (data?.error) {
        console.error('Error from update-password function:', data.error);
        throw new Error(data.error);
      }
      
      toast({
        title: 'Senha alterada',
        description: `A senha do usuário (${userEmail}) foi modificada com sucesso.`,
        variant: 'success',
      });
      
      // Reset the form and close the modal
      setNewPassword('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Erro ao alterar senha',
        description: error.message || 'Erro desconhecido ao alterar a senha.',
        variant: 'destructive',
      });
    } finally {
      setIsChanging(false);
    }
  };

  const resetForm = () => {
    setNewPassword('');
    setShowPassword(false);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) resetForm();
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Senha do Usuário</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 py-2" onSubmit={handleChangePassword}>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={isChanging}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                disabled={isChanging}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Esconder senha" : "Mostrar senha"}
                </span>
              </Button>
            </div>
            {newPassword && newPassword.length < 6 && (
              <p className="text-sm text-destructive">
                A senha deve ter pelo menos 6 caracteres
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isChanging}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isChanging || newPassword.length < 6}>
              {isChanging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Alterando...
                </>
              ) : (
                'Salvar nova senha'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
