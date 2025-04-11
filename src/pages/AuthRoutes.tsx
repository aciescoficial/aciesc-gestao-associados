
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoaderCircle } from 'lucide-react';
import { UserRole } from '@/components/usuarios/types';

// Improved loading component with better UX
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-64">
    <LoaderCircle className="animate-spin h-8 w-8 text-gray-900 mb-2" />
    <p className="text-sm text-gray-600">Carregando...</p>
  </div>
);

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
    return <LoadingSpinner />;
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
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
