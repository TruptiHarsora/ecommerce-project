import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "seller" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (user.role === "seller" && !user.isVerified) {
    return <Navigate to="/seller/profile" replace />;
  }
  // if (!allowedRoles.includes(user.role)) {
  //    return <Navigate to="/" replace />
  // }

  //  return children
  return <Outlet />;
};

export default ProtectedRoutes;
