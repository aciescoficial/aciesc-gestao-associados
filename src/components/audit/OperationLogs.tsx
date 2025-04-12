import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOperationLogs, OperationLog } from './auditLogService';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DownloadCloud, UploadCloud } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ptBR } from 'date-fns/locale';

export const OperationLogs: React.FC = () => {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    const fetchLogs = async () => {
      if (!isAdmin) return;
      
      try {
        setLoading(true);
        const result = await getOperationLogs({});
        setLogs(result.logs);
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o histórico de operações.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [isAdmin, toast]);
  
  if (!isAdmin) {
    return (
      <div className="p-4 text-center">
        <p>Você não tem permissão para visualizar esta página.</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <p>Carregando logs de operações...</p>
      </div>
    );
  }
  
  if (logs.length === 0) {
    return (
      <div className="p-4 text-center border rounded-md">
        <p className="text-gray-500">Nenhum registro de operação encontrado.</p>
      </div>
    );
  }
  
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'import':
        return <UploadCloud className="h-4 w-4 text-blue-500" />;
      case 'export':
        return <DownloadCloud className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'import':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Importação
          </Badge>
        );
      case 'export':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Exportação
          </Badge>
        );
      case 'create':
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Criação
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {eventType}
          </Badge>
        );
    }
  };
  
  const getEntityLabel = (entityType: string) => {
    switch (entityType) {
      case 'associado':
        return 'Associados';
      case 'conveniado':
        return 'Conveniados';
      case 'empresa':
        return 'Empresas';
      default:
        return entityType;
    }
  };
  
  const getFormatBadge = (format?: string | null) => {
    if (!format) return null;
    
    switch (format.toLowerCase()) {
      case 'csv':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            CSV
          </Badge>
        );
      case 'xml':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            XML
          </Badge>
        );
      case 'json':
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            JSON
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {format}
          </Badge>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Histórico de Operações</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Operação</TableHead>
            <TableHead>Entidade</TableHead>
            <TableHead>Formato</TableHead>
            <TableHead>Registros</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getEventIcon(log.eventType)}
                  {getEventBadge(log.eventType)}
                </div>
              </TableCell>
              <TableCell>{getEntityLabel(log.entityType)}</TableCell>
              <TableCell>{getFormatBadge(log.format)}</TableCell>
              <TableCell>{log.recordCount || '-'}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{log.userName}</span>
                  {log.userId && <span className="text-xs text-gray-500">{log.userId.substring(0, 8)}...</span>}
                </div>
              </TableCell>
              <TableCell>{log.details || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
