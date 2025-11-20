import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Home';
import AllProducts from '../pages/allproducts/AllProducts';
import AllProductsWithFilter from '../pages/allproducts/AllProductsWithFilter';
import Order from '../pages/order/Order';
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/checkout/Checkout';
import Wishlist from '../pages/wishlist/Wishlist';
import Dashboard from '../pages/admin/dashboard/Dashboard';
import AdminDashboardTab from '../pages/admin/dashboard/AdminDashboardTab';
import TestOrders from '../pages/admin/dashboard/TestOrders';
import DashboardTest from '../pages/admin/dashboard/DashboardTest';
import FirebaseTest from '../pages/admin/dashboard/FirebaseTest';
import AddProduct from '../pages/admin/pages/AddProduct';
import AddOneRupeeItem from '../pages/admin/pages/AddOneRupeeItem';
import AddRequestedProducts from '../pages/admin/pages/AddRequestedProducts';
import UpdateProduct from '../pages/admin/pages/UpdateProduct';
import ManageAdvertisements from '../pages/admin/pages/ManageAdvertisements';
import SetupAdmin from '../pages/admin/SetupAdmin';
import MakeAdmin from '../pages/admin/MakeAdmin';
import ProductDetail from '../pages/products/ProductDetail';
import ProductInfo from '../pages/products/ProductInfo';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import Unauthorized from '../pages/unauthorized/Unauthorized';
import NoPage from '../pages/nopage/NoPage';
import FirebaseDiagnostics from '../pages/FirebaseDiagnostics';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<AllProductsWithFilter />} />
      <Route path="/allproducts" element={<AllProductsWithFilter />} />
      <Route path="/product/:id" element={<ProductInfo />} />
      <Route path="/order" element={
        <ProtectedRoute>
          <Order />
        </ProtectedRoute>
      } />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/dashboard" element={
        <ProtectedRoute requireAdmin={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboardTab />
        </ProtectedRoute>
      } />
      <Route path="/test-orders" element={
        <ProtectedRoute requireAdmin={true}>
          <TestOrders />
        </ProtectedRoute>
      } />
      <Route path="/dashboard-test" element={
        <ProtectedRoute requireAdmin={true}>
          <DashboardTest />
        </ProtectedRoute>
      } />
      <Route path="/firebase-test" element={
        <ProtectedRoute requireAdmin={true}>
          <FirebaseTest />
        </ProtectedRoute>
      } />
      <Route path="/add-product" element={
        <ProtectedRoute requireAdmin={true}>
          <AddProduct />
        </ProtectedRoute>
      } />
      <Route path="/add-one-rupee-item" element={
        <ProtectedRoute requireAdmin={true}>
          <AddOneRupeeItem />
        </ProtectedRoute>
      } />
      <Route path="/add-requested-products" element={
        <ProtectedRoute requireAdmin={true}>
          <AddRequestedProducts />
        </ProtectedRoute>
      } />
      <Route path="/manage-advertisements" element={
        <ProtectedRoute requireAdmin={true}>
          <ManageAdvertisements />
        </ProtectedRoute>
      } />
      <Route path="/update-product/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <UpdateProduct />
        </ProtectedRoute>
      } />
      <Route path="/setup-admin" element={<SetupAdmin />} />
      <Route path="/make-admin" element={<MakeAdmin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/products/:id" element={<ProductInfo />} />
      <Route path="/firebase-diagnostics" element={<FirebaseDiagnostics />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  );
};

export default AppRoutes;