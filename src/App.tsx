
import React from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import { AssociadoFirstLoginPopup } from './components/associado/AssociadoFirstLoginPopup';

function App() {
  return (
    <div className="App">
      <AppRoutes />
      <Toaster />
      <AssociadoFirstLoginPopup />
    </div>
  );
}

export default App;
