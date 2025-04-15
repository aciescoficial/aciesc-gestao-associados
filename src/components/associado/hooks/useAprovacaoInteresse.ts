
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { getAssociadoInteresses, updateInterestStatus } from '../services/associadoInteressesService';

export const useAprovacaoInteresse = () => {
  const [interesses, setInteresses] = useState<AssociadoInteresse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pendente');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchField, setSearchField] = useState<'nome' | 'email'>('nome');
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchPendingInterests = async () => {
    try {
      setIsLoading(true);
      const data = await getAssociadoInteresses({
        status: statusFilter,
        searchTerm: searchTerm.trim() || undefined,
        searchField: searchTerm.trim() ? searchField : undefined
      });
      setInteresses(data);
    } catch (error) {
      console.error('Error fetching interests:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os interesses.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPendingInterests();
    }
  }, [isAdmin, statusFilter]);

  // Search function that will be triggered by the search button
  const handleSearch = async () => {
    await fetchPendingInterests();
  };

  const sendApprovalEmail = async (email: string, nome: string, sobrenome: string, token: string) => {
    try {
      // Generate payment link with token
      const paymentLink = `${window.location.origin}/associado-signup?token=${token}`;
      
      console.log('Sending approval email to:', email, 'with payment link:', paymentLink);
      
      // Send email using email template
      const { error } = await supabase.functions.invoke('send-email', {
        body: { 
          to: email,
          template_id: 'aprovacao_interesse',
          template_data: {
            nome: `${nome} ${sobrenome}`,
            email: email,
            link_pagamento: paymentLink
          }
        },
      });
      
      if (error) {
        console.error('Error sending approval email:', error);
        throw new Error(`Erro ao enviar email: ${error.message}`);
      }
      
      console.log('Approval email sent successfully');
      return true;
    } catch (error: any) {
      console.error('Error in sendApprovalEmail:', error);
      toast({
        title: 'Erro ao enviar email',
        description: error.message || 'Ocorreu um erro ao enviar o email de aprovação.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleApprove = async (id: string, email: string, nome: string, sobrenome: string) => {
    try {
      await updateInterestStatus(id, 'aprovado');
      
      // Generate a signup token valid for 7 days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      const token = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      
      // Save the token to database
      const { error: tokenError } = await supabase
        .from('signup_tokens')
        .insert({
          associado_interesse_id: id,
          token,
          expires_at: expiresAt.toISOString(),
          used: false
        });
      
      if (tokenError) {
        throw tokenError;
      }
      
      // Send approval email
      const emailSent = await sendApprovalEmail(email, nome, sobrenome, token);
      
      // Update local state
      setInteresses(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Interesse aprovado',
        description: emailSent 
          ? `Uma notificação foi enviada para ${nome} ${sobrenome} com instruções para cadastro.`
          : `Interesse aprovado, mas não foi possível enviar o email para ${email}.`,
        variant: emailSent ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error approving interest:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao aprovar o interesse. Tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      await updateInterestStatus(id, 'rejeitado');
      
      // Update local state
      setInteresses(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Interesse rejeitado',
        description: 'O interesse foi rejeitado com sucesso.',
      });
    } catch (error) {
      console.error('Error rejecting interest:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao rejeitar o interesse. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return {
    interesses,
    isLoading,
    isAdmin,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    fetchPendingInterests,
    handleSearch,
    handleApprove,
    handleReject
  };
};
