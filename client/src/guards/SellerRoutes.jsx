import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom';
import { ROLES } from '../utils/roles';

const AdminRoutes = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return <p>Loading ...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (user.role !== ROLES.SELLER) {
        return <Navigate to="/" replace />
    }
    // return children
    return <Outlet />
}

export default AdminRoutes