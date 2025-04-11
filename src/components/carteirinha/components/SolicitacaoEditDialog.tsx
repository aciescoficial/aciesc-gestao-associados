
import React, { useState } from 'react';
import { CarteirinhaSolicitacao } from '../types';
import { statusOptions } from './StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface SolicitacaoEditDialogProps {
  solicitacao: CarteirinhaSolicitacao;
  onUpdate: (id: string, data: Partial<CarteirinhaSolicitacao>) => Promise<boolean>;
  onSuccess?: () => void;
}

export const SolicitacaoEditDialog: React.FC<SolicitacaoEditDialogProps> = ({ 
  solicitacao, 
  onUpdate,
  onSuccess 
}) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<CarteirinhaSolicitacao>(solicitacao);
  const [rastreioCode, setRastreioCode] = useState(solicitacao.codigo_rastreio || '');
  const [observacoes, setObservacoes] = useState(solicitacao.observacoes || '');

  const handleStatusChange = async () => {
    const updateData: Partial<CarteirinhaSolicitacao> = {
      status: editData.status,
      codigo_rastreio: rastreioCode || undefined,
      observacoes: observacoes || undefined
    };
    
    const success = await onUpdate(editData.id, updateData);
    
    if (success) {
      setOpen(false);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" 
          size="icon" 
          onClick={() => {
            setEditData(solicitacao);
            setRastreioCode(solicitacao.codigo_rastreio || '');
            setObservacoes(solicitacao.observacoes || '');
          }}
        >
          <FileText className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Solicitação</DialogTitle>
          <DialogDescription>
            Altere o status ou adicione informações da solicitação
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div>
            <h4 className="text-sm font-medium mb-1">Solicitante</h4>
            <p>{`${editData?.nome} ${editData?.sobrenome}`}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Endereço de Entrega</h4>
            <p className="text-sm">{editData?.endereco_entrega}</p>
            {editData?.complemento && <p className="text-sm">{editData.complemento}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select 
              value={editData?.status} 
              onValueChange={(value) => {
                setEditData({ ...editData, status: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.filter(opt => opt.value).map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="rastreio" className="text-sm font-medium">
              Código de Rastreio
            </label>
            <Input
              id="rastreio"
              value={rastreioCode}
              onChange={(e) => setRastreioCode(e.target.value)}
              placeholder="Código de rastreio da entrega"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="observacoes" className="text-sm font-medium">
              Observações
            </label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações adicionais"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleStatusChange}
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
