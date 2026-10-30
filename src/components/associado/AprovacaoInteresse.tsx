
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import InteresseDesktopTable from './components/InteresseDesktopTable';
import InteresseMobileCard from './components/InteresseMobileCard';
import ApprovalDialog from './components/ApprovalDialog';
import { useInteresseSearch } from './hooks/useInteresseSearch';
import { useApprovalDialog } from './hooks/useApprovalDialog';
import { useRejectDialog } from './hooks/useRejectDialog';
import InteresseHeader from './components/InteresseHeader';
import LoadingInteresse from './components/LoadingInteresse';
import EmptyInteresseState from './components/EmptyInteresseState';
import RejectDialog from './components/RejectDialog';

const AprovacaoInteresse: React.FC = () => {
  const {
    interessados,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    loading,
    handleSearch,
    loadInteressados
  } = useInteresseSearch();

  // Add useEffect to load data on component mount
  useEffect(() => {
    loadInteressados();
  }, []);

  const {
    isProcessingApproval,
    selectedInterestForApproval,
    isApprovalDialogOpen,
    approvalError,
    openApprovalDialog,
    closeApprovalDialog,
    confirmApprove
  } = useApprovalDialog(loadInteressados);

  const {
    isRejecting,
    selectedInterest,
    isRejectDialogOpen,
    rejectReason,
    setRejectReason,
    openRejectDialog,
    closeRejectDialog,
    confirmReject
  } = useRejectDialog(loadInteressados);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <InteresseHeader
            interessadosCount={interessados.length}
            searchTerm={searchTerm}
            searchField={searchField}
            onSearchTermChange={setSearchTerm}
            onSearchFieldChange={setSearchField}
            onSearch={handleSearch}
            onRefresh={loadInteressados}
            isLoading={loading}
          />
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <LoadingInteresse />
          ) : interessados.length === 0 ? (
            <EmptyInteresseState />
          ) : (
            <>
              <div className="hidden md:block">
                <InteresseDesktopTable 
                  interesses={interessados} 
                  onApprove={openApprovalDialog} 
                  onReject={(id) => {
                    const interesse = interessados.find(item => item.id === id);
                    if (interesse) openRejectDialog(interesse);
                  }} 
                />
              </div>
              
              <div className="md:hidden">
                {interessados.map((interesse) => (
                  <InteresseMobileCard 
                    key={interesse.id} 
                    interesse={interesse} 
                    onApprove={openApprovalDialog} 
                    onReject={(id) => {
                      const interesse = interessados.find(item => item.id === id);
                      if (interesse) openRejectDialog(interesse);
                    }} 
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      {selectedInterestForApproval && (
        <ApprovalDialog
          isOpen={isApprovalDialogOpen}
          onClose={closeApprovalDialog}
          onApprove={confirmApprove}
          nome={selectedInterestForApproval.nome}
          sobrenome={selectedInterestForApproval.sobrenome}
          email={selectedInterestForApproval.email}
          isProcessing={isProcessingApproval}
          error={approvalError}
        />
      )}

      {/* Rejection Dialog */}
      <RejectDialog
        isOpen={isRejectDialogOpen}
        isRejecting={isRejecting}
        selectedInterest={selectedInterest}
        rejectReason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={closeRejectDialog}
        onConfirm={confirmReject}
      />
    </div>
  );
};

export default AprovacaoInteresse;
