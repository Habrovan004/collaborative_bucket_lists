import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  useAuth();

  // For testing - allow access to all pages
  return <>{children}</>;

  // Uncomment when backend is ready:
  // return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;