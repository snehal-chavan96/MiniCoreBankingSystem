import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const role = (sessionStorage.getItem("role") || "").toUpperCase();

  if (!token) {
    return <Navigate to="/api/login" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toUpperCase()).includes(role)) {
    return <Navigate to="/api/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
