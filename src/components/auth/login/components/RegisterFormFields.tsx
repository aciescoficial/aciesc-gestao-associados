
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { UserRole } from "@/components/usuarios/types";

interface RegisterFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  passwordsMatch: boolean;
  organizationType: UserRole;
  setOrganizationType: (value: UserRole) => void;
  isRateLimited: boolean;
  retryCount: number;
  retryCountdown: number;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const RegisterFormFields = ({
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
  isRateLimited,
  retryCount,
  retryCountdown,
  isLoading,
  handleSubmit
}: RegisterFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Digite seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Esconder senha" : "Mostrar senha"}
            </span>
          </Button>
        </div>
        {password && password.length < 6 && (
          <p className="text-sm font-medium text-destructive">A senha deve ter pelo menos 6 caracteres</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showConfirmPassword
                ? "Esconder confirmação"
                : "Mostrar confirmação"}
            </span>
          </Button>
        </div>
        {confirmPassword && !passwordsMatch && (
          <p className="text-sm font-medium text-destructive">As senhas não coincidem</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationType">Tipo de Conta</Label>
        <Select
          value={organizationType}
          onValueChange={(value) => setOrganizationType(value as UserRole)}
          disabled={isLoading}
        >
          <SelectTrigger id="organizationType">
            <SelectValue placeholder="Selecione o tipo de conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Associado</SelectItem>
            <SelectItem value="empresa">Empresa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isRateLimited && retryCount > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            <div className="flex flex-col gap-2">
              <p>Limite de cadastros excedido. Tentativa #{retryCount}.</p>
              <div className="flex flex-col">
                <div className="flex justify-between text-sm">
                  <span>Aguarde</span>
                  <span>{retryCountdown} segundos</span>
                </div>
                <Progress value={(retryCountdown / 60) * 100} className="h-2" />
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || (isRateLimited && retryCountdown > 0)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...
          </>
        ) : isRateLimited && retryCountdown > 0 ? (
          `Aguarde ${retryCountdown}s...`
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  );
};

export default RegisterFormFields;
