
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from '@/components/usuarios/types';

interface LoginFormFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  organizationType: UserRole;
  setOrganizationType: (type: UserRole) => void;
  isLoading: boolean;
  recaptchaLoaded: boolean;
  recaptchaToken: string | null;
  isRecaptchaEnabled: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleGoogleSignIn: () => void;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  organizationType,
  setOrganizationType,
  isLoading,
  recaptchaLoaded,
  recaptchaToken,
  isRecaptchaEnabled,
  handleSubmit,
  handleGoogleSignIn
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Tipo de Acesso</Label>
        <Select 
          value={organizationType} 
          onValueChange={(value) => setOrganizationType(value as UserRole)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Associado</SelectItem>
            <SelectItem value="empresa">Empresa</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input 
              id="password" 
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
        
        <div id="login-recaptcha" className="flex justify-center">
          {isRecaptchaEnabled && !recaptchaLoaded && (
            <div className="border border-gray-200 rounded p-2 bg-gray-50 flex justify-center items-center h-[78px] w-full">
              <div className="text-sm text-gray-500">Carregando reCAPTCHA...</div>
            </div>
          )}
          <div className="recaptcha-badge"></div>
        </div>

        <div className="space-y-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || (isRecaptchaEnabled && !recaptchaToken)}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading || (isRecaptchaEnabled && !recaptchaToken)}
          >
            <Mail className="w-4 h-4 mr-2" />
            Google
          </Button>
        </div>
      </form>
    </>
  );
};

export default LoginFormFields;
