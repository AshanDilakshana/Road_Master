import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!userType) {
    return <>{children}</>;
  }

  const allowedTypes = Array.isArray(userType) ? userType : [userType];

  if (user && !allowedTypes.includes(user.userType || '')) {
    if (user.userType === 'user') return <Navigate to="/user-dashboard" />;
    if (user.userType === 'admin') return <Navigate to="/admin-dashboard" />;
    if (user.userType === 'subadmin') return <Navigate to="/subadmin-dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
