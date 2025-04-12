
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminPermission } from "@/hooks/use-admin-permission";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  entityName: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  setIsOpen,
  title,
  description,
  onConfirm,
  entityName,
}) => {
  const { checkAdminPermission } = useAdminPermission();
  
  const handleConfirm = async () => {
    // Only proceed if the user is an admin
    if (!checkAdminPermission()) {
      setIsOpen(false);
      return;
    }
    
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
