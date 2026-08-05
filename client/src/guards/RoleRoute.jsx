import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "../utils/roles";

const RoleRoutes = ({ children, allowedRoles = [] }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // if (user.role !== ROLES.ADMIN) {
  //     return <Navigate to="/" replace />
  // }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // return <Navigate to="/" replace />
    switch (user.role) {
      case ROLES.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;

      // case ROLES.SELLER:
      //   return <Navigate to="/seller" replace />;

      default:
        return <Navigate to="/" replace />;
    }
  }

  //   if (!allowedRoles.includes(user.role)) {
  //     return <Navigate to="/" replace />;
  //   }

  // return children
  return <Outlet />;
};

export default RoleRoutes;
