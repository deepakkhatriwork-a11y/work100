import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Home';
import AllProductsWithFilter from '../pages/allproducts/AllProductsWithFilter';
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/checkout/Checkout';
import Wishlist from '../pages/wishlist/Wishlist';
import ProductInfo from '../pages/products/ProductInfo';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import Unauthorized from '../pages/unauthorized/Unauthorized';
import NoPage from '../pages/nopage/NoPage';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { Spinner } from '../components/ui/Spinner';

// Lazy load admin components
const Dashboard = lazy(() => import('../pages/admin/dashboard/Dashboard'));
const AdminDashboardTab = lazy(() => import('../pages/admin/dashboard/AdminDashboardTab'));
const TestOrders = lazy(() => import('../pages/admin/dashboard/TestOrders'));
const DashboardTest = lazy(() => import('../pages/admin/dashboard/DashboardTest'));
const FirebaseTest = lazy(() => import('../pages/admin/dashboard/FirebaseTest'));
const AddProduct = lazy(() => import('../pages/admin/pages/AddProduct'));
const MigrateProductImages = lazy(() => import('../pages/admin/pages/MigrateProductImages'));
const AddOneRupeeItem = lazy(() => import('../pages/admin/pages/AddOneRupeeItem'));
const AddRequestedProducts = lazy(() => import('../pages/admin/pages/AddRequestedProducts'));
const UpdateProduct = lazy(() => import('../pages/admin/pages/UpdateProduct'));
const ManageAdvertisements = lazy(() => import('../pages/admin/pages/ManageAdvertisements'));
const SetupAdmin = lazy(() => import('../pages/admin/SetupAdmin'));
const MakeAdmin = lazy(() => import('../pages/admin/MakeAdmin'));
const Order = lazy(() => import('../pages/order/Order'));
const FirebaseDiagnostics = lazy(() => import('../pages/FirebaseDiagnostics'));

// Loading component for suspense
const LoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<AllProductsWithFilter />} />
      <Route path="/allproducts" element={<AllProductsWithFilter />} />
      <Route path="/product/:id" element={<ProductInfo />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/wishlist" element={<Wishlist />} />
      
      {/* Lazy loaded routes with suspense */}
      <Route path="/order" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/dashboard" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <Dashboard />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/admin-dashboard" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardTab />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/test-orders" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <TestOrders />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/dashboard-test" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <DashboardTest />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/firebase-test" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <FirebaseTest />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/add-product" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <AddProduct />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/migrate-product-images" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <MigrateProductImages />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/add-one-rupee-item" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <AddOneRupeeItem />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/add-requested-products" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <AddRequestedProducts />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/manage-advertisements" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <ManageAdvertisements />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/update-product/:id" element={
        <Suspense fallback={<LoadingComponent />}>
          <ProtectedRoute requireAdmin={true}>
            <UpdateProduct />
          </ProtectedRoute>
        </Suspense>
      } />
      
      <Route path="/setup-admin" element={
        <Suspense fallback={<LoadingComponent />}>
          <SetupAdmin />
        </Suspense>
      } />
      
      <Route path="/make-admin" element={
        <Suspense fallback={<LoadingComponent />}>
          <MakeAdmin />
        </Suspense>
      } />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/products/:id" element={<ProductInfo />} />
      
      <Route path="/firebase-diagnostics" element={
        <Suspense fallback={<LoadingComponent />}>
          <FirebaseDiagnostics />
        </Suspense>
      } />
      
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  );
};

export default AppRoutes;