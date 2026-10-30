
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Reply, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useMessages } from './hooks/useMessages';
import { Message } from './types';
import { formatRelativeDate } from './utils/dateUtils';

const MessageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { messages, markAsRead, deleteMessage } = useMessages();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Find the current message
  const message = messages.find(m => m.id === id);
  
  // Handle back button
  const handleBack = () => {
    navigate('/mensagens');
  };
  
  // Handle delete with confirmation
  const handleDelete = async () => {
    if (!message) return;
    
    setIsDeleting(true);
    
    try {
      await deleteMessage(message.id);
      navigate('/mensagens');
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle mark as read
  const handleMarkAsRead = async () => {
    if (!message || message.read) return;
    
    try {
      await markAsRead(message.id);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
  // Mark message as read when opened
  React.useEffect(() => {
    if (message && !message.read) {
      handleMarkAsRead();
    }
  }, [message]);
  
  if (!message) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando mensagem...</span>
      </div>
    );
  }
  
  // Determine priority badge
  const renderPriorityBadge = () => {
    switch (message.priority) {
      case 'urgent':
        return <Badge variant="destructive">URGENTE</Badge>;
      case 'high':
        return <Badge className="bg-amber-500">Alta Prioridade</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Caixa de Entrada
        </Button>
        
        <div className="flex gap-2">
          {!message.read && (
            <Button variant="outline" onClick={handleMarkAsRead}>
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Marcar como lida
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/mensagens/enviar')}>
            <Reply className="h-4 w-4 mr-2" />
            Responder
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="wp-card space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{message.title}</h1>
            {renderPriorityBadge()}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-semibold">De:</span>
            <span className="ml-2">{message.sender}</span>
            <span className="mx-2">•</span>
            <span>{formatRelativeDate(message.date)}</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="prose max-w-none">
            <p>{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
