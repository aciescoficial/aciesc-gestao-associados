
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { UserRole } from '@/components/usuarios/types';

// Protected route component with improved type safety and error handling
export const ProtectedRoute = ({ 
  children, 
  allowedRoles = [] 
}: { 
  children: React.ReactNode, 
  allowedRoles?: UserRole[] 
}) => {
  const { user, loading, userRole, isAdmin } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Only run the authorization check once we have the user data
    if (!loading) {
      if (!user) {
        setIsAuthorized(false);
        return;
      }
      
      // Admin can access everything
      if (isAdmin) {
        setIsAuthorized(true);
        return;
      }
      
      // Check if current user role is allowed
      if (allowedRoles.length > 0 && userRole) {
        setIsAuthorized(allowedRoles.includes(userRole));
        return;
      }
      
      // If no specific roles required, authorized by default
      setIsAuthorized(true);
    }
  }, [loading, user, userRole, isAdmin, allowedRoles]);
  
  if (loading || isAuthorized === null) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <LoadingSpinner size="large" text="Verificando permissões..." />
      </div>
    );
  }
  
  if (!isAuthorized) {
    // Redirect to login if not authenticated
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Redirect to home if authenticated but not authorized
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Admin-only route component with improved error handling
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading, user } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <LoadingSpinner size="large" text="Verificando permissões de administrador..." />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
