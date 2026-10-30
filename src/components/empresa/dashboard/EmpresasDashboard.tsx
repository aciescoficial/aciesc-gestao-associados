
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Users, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth';

const EmpresasDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Dashboard da Empresa</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              <span>Editar Perfil</span>
            </CardTitle>
            <CardDescription>
              Atualize os dados da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Mantenha os dados da sua empresa atualizados para que os associados possam encontrá-la facilmente.
            </p>
            <Button 
              variant="default" 
              onClick={() => navigate('/empresa/perfil')}
              className="w-full"
            >
              Editar Perfil
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Associados</span>
            </CardTitle>
            <CardDescription>
              Consulte os associados da ACIESC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Acesse a lista de associados para verificar quem pode usufruir dos benefícios da sua empresa.
            </p>
            <Button 
              variant="default" 
              onClick={() => navigate('/associados/pesquisa')}
              className="w-full"
            >
              Ver Associados
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <span>Empresas Conveniadas</span>
            </CardTitle>
            <CardDescription>
              Veja outras empresas conveniadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Conheça outras empresas que também oferecem benefícios aos associados da ACIESC.
            </p>
            <Button 
              variant="default" 
              onClick={() => navigate('/empresas-conveniadas')}
              className="w-full"
            >
              Ver Conveniados
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresasDashboard;
