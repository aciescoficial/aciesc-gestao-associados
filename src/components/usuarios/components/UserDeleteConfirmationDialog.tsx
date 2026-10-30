
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface UserDeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  hasAssociado: boolean;
  deleteWithAssociado: boolean;
  setDeleteWithAssociado: (value: boolean) => void;
}

const UserDeleteConfirmationDialog: React.FC<UserDeleteConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  userEmail,
  onConfirm,
  isLoading,
  hasAssociado,
  deleteWithAssociado,
  setDeleteWithAssociado
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Excluir Usuário</DialogTitle>
          <DialogDescription className="pt-2">
            Você tem certeza que deseja excluir permanentemente o usuário <span className="font-bold">{userEmail}</span>?
            <p className="mt-2 text-destructive flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Esta ação não pode ser desfeita.
            </p>
          </DialogDescription>
        </DialogHeader>
        {hasAssociado && (
          <div className="flex items-start space-x-2 py-2 border-t border-b">
            <Checkbox 
              id="delete-associado" 
              checked={deleteWithAssociado}
              onCheckedChange={(checked) => setDeleteWithAssociado(!!checked)}
              className="mt-0.5"
            />
            <label
              htmlFor="delete-associado"
              className="text-sm font-medium leading-tight"
            >
              Excluir também o registro de associado vinculado
              <p className="text-muted-foreground text-xs mt-1 font-normal">
                Se marcado, o registro do associado será completamente removido do sistema
              </p>
            </label>
          </div>
        )}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeleteConfirmationDialog;
