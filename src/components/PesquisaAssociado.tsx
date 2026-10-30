
import React, { useEffect } from 'react';
import AssociadoSearchForm from './associado/AssociadoSearchForm';
import AssociadoSearchResult from './associado/AssociadoSearchResult';
import AssociadosMap from './associado/map/AssociadosMap';
import { useAssociadoSearch } from './associado/useAssociadoSearch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PesquisaAssociado: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    statusFilter,
    setStatusFilter,
    cidadeFilter,
    setCidadeFilter,
    cidades,
    isSearching,
    results,
    handleSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalCount,
    fetchAssociados
  } = useAssociadoSearch();

  // Load all associados when the component mounts
  useEffect(() => {
    fetchAssociados();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Associados</h1>
        <div className="text-sm text-muted-foreground">
          {totalCount} associados encontrados
        </div>
      </div>
      
      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="lista">Lista de Associados</TabsTrigger>
          <TabsTrigger value="mapa">Mapa de Associados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lista" className="mt-4">
          <Card className="bg-gradient-to-br from-white to-gray-50 border-none shadow-lg">
            <div className="space-y-4 p-4">
              <AssociadoSearchForm
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchType={searchType}
                setSearchType={setSearchType}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                cidadeFilter={cidadeFilter}
                setCidadeFilter={setCidadeFilter}
                cidades={cidades}
                isSearching={isSearching}
                handleSearch={handleSearch}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                fetchAssociados={fetchAssociados}
              />
              
              <AssociadoSearchResult 
                results={results} 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalCount={totalCount}
                itemsPerPage={itemsPerPage}
                isSearching={isSearching}
              />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="mapa">
          <Card className="p-4">
            <AssociadosMap associados={results} isLoading={isSearching} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PesquisaAssociado;
