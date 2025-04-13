
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AprovacaoInteresse from './AprovacaoInteresse';
import FluxoAprovacao from './components/FluxoAprovacao';
import CodigoIncorporacao from './components/CodigoIncorporacao';

const AprovacaoInteressePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="wp-header">Aprovação de Associados</h1>
      
      <Tabs defaultValue="aprovacao" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="aprovacao">Aprovação de Interessados</TabsTrigger>
          <TabsTrigger value="fluxo">Fluxo de Aprovação</TabsTrigger>
          <TabsTrigger value="incorporacao">Código de Incorporação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="aprovacao" className="mt-0">
          <AprovacaoInteresse />
        </TabsContent>
        
        <TabsContent value="fluxo" className="mt-0">
          <FluxoAprovacao />
        </TabsContent>
        
        <TabsContent value="incorporacao" className="mt-0">
          <CodigoIncorporacao />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AprovacaoInteressePage;
