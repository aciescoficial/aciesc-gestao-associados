
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, X, CheckCircle2 } from 'lucide-react';
import { AssociadoInteresse } from '../types/associadoInteresse';

interface InteresseMobileCardProps {
  interesse: AssociadoInteresse;
  onApprove: (id: string, email: string, nome: string, sobrenome: string) => void;
  onReject: (id: string) => void;
}

const InteresseMobileCard: React.FC<InteresseMobileCardProps> = ({ 
  interesse, 
  onApprove, 
  onReject 
}) => {
  const isApproved = interesse.status === 'aprovado';
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-base">
            {interesse.nome} {interesse.sobrenome}
            {interesse.creci && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                CRECI: {interesse.creci}
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{interesse.email}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          interesse.pagamento_confirmado 
            ? 'bg-green-100 text-green-800' 
            : 'bg-amber-100 text-amber-800'
        }`}>
          {interesse.pagamento_confirmado ? 'Pago' : 'Pendente'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
        <div>
          <p className="text-gray-500">CPF:</p>
          <p>{interesse.cpf}</p>
        </div>
        <div>
          <p className="text-gray-500">Telefone:</p>
          <p>{interesse.celular}</p>
        </div>
      </div>
      
      <div className="mt-2 text-sm">
        <p className="text-gray-500">Localização:</p>
        <p>{interesse.cidade}/{interesse.estado}</p>
      </div>
      
      <div className="mt-2 text-sm">
        <p className="text-gray-500">Data do interesse:</p>
        <p>{new Date(interesse.created_at).toLocaleDateString('pt-BR')}</p>
      </div>
      
      <div className="flex gap-2 mt-4">
        {isApproved ? (
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Já Aprovado
          </Button>
        ) : (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => 
              onApprove(
                interesse.id, 
                interesse.email,
                interesse.nome,
                interesse.sobrenome
              )
            }
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Aprovar
          </Button>
        )}
        
        {!isApproved && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(interesse.id)}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-1" />
            Rejeitar
          </Button>
        )}
      </div>
    </div>
  );
};

export default InteresseMobileCard;
