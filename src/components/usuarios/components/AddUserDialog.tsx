
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '../types';
import { UploadCloud } from 'lucide-react';

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: {
    name: string;
    email: string;
    role: UserRole;
    password: string;
    paymentProof: File | null;
  };
  onNewUserChange: (field: string, value: string | File | null) => void;
  onAddUser: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  isOpen,
  onOpenChange,
  newUser,
  onNewUserChange,
  onAddUser
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecione um arquivo PDF, JPG ou PNG.');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB.');
        return;
      }

      onNewUserChange('paymentProof', file);

      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDF, just show the file name
        setFilePreview('pdf');
      }
    }
  };

  const clearFile = () => {
    onNewUserChange('paymentProof', null);
    setFilePreview(null);
  };

  const renderFilePreview = () => {
    if (!filePreview) return null;
    
    if (filePreview === 'pdf') {
      return (
        <div className="flex items-center p-2 bg-gray-100 rounded">
          <span className="text-sm font-medium">
            {newUser.paymentProof?.name}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFile} 
            className="ml-2 h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      );
    }
    
    return (
      <div className="relative mt-2">
        <img 
          src={filePreview} 
          alt="Preview" 
          className="max-h-32 rounded border"
        />
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={clearFile} 
          className="absolute top-1 right-1 h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={newUser.name}
              onChange={(e) => onNewUserChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => onNewUserChange('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) => onNewUserChange('password', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Tipo de Usuário</Label>
            <Select
              value={newUser.role}
              onValueChange={(value) => onNewUserChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Associado</SelectItem>
                <SelectItem value="empresa">Empresa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentProof">Comprovante de Pagamento</Label>
            <div className="flex flex-col gap-2">
              <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="file"
                  id="paymentProof"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="paymentProof" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium">Clique para fazer upload</span>
                  <span className="text-xs text-gray-500 mt-1">PDF, JPG ou PNG (máx. 5MB)</span>
                </label>
              </div>
              {renderFilePreview()}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onAddUser}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
