
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { UserRole } from '@/components/usuarios/types';

interface RegisterFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  passwordsMatch: boolean;
  organizationType: UserRole;
  setOrganizationType: (type: UserRole) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordsMatch,
  organizationType,
  setOrganizationType,
  isLoading,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name" 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-register">E-mail</Label>
        <Input 
          id="email-register" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-register">Senha</Label>
        <div className="relative">
          <Input 
            id="password-register" 
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password-register">Confirmar Senha</Label>
        <div className="relative">
          <Input 
            id="confirm-password-register" 
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
            className={!passwordsMatch && confirmPassword ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {!passwordsMatch && confirmPassword && (
          <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Tipo de Conta</Label>
        <Select 
          value={organizationType} 
          onValueChange={(value) => setOrganizationType(value as UserRole)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Associado</SelectItem>
            <SelectItem value="empresa">Empresa</SelectItem>
            <SelectItem value="diretoria">Diretoria</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || !passwordsMatch}
        >
          {isLoading ? "Criando conta..." : "Criar Conta"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterFormFields;
