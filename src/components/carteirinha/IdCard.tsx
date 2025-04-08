
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ConveniadoData, CardSettings } from './types';

interface IdCardProps {
  selectedConveniado: ConveniadoData | null;
  cardView: 'front' | 'back';
  cardSettings: CardSettings;
  preview?: boolean;
}

const IdCard: React.FC<IdCardProps> = ({ 
  selectedConveniado,
  cardView,
  cardSettings,
  preview = false
}) => (
  <div className={`aspect-video w-full rounded-lg overflow-hidden shadow-lg ${!preview && 'max-w-md'}`}>
    <AspectRatio ratio={600/300} className={`bg-[linear-gradient(90deg,${cardSettings.secondaryColor},${cardSettings.secondaryColor.replace('#', '#')})]`}>
      <div className="h-full w-full relative p-0">
        {cardView === 'front' ? (
          <>
            {/* Left side with patterns and photo */}
            <div className="absolute left-0 top-0 bottom-0 w-1/3 overflow-hidden">
              {/* Green pattern background */}
              <div className="absolute left-0 top-0 bottom-0 w-full">
                <svg viewBox="0 0 200 400" className="h-full">
                  <path d="M0,0 L50,0 C80,0 80,30 80,30 L80,80 C80,110 110,110 110,110 L160,110 L160,160 C160,190 190,190 190,190 L190,400 L0,400 Z" 
                        fill={cardSettings.primaryColor} />
                </svg>
              </div>
              
              {/* Validity badge */}
              <div className="absolute right-0 top-24 transform translate-x-1/2 bg-[#00E676] text-black rounded-full py-2 px-6 font-bold">
                Validade - {selectedConveniado?.validade}
              </div>
              
              {/* Profile photo */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/4 w-48 h-48 rounded-md overflow-hidden border-4 border-[#00E676]">
                {selectedConveniado?.foto ? (
                  <img 
                    src={selectedConveniado.foto} 
                    alt={`${selectedConveniado.nome}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    Sem foto
                  </div>
                )}
              </div>
            </div>
            
            {/* Right side with text content */}
            <div className="absolute right-0 top-0 bottom-0 w-2/3 p-4 text-white flex flex-col items-end justify-between">
              {/* ACIESC Logo */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-4xl font-bold tracking-wider">ACIESC</div>
                  <div className="text-xs max-w-xs">
                    ASSOCIAÇÃO DE CORRETORES E IMOBILIÁRIAS DO ESTADO DE SANTA CATARINA
                  </div>
                </div>
              </div>
              
              {/* Conveniado Info */}
              <div className="text-right space-y-2 mt-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#00E676]">CORRETOR DE</h2>
                  <h2 className="text-3xl font-bold text-[#00E676]">IMÓVEIS</h2>
                </div>
                
                <div className="mt-4">
                  {cardSettings.showCreci && <p className="font-bold">CRECI-SC: {selectedConveniado?.creci}</p>}
                  {cardSettings.showCPF && <p className="font-bold">CPF: {selectedConveniado?.cpf}</p>}
                </div>
              </div>
              
              {/* Slogan */}
              <div className="text-right mt-auto">
                <p className="text-xl font-bold mb-1">Ser associado</p>
                <p className="bg-[#00E676] text-black px-4 py-1 rounded-md inline-block font-bold">
                  que fazem a diferença!
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Left side with patterns and QR code */}
            <div className="absolute left-0 top-0 bottom-0 w-1/3 overflow-hidden">
              {/* Green pattern background */}
              <div className="absolute left-0 top-0 bottom-0 w-full">
                <svg viewBox="0 0 200 400" className="h-full">
                  <path d="M0,0 L50,0 C80,0 80,30 80,30 L80,80 C80,110 110,110 110,110 L160,110 L160,160 C160,190 190,190 190,190 L190,400 L0,400 Z" 
                        fill={cardSettings.primaryColor} />
                </svg>
              </div>
              
              {/* QR Code */}
              {cardSettings.showQRCode && (
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/4 w-48 h-48 bg-white p-2 rounded-md">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://aciesc.com.br" 
                    alt="QR Code"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
            
            {/* Right side with text content */}
            <div className="absolute right-0 top-0 bottom-0 w-2/3 p-4 text-white flex flex-col items-end justify-between">
              {/* Website */}
              <div className="text-right">
                <p className="text-2xl font-bold">www.aciesc.com.br</p>
              </div>
              
              {/* Main content */}
              <div className="text-right space-y-2">
                <div>
                  <h2 className="text-xl font-bold text-[#00E676]">EU SOU</h2>
                  <h2 className="text-2xl font-bold text-[#00E676]">CORRETOR</h2>
                  <h2 className="text-2xl font-bold text-[#00E676]">DE IMÓVEIS</h2>
                  <h2 className="text-2xl font-bold text-[#00E676]">ASSOCIADO</h2>
                </div>
              </div>
              
              {/* ACIESC Logo bottom */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-3xl font-bold tracking-wider">ACIESC</div>
                  <div className="text-xs max-w-xs">
                    ASSOCIAÇÃO DE CORRETORES E IMOBILIÁRIAS DO ESTADO DE SANTA CATARINA
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AspectRatio>
  </div>
);

export default IdCard;
