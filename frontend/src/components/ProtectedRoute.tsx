import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  useAuth();

  // TESTING MODE - allow access to all pages
  console.log('🔐 TESTING MODE: Allowing access to all pages');
  return <>{children}</>;

  // TODO: Uncomment when backend is ready:
  // return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;