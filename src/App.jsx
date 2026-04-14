import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateShop from './pages/vendor/CreateShop';
import ProductManagement from './pages/vendor/ProductManagement';
import VendorDashboard from './pages/vendor/VendorDashboard';
import Marketplace from './pages/customer/Marketplace';
import ShopDetail from './pages/customer/ShopDetail';
import MyOrders from './pages/customer/MyOrders';
import VendorOrders from './pages/vendor/VendorOrders';
import Cart from './pages/customer/Cart';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Customer Routes */}
          <Route path="/cart" element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/customer/orders" element={
            <ProtectedRoute role="customer">
              <MyOrders />
            </ProtectedRoute>
          } />

          <Route path="/marketplace" element={
            <ProtectedRoute role="customer">
              <Marketplace />
            </ProtectedRoute>
          } />

          <Route path="/shop/:id" element={
            <ProtectedRoute role="customer">
              <ShopDetail />
            </ProtectedRoute>
          } />

          <Route path="/vendor/orders" element={
            <ProtectedRoute role="vendor">
              <VendorOrders />
            </ProtectedRoute>
          } />

          {/* vendor routes */}
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute role="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          } />

          {/* shop creation */}
          <Route path="/vendor/create-shop" element={
            <ProtectedRoute role="vendor">
              <CreateShop />
            </ProtectedRoute>
          } />

          {/* Manage product */}
          <Route path="/vendor/products" element={
            <ProtectedRoute role="vendor">
              <ProductManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )
}

export default App