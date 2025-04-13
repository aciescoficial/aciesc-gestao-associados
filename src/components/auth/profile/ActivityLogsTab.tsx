
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ActivityLogsTabProps {
  userId: string;
}

export const ActivityLogsTab = ({ userId }: ActivityLogsTabProps) => {
  const [accessLogs, setAccessLogs] = useState<{event: string, timestamp: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivityLogs = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // Fetch access logs
        const { data: logsData, error: logsError } = await supabase
          .from('user_access_logs')
          .select('event, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (logsError) throw logsError;
        
        if (logsData) {
          setAccessLogs(logsData.map(log => ({
            event: log.event,
            timestamp: new Date(log.created_at).toLocaleString()
          })));
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar histórico",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivityLogs();
  }, [userId, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Histórico de Atividades
        </CardTitle>
        <CardDescription>
          Visualize seu histórico de acessos recentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="medium" />
          </div>
        ) : accessLogs.length > 0 ? (
          <div className="space-y-2">
            {accessLogs.map((log, index) => (
              <div key={index} className="flex justify-between p-2 border-b last:border-0">
                <span>{log.event}</span>
                <span className="text-sm text-muted-foreground">{log.timestamp}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-6">
            Sem registros de atividade recente
          </div>
        )}
      </CardContent>
    </Card>
  );
};
