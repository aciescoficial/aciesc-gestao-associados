
import React from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { Toaster } from '@/components/ui/toaster';
import { AssociadoFirstLoginPopup } from './components/associado/AssociadoFirstLoginPopup';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/auth/hooks/useAuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
          <Toaster />
          <AssociadoFirstLoginPopup />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
