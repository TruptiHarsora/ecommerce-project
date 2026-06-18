import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout';

import Home from '../pages/Home'
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProductList from '../pages/products/ProductList';
import ProductDetails from '../pages/products/ProductDetails';

import RoleRoutes from '../guards/RoleRoute';

//user 
import Profile from '../pages/user/Profile';
import Cart from '../pages/cart/Cart';
import Wishlist from '@/pages/wishlist/Wishlist';
import Checkout from '@/pages/order/CheckOut';
import OrderSuccess from '@/pages/order/OrderSuccess';
import Orders from '@/pages/order/Orders';

//admin
import Users from '../pages/admin/User'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminProducts from '../pages/admin/AdminProductsList'
import AdminReviews from '../pages/admin/Reviews'

//seller
import SellerDashboard from "../pages/seller/Dashboard"
import SellerProducts from "../pages/seller/SellerProducts"
import SellerOrders from "../pages/seller/Orders"
import ProductsCreate from '@/pages/products/ProductsCreate';
import ProductUpdate from '@/pages/products/ProductsUpdate';
import OrderDetails from '@/pages/order/OrderDetails';
import Category from '@/pages/category/Category';
// import Category from '@/pages/category/Categories';






const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Route>

      {/* USER ROUTES */}
      <Route element={<RoleRoutes allowedRoles={["user", "admin", "seller"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path='/orders/:id' element={<OrderDetails />} />
        </Route>
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<RoleRoutes allowedRoles={["admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/category" element={<Category />} />
        </Route>
      </Route>

      {/* SELLER ROUTES */}
      <Route element={<RoleRoutes allowedRoles={["seller"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/product/create" element={<ProductsCreate />} />
          <Route path="/seller/product/update/:id" element={<ProductUpdate />}/>
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
        </Route>
      </Route>

      <Route element={<RoleRoutes allowedRoles={["seller", "admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard/product/update/:id" element={<ProductUpdate />} />

        </Route>
      </Route>

    </Routes>
  );
};

export default AppRoutes;