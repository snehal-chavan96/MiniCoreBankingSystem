import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const username = sessionStorage.getItem('username');
  const role = sessionStorage.getItem('role');

  if (!username || !allowedRoles.includes(role)) {
    return <Navigate to="/api/login" />;
  }

  return children;
};

export default ProtectedRoute;
