
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { associadoUserService } from '@/components/associado/services/associadoUserService';

const UserManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [associado, setAssociado] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [hasUser, setHasUser] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Fetch associado and related user data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch associado data
        const { data: associadoData, error: associadoError } = await supabase
          .from('associados')
          .select('id, nome, sobrenome, email')
          .eq('id', id)
          .single();

        if (associadoError) throw associadoError;
        setAssociado(associadoData);
        setEmail(associadoData.email || '');

        // Check if this associado has a linked user
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('*')
          .eq('associado_id', id)
          .maybeSingle();

        if (userError && userError.code !== 'PGRST116') throw userError;
        
        if (userData) {
          setUserDetails(userData);
          setHasUser(true);
          setIsActive(userData.active || false);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: error.message || 'Não foi possível carregar os dados do associado',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleSave = async () => {
    if (!id || !associado) return;

    try {
      setSaving(true);

      if (hasUser && userDetails) {
        // Update existing user
        const { error } = await supabase
          .from('user')
          .update({ 
            email: email, 
            active: isActive 
          })
          .eq('id', userDetails.id);

        if (error) throw error;

        toast({
          title: 'Usuário atualizado',
          description: 'As informações do usuário foram atualizadas com sucesso.',
          variant: 'default'
        });
      } else if (hasUser) {
        // Toggle user status
        const { error } = await supabase
          .from('user')
          .update({ active: isActive })
          .eq('associado_id', id);

        if (error) throw error;

        toast({
          title: 'Status do usuário atualizado',
          description: `O usuário foi ${isActive ? 'ativado' : 'desativado'} com sucesso.`,
          variant: 'default'
        });
      } else {
        // Create new user invitation
        // Using custom function instead of RPC
        const result = await associadoUserService.sendRegistrationEmail({
          email: email,
          nome: associado.nome,
          sobrenome: associado.sobrenome,
          associadoId: id
        });

        if (!result.success) throw result.error;

        setHasUser(true);
        toast({
          title: 'Convite enviado',
          description: 'Um convite foi enviado para o e-mail do associado.',
          variant: 'default'
        });
      }

      // Refresh user data
      const { data: refreshedData, error: refreshError } = await supabase
        .from('user')
        .select('*')
        .eq('associado_id', id)
        .maybeSingle();

      if (refreshError && refreshError.code !== 'PGRST116') throw refreshError;
      if (refreshedData) {
        setUserDetails(refreshedData);
        setIsActive(refreshedData.active || false);
      }
    } catch (error: any) {
      console.error('Error saving user data:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar as alterações',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/associados/pesquisa');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Gerenciar Usuário do Associado</h1>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCog className="h-5 w-5 mr-2" />
            {associado?.nome} {associado?.sobrenome}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email do Usuário</Label>
            <Input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={hasUser}
              placeholder="email@exemplo.com"
            />
            {hasUser && (
              <p className="text-sm text-muted-foreground">
                O email não pode ser alterado depois que o usuário foi criado.
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="active"
              checked={isActive} 
              onCheckedChange={setIsActive}
              disabled={!hasUser}
            />
            <Label htmlFor="active">Usuário ativo</Label>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : hasUser ? 'Atualizar Usuário' : 'Criar Usuário'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;
