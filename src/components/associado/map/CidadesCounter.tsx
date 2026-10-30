
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface CidadeCount {
  cidade: string;
  count: number;
}

interface CidadesCounterProps {
  associados: Array<{ cidade: string }>;
}

export const CidadesCounter: React.FC<CidadesCounterProps> = ({ associados }) => {
  // Filter out associados with empty cidade values
  const validAssociados = associados.filter(a => a.cidade && a.cidade.trim() !== '');
  
  const cidadesCount = validAssociados.reduce((acc: CidadeCount[], associado) => {
    // Normalize cidade name to handle case and whitespace differences
    const cidade = associado.cidade?.trim();
    if (!cidade) return acc;
    
    const existingCity = acc.find(c => c.cidade.toLowerCase() === cidade.toLowerCase());
    
    if (existingCity) {
      existingCity.count++;
    } else {
      acc.push({ cidade, count: 1 });
    }
    
    return acc;
  }, []);

  // Sort by count (descending)
  cidadesCount.sort((a, b) => b.count - a.count);

  return (
    <Card className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-sm w-64">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 text-sm">Associados por Cidade</h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {cidadesCount.length > 0 ? (
            cidadesCount.map(({ cidade, count }) => (
              <div key={cidade} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{cidade}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">Nenhuma cidade encontrada</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
