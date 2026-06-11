import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
   const { user, loading } = useAuth();

   if (loading) {
      return <p>Loading...</p>
   }
   if (!user) {
      return <Navigate to="/login" replace />
   }

    if (
        user.role !== "seller" &&  user.role !== "admin"
    ) {
        return <Navigate to="/" replace />;
    }

   // if (!allowedRoles.includes(user.role)) {
   //    return <Navigate to="/" replace />
   // }

   //  return children
   return <Outlet />

}

export default ProtectedRoutes

// import React from "react";

// import useAuth from "../hooks/useAuth";

// import {
//    Navigate,
//    Outlet,
// } from "react-router-dom";

// const ProtectedRoutes = () => {

//    const { user, loading } = useAuth();

//    if (loading) {
//       return <p>Loading...</p>;
//    }

//    // NOT LOGGED IN
//    if (!user) {
//       return <Navigate to="/login" replace />;
//    }

//    // NOT SELLER OR ADMIN
//    if (
//       user.role !== "seller" &&
//       user.role !== "admin"
//    ) {
//       return <Navigate to="/" replace />;
//    }

//    return <Outlet />;
// };

// export default ProtectedRoutes;