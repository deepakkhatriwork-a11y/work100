import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Preload critical routes for faster navigation
const preloadRoute = (importFunc) => {
  importFunc(); // Trigger preload
  return importFunc; // Return original function
};

// Lazy load ALL components for better performance
const ModernHomepage = lazy(preloadRoute(() => import('../pages/home/ModernHomepage')));
const Home = lazy(() => import('../pages/home/Home'));
const AllProductsWithFilter = lazy(preloadRoute(() => import('../pages/allproducts/AllProductsWithFilter')));
const Cart = lazy(() => import('../pages/cart/Cart'));
const Checkout = lazy(() => import('../pages/checkout/Checkout'));
const Wishlist = lazy(() => import('../pages/wishlist/Wishlist'));
const ProductInfo = lazy(() => import('../pages/products/ProductInfo'));
const Login = lazy(() => import('../pages/auth/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('../pages/auth/Register').then(module => ({ default: module.Register })));
const Unauthorized = lazy(() => import('../pages/unauthorized/Unauthorized'));
const NoPage = lazy(() => import('../pages/nopage/NoPage'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('../pages/TermsAndConditions'));
const Dashboard = lazy(() => import('../pages/admin/dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('../pages/admin/dashboard/AdminDashboardTab'));
const Order = lazy(() => import('../pages/order/Order'));
const AddProduct = lazy(() => import('../pages/admin/pages/AddProduct')); // AddProduct component
const UpdateProduct = lazy(() => import('../pages/admin/pages/UpdateProduct')); // UpdateProduct component

function AppRoutes() {
  // Preload commonly accessed routes after initial render
  useEffect(() => {
    // Preload cart and wishlist for quicker access
    setTimeout(() => {
      import('../pages/cart/Cart');
      import('../pages/wishlist/Wishlist');
    }, 2000);
  }, []);

  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ModernHomepage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<AllProductsWithFilter />} />
        <Route path="/productinfo/:id" element={<ProductInfo />} />
        <Route path="/product/:id" element={<ProductInfo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/order" element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/add-product" element={
          <ProtectedRoute requiredRole="admin">
            <AddProduct />
          </ProtectedRoute>
        } />
        <Route path="/update-product/:id" element={
          <ProtectedRoute requiredRole="admin">
            <UpdateProduct />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admindashboard/*" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;