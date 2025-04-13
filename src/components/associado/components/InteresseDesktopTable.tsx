
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, X, CheckCircle2 } from 'lucide-react';
import { AssociadoInteresse } from '../types/associadoInteresse';

interface InteresseDesktopTableProps {
  interesses: AssociadoInteresse[];
  onApprove: (id: string, email: string, nome: string, sobrenome: string) => void;
  onReject: (id: string) => void;
}

const InteresseDesktopTable: React.FC<InteresseDesktopTableProps> = ({ 
  interesses, 
  onApprove, 
  onReject 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-3">Nome</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Telefone</th>
            <th className="text-left p-3">CPF</th>
            <th className="text-left p-3">Cidade/UF</th>
            <th className="text-left p-3">Data</th>
            <th className="text-left p-3">Pagamento</th>
            <th className="text-center p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {interesses.map((interesse) => {
            const isApproved = interesse.status === 'aprovado';
            
            return (
              <tr key={interesse.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {interesse.nome} {interesse.sobrenome}
                  {interesse.creci && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      CRECI: {interesse.creci}
                    </span>
                  )}
                </td>
                <td className="p-3">{interesse.email}</td>
                <td className="p-3">{interesse.celular}</td>
                <td className="p-3">{interesse.cpf}</td>
                <td className="p-3">
                  {interesse.cidade}/{interesse.estado}
                </td>
                <td className="p-3">
                  {new Date(interesse.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-3">
                  {interesse.pagamento_confirmado ? (
                    <span className="text-green-600 font-medium">Confirmado</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Pendente</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex justify-center space-x-2">
                    {isApproved ? (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 flex items-center"
                        disabled
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Já Aprovado
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => 
                            onApprove(
                              interesse.id, 
                              interesse.email,
                              interesse.nome,
                              interesse.sobrenome
                            )
                          }
                          className="flex items-center"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReject(interesse.id)}
                          className="flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InteresseDesktopTable;
