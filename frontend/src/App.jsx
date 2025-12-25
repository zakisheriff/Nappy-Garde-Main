
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Account from './pages/Account';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderDetail from './pages/OrderDetail';
import Guide from './pages/Guide';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrderDetail from './pages/admin/AdminOrderDetail'; // Import AdminOrderDetail
import './styles/index.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          {loading ? (
            <SplashScreen onFinish={() => setLoading(false)} />
          ) : (
            <Router>
              <div className="app fade-in">
                <main className="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                    <Route path="/products" element={<><Navbar /><Products /><Footer /></>} />
                    <Route path="/products/:id" element={<><Navbar /><ProductDetail /><Footer /></>} />
                    <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
                    <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
                    <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
                    <Route path="/account" element={<><Navbar /><Account /><Footer /></>} />
                    <Route path="/orders/:id" element={<><Navbar /><OrderDetail /><Footer /></>} />
                    <Route path="/guide/:slug" element={<><Navbar /><Guide /><Footer /></>} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="orders/:id" element={<AdminOrderDetail />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="payments" element={<AdminPayments />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="*" element={<div style={{ padding: 20 }}>Module coming soon...</div>} />
                    </Route>
                  </Routes>
                </main>
              </div>
            </Router>
          )}
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
