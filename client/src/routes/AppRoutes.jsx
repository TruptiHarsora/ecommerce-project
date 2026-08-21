import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProductList from "../pages/products/ProductList";
import ProductDetails from "../pages/products/ProductDetails";
import Category from "@/pages/category/Category";
import RoleRoutes from "../guards/RoleRoute";

//user
import UserProfile from "../pages/user/UserProfile";
import Cart from "../pages/cart/Cart";
import Wishlist from "@/pages/wishlist/Wishlist";
import Checkout from "@/pages/order/CheckOut";
import OrderSuccess from "@/pages/order/OrderSuccess";
import Orders from "@/pages/order/Orders";
import UserChangePassword from "@/pages/user/UserChangePassword";
import UserReviews from "@/pages/user/UserReviews";

//admin
import AdminDashboard from "../pages/admin/Dashboard";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminProducts from "../pages/admin/AdminProductsList";
import AdminProductDetails from "@/pages/admin/AdminProductDetails";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminOrders from "@/pages/admin/AdminOrders";
import Users from "../pages/admin/User";
import Seller from "@/pages/admin/Seller";
import SellerDetails from "@/pages/admin/SellerDetails";

//seller
import Dashboard from "../pages/seller/Dashboard";
import SellerLayout from "@/components/layout/SellerLayout";
import SellerProducts from "../pages/seller/SellerProducts";
import ProductsCreate from "@/pages/products/ProductsCreate";
import ProductUpdate from "@/pages/products/ProductsUpdate";
import OrderDetails from "@/pages/order/OrderDetails";
import SellerOrdersList from "@/pages/seller/SellerOrderList";
import SellerReview from "@/pages/seller/SellerReview";
import SellerProfile from "@/pages/seller/SellerProfile";

import LandingPage from "@/pages/LandingPage";
import SellerRoutes from "@/guards/SellerRoutes";

// import Category from '@/pages/category/Categories';

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        {/* <Route path="/review" element={<ReviewForm initialValues={{
          rating: 0,
          title: "",
          comment: "",
          images: []
        }}
          // onSubmit={handleSubmit} 
          />} /> */}
      </Route>

      {/* USER ROUTES */}
      <Route
        element={<RoleRoutes allowedRoles={["user", "admin", "seller"]} />}
      >
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/changePassword" element={<UserChangePassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/reviews" element={<UserReviews />} />
        </Route>
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<RoleRoutes allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route
            path="/admin/product/:id"
            element={
              <AdminProductDetails viewUrl="/admin" actiontType="admin" />
            }
          />
          <Route path="/admin/product/update/:id" element={<ProductUpdate />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/category" element={<Category />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/sellers" element={<Seller />} />
          <Route path="/admin/sellers/:id" element={<SellerDetails />} />
        </Route>
      </Route>
      <Route
        element={<RoleRoutes allowedRoles={["user", "seller", "admin"]} />}
      >
        <Route element={<SellerLayout />}>
          <Route path="/seller/profile" element={<SellerProfile />} />
        </Route>
      </Route>
      {/* SELLER ROUTES */}
      <Route element={<RoleRoutes allowedRoles={["seller"]} />}>
        <Route element={<SellerRoutes />}>
          <Route element={<SellerLayout />}>
            <Route path="/seller" element={<Dashboard />} />
            <Route path="/seller/dashboard" element={<Dashboard />} />
            <Route path="/seller/product/create" element={<ProductsCreate />} />
            <Route
              path="/seller/product/update/:id"
              element={<ProductUpdate />}
            />
            <Route path="/seller/products" element={<SellerProducts />} />
            <Route path="/seller/orders" element={<SellerOrdersList />} />
            <Route path="/seller/orders/:id" element={<OrderDetails />} />
            <Route
              path="/seller/orders/:id/status"
              element={<OrderDetails />}
            />
            <Route path="/seller/reviews" element={<SellerReview />} />
            {/* <Route path="/seller/profile" element={<SellerProfile />} /> */}
            <Route
              path="/seller/product/:id"
              element={
                <AdminProductDetails viewUrl="/seller" actiontType="seller" />
              }
            />
          </Route>
        </Route>
      </Route>

      {/* <Route element={<RoleRoutes allowedRoles={["seller", "admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard/product/update/:id" element={<ProductUpdate />} />

        </Route>
      </Route> */}
    </Routes>
  );
};

export default AppRoutes;
