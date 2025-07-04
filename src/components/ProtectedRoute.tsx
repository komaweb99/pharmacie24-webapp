import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePharmacist?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requirePharmacist = false 
}) => {
  const { currentUser, userType } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && userType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requirePharmacist && userType !== 'pharmacist') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;