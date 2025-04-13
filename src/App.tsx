
import React from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import { AssociadoFirstLoginPopup } from './components/associado/AssociadoFirstLoginPopup';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppRoutes />
        <Toaster />
        <AssociadoFirstLoginPopup />
      </div>
    </BrowserRouter>
  );
}

export default App;
