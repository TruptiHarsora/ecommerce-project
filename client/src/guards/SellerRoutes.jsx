import React from "react";
import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { TriangleAlert, TriangleAlertIcon, WarehouseIcon } from "lucide-react";

const SellerRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  //   if (!user.isVerified) {
  //     return <Navigate to="/seller/profile" replace />;
  //   }

  if (user?.role === "seller" && user?.isVerified !== true) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-5xl mb-4">
            {/* ⚠️ */}
            <div className="flex justify-center mb-4">
              <TriangleAlert size={52} className="text-yellow-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Seller Not Verified
          </h2>

          <p className="text-gray-600 mb-6">
            Your seller account is currently waiting for admin verification. You
            will get access to the seller dashboard, products, orders and
            reviews after your account is verified.
          </p>

          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default SellerRoutes;

// import React from 'react'
// import useAuth from '../hooks/useAuth'
// import { Navigate, Outlet } from 'react-router-dom';
// import { ROLES } from '../utils/roles';

// const AdminRoutes = ({ children }) => {
//     const { loading, user } = useAuth();

//     if (loading) {
//         return <p>Loading ...</p>
//     }

//     if (!user) {
//         return <Navigate to="/login" replace />
//     }

//     if (user.role !== ROLES.SELLER) {
//         return <Navigate to="/" replace />
//     }
//     // return children
//     return <Outlet />
// }

// export default AdminRoutes
