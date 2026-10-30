
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { useSearchInteresse } from './useSearchInteresse';
import { useApprovalDialog } from './useApprovalDialog';
import { useRejectDialog } from './useRejectDialog';

export const useAprovacaoInteresse = () => {
  const [interesses, setInteresses] = useState<AssociadoInteresse[]>([]);
  const { isAdmin } = useAuth();
  
  const {
    isLoading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    fetchInteresses
  } = useSearchInteresse();

  // Define fetchPendingInterests function before using it
  const fetchPendingInterests = async () => {
    if (!isAdmin) {
      console.log('User is not admin, skipping fetch');
      setInteresses([]);
      return;
    }

    const data = await fetchInteresses();
    setInteresses(data);
  };

  const {
    isProcessingApproval,
    selectedInterestForApproval,
    isApprovalDialogOpen,
    approvalError,
    openApprovalDialog,
    closeApprovalDialog,
    confirmApprove
  } = useApprovalDialog(fetchPendingInterests);

  const {
    isRejecting,
    selectedInterest,
    isRejectDialogOpen,
    rejectReason,
    setRejectReason,
    openRejectDialog,
    closeRejectDialog,
    confirmReject
  } = useRejectDialog(fetchPendingInterests);

  useEffect(() => {
    if (!isAdmin) return;

    console.log('Setting up realtime subscription...');
    const channel = supabase
      .channel('interessados-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'associado_interesse'
        },
        async () => {
          console.log('New interest detected, refreshing...');
          await fetchPendingInterests();
        }
      )
      .subscribe();

    // Initial fetch
    fetchPendingInterests();

    return () => {
      console.log('Cleaning up realtime subscription...');
      supabase.removeChannel(channel);
    };
  }, [statusFilter, isAdmin]);

  const handleSearch = async () => {
    await fetchPendingInterests();
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
    handleSearch,
    openApprovalDialog,
    closeApprovalDialog,
    confirmApprove,
    isApprovalDialogOpen,
    isProcessingApproval,
    selectedInterestForApproval,
    approvalError,
    openRejectDialog,
    closeRejectDialog,
    confirmReject,
    isRejectDialogOpen,
    isRejecting,
    selectedInterest,
    rejectReason,
    setRejectReason,
    fetchPendingInterests
  };
};

export default useAprovacaoInteresse;
