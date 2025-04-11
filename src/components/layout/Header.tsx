
import React from 'react';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import SystemVersion from './SystemVersion';
import HeaderActions from './HeaderActions';
import NotificationBanner from './NotificationBanner';
import { SidebarTrigger } from '../ui/sidebar';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <NotificationBanner />
      <header className="bg-aciesc-primary text-white py-3 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          {isMobile && <SidebarTrigger className="text-white mr-3 hover:text-gray-200" />}
          <div className="flex items-center">
            <span className="text-lg font-medium">ACIESC</span>
            <SystemVersion />
          </div>
        </div>
        
        <HeaderActions />
      </header>

      {/* Navigation Menu Row */}
      <div className="bg-white border-b shadow-sm px-4 py-1">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Associados</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                  <li className="row-span-3">
                    <Link to="/associados">
                      <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-900 p-6 no-underline outline-none focus:shadow-md">
                        <div className="mt-4 mb-2 text-lg font-medium text-white">
                          Gerenciamento de Associados
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Acesse todas as funcionalidades de gestão dos associados.
                        </p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/associados/cadastro" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Novo Associado</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Cadastrar um novo associado no sistema.
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/associados/pesquisa" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Pesquisar</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Buscar associados cadastrados no sistema.
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/carteirinhas" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Carteirinhas</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Gerenciar carteirinhas dos associados.
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Conveniados</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                  <li>
                    <Link to="/conveniados/cadastro" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Novo Conveniado</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Cadastrar um novo conveniado no sistema.
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/conveniados/pesquisa" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Pesquisar</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Buscar conveniados cadastrados no sistema.
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Empresas</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                  <li>
                    <Link to="/empresas/cadastro" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Nova Empresa</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Cadastrar uma nova empresa no sistema.
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/empresas/pesquisa" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Pesquisar</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Buscar empresas cadastradas no sistema.
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Financeiro</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                  <li>
                    <Link to="/financeiro/resumo" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Resumo</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Visão geral financeira.
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/financeiro/relatorios" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Relatórios</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Gerar relatórios financeiros.
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/financeiro/tipos-associacao" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Tipos de Associação</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Gerenciar categorias de associados.
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Comunicação</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                  <li>
                    <Link to="/mensagens" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                      <div className="text-sm font-medium leading-none">Mensagens</div>
                      <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                        Enviar mensagens para associados.
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Responsive dropdown for mobile showing all menu items */}
            {isMobile && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <Link to="/" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                        <div className="text-sm font-medium leading-none">Dashboard</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/associados/pesquisa" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                        <div className="text-sm font-medium leading-none">Associados</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/conveniados/pesquisa" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                        <div className="text-sm font-medium leading-none">Conveniados</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/empresas/pesquisa" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                        <div className="text-sm font-medium leading-none">Empresas</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/financeiro/resumo" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                        <div className="text-sm font-medium leading-none">Financeiro</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/mensagens" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                        <div className="text-sm font-medium leading-none">Comunicação</div>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};

export default Header;
