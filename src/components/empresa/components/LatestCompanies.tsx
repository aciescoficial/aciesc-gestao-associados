import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { empresaCrudService } from '../services/empresaService';
import { EmpresaData } from '../types';
import { Eye, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const LatestCompanies: React.FC<{ onLocateEmpresa?: (empresa: EmpresaData) => void }> = ({ 
  onLocateEmpresa 
}) => {
  const [companies, setCompanies] = useState<EmpresaData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestCompanies = async () => {
      try {
        setLoading(true);
        const data = await empresaCrudService.getLatestCompanies(3);
        
        // Add mock coordinates for testing if needed
        const companiesWithCoords = data.map(company => ({
          ...company,
          latitude: company.latitude || -15.7801 + (Math.random() - 0.5) * 0.1,
          longitude: company.longitude || -47.9292 + (Math.random() - 0.5) * 0.1
        }));
        
        setCompanies(companiesWithCoords);
      } catch (error) {
        console.error("Error fetching latest companies:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as empresas recentes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCompanies();
  }, [toast]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const handleLocate = (company: EmpresaData) => {
    if (onLocateEmpresa) {
      // Ensure company has coordinates
      if (!company.latitude || !company.longitude) {
        toast({
          title: "Coordenadas indisponíveis",
          description: "Esta empresa não possui coordenadas de localização",
          variant: "destructive"
        });
        return;
      }
      
      onLocateEmpresa(company);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimas Empresas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Empresas Cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        {companies.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Nenhuma empresa cadastrada ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {companies.map(company => (
              <div key={company.id} className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={company.logo_url || ''} alt={company.nome_fantasia} />
                  <AvatarFallback className="bg-primary/10">
                    {getInitials(company.nome_fantasia)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{company.nome_fantasia}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {company.cidade} • {company.nicho}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {onLocateEmpresa && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleLocate(company)}
                      className="flex items-center gap-1"
                    >
                      <MapPin size={14} />
                      <span>Localizar</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="flex items-center gap-1"
                  >
                    <Link to={`/empresas/detalhes/${company.id}`}>
                      <Info size={14} />
                      <span>Ver mais</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestCompanies;
