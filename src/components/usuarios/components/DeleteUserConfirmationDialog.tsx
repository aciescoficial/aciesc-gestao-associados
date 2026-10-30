
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface DeleteUserConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  userEmail: string;
  hasAssociado?: boolean;
  deleteWithAssociado?: boolean;
  setDeleteWithAssociado?: (value: boolean) => void;
}

const DeleteUserConfirmationDialog: React.FC<DeleteUserConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  userEmail,
  hasAssociado = false,
  deleteWithAssociado = false,
  setDeleteWithAssociado = () => {}
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const isConfirmDisabled = confirmationText.toLowerCase() !== 'excluir';

  const handleClose = () => {
    if (!isLoading) {
      setConfirmationText('');
      onOpenChange(false);
    }
  };

  const handleConfirmClick = async () => {
    if (!isConfirmDisabled) {
      await onConfirm();
      setConfirmationText('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Você está prestes a excluir o usuário <strong>{userEmail}</strong>. Esta ação é irreversível.
            {hasAssociado && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                Atenção: Este usuário está vinculado a um registro de associado.
              </div>
            )}
            Para confirmar, digite a palavra <strong>Excluir</strong> abaixo.
          </DialogDescription>
        </DialogHeader>
        
        {hasAssociado && (
          <div className="flex items-center space-x-2 my-2">
            <Checkbox 
              id="deleteAssociado" 
              checked={deleteWithAssociado}
              onCheckedChange={(checked) => setDeleteWithAssociado(checked === true)}
            />
            <label 
              htmlFor="deleteAssociado" 
              className="text-sm font-medium leading-none cursor-pointer text-red-600"
            >
              Excluir também o associado vinculado
            </label>
          </div>
        )}
        
        <input
          autoFocus
          className="w-full border rounded-md px-3 py-2 mt-4 text-lg"
          placeholder="Digite 'Excluir' para confirmar"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          disabled={isLoading}
          type="text"
        />
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmClick}
            disabled={isConfirmDisabled || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Confirmar Exclusão"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserConfirmationDialog;
