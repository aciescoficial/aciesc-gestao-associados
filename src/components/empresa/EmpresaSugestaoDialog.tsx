
import React from 'react';
import { Building } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SugestaoEmpresaForm } from './sugestoes/form/SugestaoEmpresaForm';

interface EmpresaSugestaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmpresaSugestaoDialog: React.FC<EmpresaSugestaoDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Sugerir Empresa para Convênio
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da empresa que você gostaria de ver como conveniada da ACIESC.
          </DialogDescription>
        </DialogHeader>
        
        <SugestaoEmpresaForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default EmpresaSugestaoDialog;
