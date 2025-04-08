
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
}) => {
  // Generate full name
  const fullName = selectedConveniado ? 
    `${selectedConveniado.nome} ${selectedConveniado.sobrenome}` : '';

  // Set default positions if not defined
  const photoPosition = cardSettings.photoPosition || { x: 50, y: 50 };
  const textPosition = cardSettings.textPosition || { x: 50, y: 50 };
  
  // Background styles based on image or color gradient
  const getFrontBackgroundStyle = () => {
    if (cardSettings.frontBackgroundImage) {
      return {
        backgroundImage: `url(${cardSettings.frontBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: `linear-gradient(90deg, ${cardSettings.secondaryColor}, ${cardSettings.secondaryColor})`,
    };
  };
  
  const getBackBackgroundStyle = () => {
    if (cardSettings.backBackgroundImage) {
      return {
        backgroundImage: `url(${cardSettings.backBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: `linear-gradient(90deg, ${cardSettings.secondaryColor}, ${cardSettings.secondaryColor})`,
    };
  };

  // Text styling based on card settings
  const textStyle = {
    fontFamily: cardSettings.fontFamily || 'Arial, sans-serif',
    color: cardSettings.textColor || '#FFFFFF'
  };

  return (
    <div className={`aspect-video w-full rounded-lg overflow-hidden shadow-lg ${!preview && 'max-w-md'}`}>
      <AspectRatio ratio={600/300} className="relative">
        <div className="h-full w-full relative p-0" style={cardView === 'front' ? getFrontBackgroundStyle() : getBackBackgroundStyle()}>
          {cardView === 'front' ? (
            <>
              {/* Left side with patterns and photo */}
              <div className="absolute left-0 top-0 bottom-0 w-1/3 overflow-hidden">
                {/* Green pattern background (if no custom background) */}
                {!cardSettings.frontBackgroundImage && (
                  <div className="absolute left-0 top-0 bottom-0 w-full">
                    <svg viewBox="0 0 200 400" className="h-full">
                      <path d="M0,0 L50,0 C80,0 80,30 80,30 L80,80 C80,110 110,110 110,110 L160,110 L160,160 C160,190 190,190 190,190 L190,400 L0,400 Z" 
                            fill={cardSettings.primaryColor} />
                    </svg>
                  </div>
                )}
                
                {/* Validity badge */}
                <div className="absolute right-0 top-24 transform translate-x-1/2 bg-[#00E676] text-black rounded-full py-2 px-6 font-bold">
                  Validade - {selectedConveniado?.validade}
                </div>
                
                {/* Profile photo with positioning */}
                <div className="absolute overflow-hidden border-4 border-[#00E676] rounded-md"
                     style={{
                       width: '48%',
                       height: '48%',
                       left: `${photoPosition.x}%`,
                       top: `${photoPosition.y}%`,
                       transform: 'translate(-50%, -50%)'
                     }}>
                  {selectedConveniado?.foto ? (
                    <img 
                      src={selectedConveniado.foto} 
                      alt={fullName} 
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
              <div className="absolute right-0 top-0 bottom-0 w-2/3 p-4 flex flex-col items-end justify-between"
                   style={{
                     right: `${100 - textPosition.x}%`,
                     top: `${textPosition.y}%`,
                     transform: 'translateY(-50%)'
                   }}>
                {/* ACIESC Logo */}
                {cardSettings.logoPosition === 'top' && (
                  <div className="flex items-center gap-2">
                    <div className="text-right" style={textStyle}>
                      <div className="text-4xl font-bold tracking-wider">ACIESC</div>
                      <div className="text-xs max-w-xs">
                        ASSOCIAÇÃO DE CORRETORES E IMOBILIÁRIAS DO ESTADO DE SANTA CATARINA
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Conveniado Info */}
                <div className="text-right space-y-2 mt-8">
                  <div>
                    <h2 className="text-3xl font-bold" style={{ 
                      color: cardSettings.primaryColor || '#00E676',
                      fontFamily: cardSettings.fontFamily || 'Arial, sans-serif'
                    }}>
                      CORRETOR DE
                    </h2>
                    <h2 className="text-3xl font-bold" style={{ 
                      color: cardSettings.primaryColor || '#00E676',
                      fontFamily: cardSettings.fontFamily || 'Arial, sans-serif'
                    }}>
                      IMÓVEIS
                    </h2>
                  </div>
                  
                  {/* Name, CRECI, CPF */}
                  <div className="mt-4" style={textStyle}>
                    <p className="font-bold text-lg">{fullName}</p>
                    {cardSettings.showCreci && <p className="font-bold">CRECI-SC: {selectedConveniado?.creci}</p>}
                    {cardSettings.showCPF && <p className="font-bold">CPF: {selectedConveniado?.cpf}</p>}
                  </div>
                </div>
                
                {/* Slogan */}
                <div className="text-right mt-auto">
                  <p className="text-xl font-bold mb-1" style={textStyle}>Ser associado</p>
                  <p className="bg-[#00E676] text-black px-4 py-1 rounded-md inline-block font-bold">
                    que fazem a diferença!
                  </p>
                </div>
                
                {/* ACIESC Logo at bottom if selected */}
                {cardSettings.logoPosition === 'bottom' && (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="text-right" style={textStyle}>
                      <div className="text-4xl font-bold tracking-wider">ACIESC</div>
                      <div className="text-xs max-w-xs">
                        ASSOCIAÇÃO DE CORRETORES E IMOBILIÁRIAS DO ESTADO DE SANTA CATARINA
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Left side with patterns and QR code */}
              <div className="absolute left-0 top-0 bottom-0 w-1/3 overflow-hidden">
                {/* Green pattern background (if no custom background) */}
                {!cardSettings.backBackgroundImage && (
                  <div className="absolute left-0 top-0 bottom-0 w-full">
                    <svg viewBox="0 0 200 400" className="h-full">
                      <path d="M0,0 L50,0 C80,0 80,30 80,30 L80,80 C80,110 110,110 110,110 L160,110 L160,160 C160,190 190,190 190,190 L190,400 L0,400 Z" 
                            fill={cardSettings.primaryColor} />
                    </svg>
                  </div>
                )}
                
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
              <div className="absolute right-0 top-0 bottom-0 w-2/3 p-4 flex flex-col items-end justify-between" style={textStyle}>
                {/* Website */}
                <div className="text-right">
                  <p className="text-2xl font-bold">www.aciesc.com.br</p>
                </div>
                
                {/* Main content */}
                <div className="text-right space-y-2">
                  <div>
                    <h2 className="text-xl font-bold" style={{color: cardSettings.primaryColor}}>EU SOU</h2>
                    <h2 className="text-2xl font-bold" style={{color: cardSettings.primaryColor}}>CORRETOR</h2>
                    <h2 className="text-2xl font-bold" style={{color: cardSettings.primaryColor}}>DE IMÓVEIS</h2>
                    <h2 className="text-2xl font-bold" style={{color: cardSettings.primaryColor}}>ASSOCIADO</h2>
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
};

export default IdCard;
