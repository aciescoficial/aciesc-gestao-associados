
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminPermission } from '@/hooks/use-admin-permission';

const VisualizarAssociadoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAdminPermission();
  const [associado, setAssociado] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssociado = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('associados')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setAssociado(data);
      } catch (error: any) {
        console.error("Error fetching associado:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do associado.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssociado();
  }, [id, toast]);

  const handleBack = () => {
    navigate('/associados/pesquisa');
  };
  
  const handleEdit = () => {
    if (id) {
      navigate(`/associados/editar/${id}`);
    }
  };
  
  const handleUserManagement = () => {
    if (id) {
      navigate(`/associados/usuario/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="wp-header">Detalhes do Associado</h1>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!associado) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="wp-header">Detalhes do Associado</h1>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Associado não encontrado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="wp-header">Detalhes do Associado</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          {isAdmin && (
            <Button variant="default" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
          )}
          <Button variant="secondary" onClick={handleUserManagement}>
            <User className="h-4 w-4 mr-2" /> Gerenciar Usuário
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{associado.nome} {associado.sobrenome}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPF</p>
              <p className="font-medium">{associado.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{associado.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{associado.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CRECI</p>
              <p className="font-medium">{associado.creci || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Nascimento</p>
              <p className="font-medium">
                {associado.data_nascimento ? new Date(associado.data_nascimento).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{associado.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Rua</p>
              <p className="font-medium">{associado.rua || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Número</p>
              <p className="font-medium">{associado.numero || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bairro</p>
              <p className="font-medium">{associado.bairro || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Complemento</p>
              <p className="font-medium">{associado.complemento || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cidade</p>
              <p className="font-medium">{associado.cidade || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">{associado.estado || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CEP</p>
              <p className="font-medium">{associado.cep || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Placa Principal</p>
              <p className="font-medium">{associado.placa_principal || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Placa Secundária</p>
              <p className="font-medium">{associado.placa_secundaria || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Associado</p>
              <p className="font-medium">{associado.tipo_associado || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Pagamento</p>
              <p className="font-medium">{associado.tipo_pagamento || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Pago</p>
              <p className="font-medium">{associado.valor_pago || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Devido</p>
              <p className="font-medium">{associado.valor_devido || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Validade</p>
              <p className="font-medium">
                {associado.validade ? new Date(associado.validade).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizarAssociadoPage;
