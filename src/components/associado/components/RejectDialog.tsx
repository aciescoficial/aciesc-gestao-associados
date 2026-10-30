
import React from 'react';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw } from 'lucide-react';

interface RejectDialogProps {
  isOpen: boolean;
  isRejecting: boolean;
  selectedInterest: AssociadoInteresse | null;
  rejectReason: string;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const RejectDialog: React.FC<RejectDialogProps> = ({
  isOpen,
  isRejecting,
  selectedInterest,
  rejectReason,
  onReasonChange,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isRejecting && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeitar Interessado</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p>
            Confirma a rejeição de <strong>{selectedInterest?.nome} {selectedInterest?.sobrenome}</strong>?
          </p>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="rejection-reason">Motivo da rejeição</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Informe o motivo da rejeição (opcional)"
              value={rejectReason}
              onChange={(e) => onReasonChange(e.target.value)}
              rows={3}
              disabled={isRejecting}
            />
            <p className="text-sm text-muted-foreground">
              Informe um motivo para registro interno. Este motivo não será enviado ao interessado.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRejecting}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            disabled={isRejecting}
            className="flex items-center gap-1"
          >
            {isRejecting && <RefreshCw className="h-4 w-4 animate-spin" />}
            Confirmar Rejeição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
