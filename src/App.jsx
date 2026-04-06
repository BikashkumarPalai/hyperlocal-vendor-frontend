import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateShop from './pages/vendor/CreateShop';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/vendor/create-shop" element={
            <ProtectedRoute role="vendor">
              <CreateShop />
            </ProtectedRoute>
          } />

          <Route path="/vendor/products" element={
            <ProtectedRoute role="vendor">
              <ProductManagement />
            </ProtectedRoute>
          } />

          {/* Vendor routes - coming soon */}
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute role="vendor">
              <div className="p-8 text-2xl font-bold text-green-600">
                Vendor Dashboard - Coming Soon
              </div>
            </ProtectedRoute>
          } />

          {/* Customer routes - coming soon */}
          <Route path="/marketplace" element={
            <ProtectedRoute role="customer">
              <div className="p-8 text-2xl font-bold text-blue-600">
                Marketplace - Coming Soon
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )
}

export default App