
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface ProfileFormProps {
  user: any;
  name: string;
  phone: string;
  role: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
}

export const ProfileForm = ({ 
  user, 
  name, 
  phone, 
  role,
  onNameChange,
  onPhoneChange
}: ProfileFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name, 
          phone,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram atualizados com sucesso.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get user role label
  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'user': return 'Usuário Normal';
      default: return 'Usuário';
    }
  };

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            type="email" 
            value={user.email || ''}
            disabled
          />
          <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-1">
            <span>Telefone</span>
          </Label>
          <Input 
            id="phone" 
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(00) 00000-0000" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="flex items-center gap-1">
            <span>Nível do Usuário</span>
          </Label>
          <div className="p-2 bg-muted rounded-md border">
            {getRoleLabel(role)}
          </div>
        </div>
      </div>
      <Button 
        type="submit" 
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
};
