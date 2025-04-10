import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, ShieldCheck, ShieldAlert, Copy, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import * as OTPAuth from 'otpauth';

interface TwoFactorAuthProps {
  userId: string;
}

export const TwoFactorAuth = ({ userId }: TwoFactorAuthProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabling, setIsEnabling] = useState(false);
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTwoFactorStatus();
  }, [userId]);

  const fetchTwoFactorStatus = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_2fa')
        .select('enabled, secret, backup_codes')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setIsEnabled(data.enabled);
        if (data.enabled && data.backup_codes) {
          setBackupCodes(data.backup_codes);
        }
      }
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSecret = () => {
    // Generate a random secret for TOTP
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      let code = '';
      for (let j = 0; j < 8; j++) {
        code += Math.floor(Math.random() * 10);
      }
      codes.push(code);
    }
    return codes;
  };

  const startEnabling2FA = () => {
    const newSecret = generateSecret();
    setSecret(newSecret);
    setIsEnabling(true);

    // Create OTPAuth URL for QR code
    const user = supabase.auth.getUser();
    user.then(({ data }) => {
      if (data.user) {
        const email = data.user.email || '';
        const totp = new OTPAuth.TOTP({
          issuer: 'ACIESC',
          label: email,
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: OTPAuth.Secret.fromBase32(newSecret)
        });

        setQrCodeUrl(`https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(totp.toString())}`);
      }
    });
  };

  const verify2FACode = async () => {
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Código obrigatório",
        description: "Por favor, insira o código de verificação.",
      });
      return;
    }

    try {
      const totp = new OTPAuth.TOTP({
        issuer: 'ACIESC',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret)
      });

      const isValid = totp.validate({ token: verificationCode, window: 1 }) !== null;

      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Código inválido",
          description: "O código inserido não é válido. Tente novamente.",
        });
        return;
      }

      const newBackupCodes = generateBackupCodes();
      
      // Store in database
      const { error } = await supabase
        .from('user_2fa')
        .upsert({ 
          user_id: userId, 
          enabled: true, 
          secret, 
          backup_codes: newBackupCodes,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setBackupCodes(newBackupCodes);
      setShowBackupCodes(true);
      setIsEnabled(true);
      setIsEnabling(false);
      
      toast({
        title: "Autenticação de dois fatores ativada",
        description: "Salve seus códigos de backup em um local seguro.",
      });

      // Log the 2FA activation
      await supabase.from('user_access_logs').insert({
        user_id: userId,
        event: 'Ativação da autenticação de dois fatores',
        created_at: new Date().toISOString()
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao ativar 2FA",
        description: error.message,
      });
    }
  };

  const disable2FA = async () => {
    try {
      const { error } = await supabase
        .from('user_2fa')
        .update({
          enabled: false,
          secret: null,
          backup_codes: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      setIsEnabled(false);
      setSecret('');
      setBackupCodes([]);
      setShowBackupCodes(false);
      
      toast({
        title: "Autenticação de dois fatores desativada",
        description: "Sua conta agora usa apenas senha para login.",
      });

      // Log the 2FA deactivation
      await supabase.from('user_access_logs').insert({
        user_id: userId,
        event: 'Desativação da autenticação de dois fatores',
        created_at: new Date().toISOString()
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao desativar 2FA",
        description: error.message,
      });
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast({
      title: "Códigos copiados",
      description: "Os códigos de backup foram copiados para a área de transferência.",
    });
  };

  const regenerateBackupCodes = async () => {
    try {
      const newBackupCodes = generateBackupCodes();
      
      const { error } = await supabase
        .from('user_2fa')
        .update({
          backup_codes: newBackupCodes,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setBackupCodes(newBackupCodes);
      setShowBackupCodes(true);
      
      toast({
        title: "Códigos regenerados",
        description: "Novos códigos de backup foram gerados.",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao regenerar códigos",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  
  if (isEnabled && !showBackupCodes) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          <span className="font-medium text-green-600">Autenticação de dois fatores está ativa</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Sua conta está protegida com uma camada extra de segurança. 
          Ao fazer login, você precisará fornecer seu nome de usuário, 
          senha e um código de autenticação do seu aplicativo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowBackupCodes(true)}
          >
            Ver códigos de backup
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={disable2FA}
          >
            Desativar autenticação de dois fatores
          </Button>
        </div>
      </div>
    );
  }

  if (showBackupCodes) {
    return (
      <div className="space-y-4">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800">
            Guarde estes códigos de backup em um local seguro. Eles podem ser usados uma única vez caso você 
            perca acesso ao seu aplicativo de autenticação.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-2 my-3">
          {backupCodes.map((code, index) => (
            <div key={index} className="p-2 bg-muted rounded-md border text-center font-mono">
              {code}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={copyBackupCodes}
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            Copiar códigos
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={regenerateBackupCodes}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerar códigos
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setShowBackupCodes(false)}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  if (isEnabling) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="border p-2 bg-white mb-4 inline-block">
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" width={200} height={200} />}
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="font-mono text-sm break-all bg-muted p-2 rounded">{secret}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="verification-code">Código de verificação</Label>
          <Input
            id="verification-code"
            type="text"
            maxLength={6}
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          />
          <p className="text-xs text-muted-foreground">
            Digite o código de verificação fornecido pelo aplicativo autenticador.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={verify2FACode}
          >
            Verificar e ativar
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEnabling(false)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-amber-500" />
        <span className="font-medium text-amber-600">Autenticação de dois fatores está desativada</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta.
        Além de sua senha, você precisará inserir um código gerado por um aplicativo autenticador.
      </p>

      <div className="flex items-center gap-3 mt-2">
        <QrCode className="h-10 w-10 text-muted-foreground" />
        <div>
          <h4 className="text-sm font-medium">Aplicativo autenticador</h4>
          <p className="text-xs text-muted-foreground">
            Configure a autenticação de dois fatores usando Google Authenticator, 
            Microsoft Authenticator ou outro aplicativo autenticador.
          </p>
        </div>
      </div>

      <Button
        onClick={startEnabling2FA}
      >
        Configurar autenticação de dois fatores
      </Button>
    </div>
  );
};
