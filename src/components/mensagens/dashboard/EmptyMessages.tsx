import React from 'react';
import { Inbox } from 'lucide-react';
import { MessageStatus } from '../types';

interface EmptyMessagesProps {
  searchQuery: string;
  filter: MessageStatus;
}

const EmptyMessages: React.FC<EmptyMessagesProps> = ({ searchQuery, filter }) => {
  // Determine message to show based on search or filter state
  let message = 'Não há mensagens na sua caixa de entrada.';
  
  if (searchQuery) {
    message = 'Não foi encontrada nenhuma mensagem com os critérios de busca.';
  } else if (filter === 'unread') {
    message = 'Não há mensagens não lidas na sua caixa de entrada.';
  } else if (filter === 'read') {
    message = 'Não há mensagens lidas na sua caixa de entrada.';
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Inbox className="h-10 w-10 text-gray-400" />
      </div>
      <p className="text-lg font-medium text-gray-700">{message}</p>
      <p className="text-sm text-gray-500 mt-1 max-w-md">
        {searchQuery ? 'Tente usar termos diferentes na busca.' : 'As mensagens recebidas aparecerão aqui.'}
      </p>
    </div>
  );
};

export default EmptyMessages;
