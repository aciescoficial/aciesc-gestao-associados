
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AssociadoFormEdit from '../components/AssociadoFormEdit';

const EditarAssociadoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [associado, setAssociado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    navigate(-1);
  };
  
  const handleSubmit = async (formData: any) => {
    if (!id) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('associados')
        .update({
          nome: formData.nome,
          sobrenome: formData.sobrenome,
          email: formData.email,
          telefone: formData.telefone,
          cpf: formData.cpf,
          creci: formData.creci,
          data_nascimento: formData.dataNascimento,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep,
          placa_principal: formData.placaPrincipal,
          placa_secundaria: formData.placaSecundaria,
          valor_pago: formData.valorPago,
          valor_devido: formData.valorDevido,
          tipo_pagamento: formData.tipoPagamento,
          tipo_associado: formData.tipoAssociado,
          validade: formData.validade,
          status: formData.status
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Associado atualizado",
        description: "Os dados do associado foram atualizados com sucesso.",
      });
      
      navigate(`/associados/visualizar/${id}`);
    } catch (error: any) {
      console.error("Error updating associado:", error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar os dados do associado.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="wp-header">Editar Associado</h1>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
        <Card className="p-6 flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando dados...</span>
        </Card>
      </div>
    );
  }

  if (!associado) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="wp-header">Editar Associado</h1>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Associado não encontrado.
          </p>
        </Card>
      </div>
    );
  }

  // Transform associado data for form
  const formData = {
    ...associado,
    dataNascimento: associado.data_nascimento,
    placaPrincipal: associado.placa_principal,
    placaSecundaria: associado.placa_secundaria,
    valorPago: associado.valor_pago,
    valorDevido: associado.valor_devido,
    tipoPagamento: associado.tipo_pagamento,
    tipoAssociado: associado.tipo_associado
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="wp-header">Editar Associado</h1>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </div>

      <Card className="p-6">
        {/* This component will be implemented separately */}
        <AssociadoFormEdit 
          initialData={formData} 
          onSubmit={handleSubmit} 
          isSaving={saving}
        />
      </Card>
    </div>
  );
};

export default EditarAssociadoPage;
