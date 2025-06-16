import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const allowedTypes = Array.isArray(userType) ? userType : [userType];
  if (user && !allowedTypes.includes(user.userType || '')) {
    // Redirect based on user type
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