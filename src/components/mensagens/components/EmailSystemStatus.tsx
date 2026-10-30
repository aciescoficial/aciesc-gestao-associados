
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const EmailSystemStatus: React.FC = () => {
  const [status, setStatus] = useState<{
    isOperational: boolean;
    message: string;
    loading: boolean;
  }>({
    isOperational: false,
    message: 'Verificando status...',
    loading: true,
  });
  
  useEffect(() => {
    const checkEmailStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('system_config')
          .select('value')
          .eq('key', 'GO_HIGH_LEVEL_API_KEY')
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        setStatus({
          isOperational: !!data?.value,
          message: data?.value 
            ? 'Sistema de email configurado e operacional' 
            : 'Sistema de email não configurado',
          loading: false,
        });
      } catch (error) {
        console.error('Erro ao verificar status do email:', error);
        setStatus({
          isOperational: false,
          message: 'Falha ao verificar status do email',
          loading: false,
        });
      }
    };
    
    checkEmailStatus();
  }, []);
  
  const getStatusIcon = () => {
    if (status.loading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    } else if (status.isOperational) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Badge 
              variant={status.isOperational ? "outline" : "destructive"}
              className="flex items-center gap-1"
            >
              {getStatusIcon()}
              <span>Status de Email</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{status.message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EmailSystemStatus;
