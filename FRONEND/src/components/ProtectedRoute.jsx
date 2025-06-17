import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If no specific userType is required, allow access
  if (!userType) {
    return <>{children}</>;
  }

  const allowedTypes = Array.isArray(userType) ? userType : [userType];
  
  // Check if user has the required userType
  if (user && !allowedTypes.includes(user.userType || '')) {
    // Redirect based on user type to their appropriate dashboard
    if (user.userType === 'user') {
      return <Navigate to="/user-dashboard" />;
    } else if (user.userType === 'admin') {
      return <Navigate to="/admin-dashboard" />;
    } else if (user.userType === 'subadmin') {
      return <Navigate to="/subadmin-dashboard" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 