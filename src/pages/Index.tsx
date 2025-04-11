
import React from 'react';
import { Routes } from 'react-router-dom';
import { AdminRoutes, UserRoutes, SharedRoutes } from './routes';
import { CobrancasPage } from './RouteComponents';

// Import missing component for Admin Routes
import Dashboard from '@/components/Dashboard';

// Make CobrancasPage available in AdminRoutes
const Index: React.FC = () => {
  return (
    <Routes>
      {/* Include all route groups */}
      {SharedRoutes}
      {AdminRoutes}
      {UserRoutes}
    </Routes>
  );
};

export default Index;
