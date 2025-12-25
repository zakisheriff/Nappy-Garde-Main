import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    CreditCard,
    BarChart2,
    Settings,
    LogOut,
    PieChart,
    Menu,
    X
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const { user, isAuthenticated, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    React.useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate('/admin/login');
            } else if (user?.role !== 'admin') {
                navigate('/'); // Kick non-admins out to homepage
            }
        }
    }, [isAuthenticated, user, navigate, loading]);



    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="admin-layout">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="admin-sidebar">
                <Link to="/admin" className="admin-logo">
                    <ShoppingBag size={28} color="#0071e3" />
                    <h2>Nappy Garde</h2>
                </Link>

                <nav className="admin-sidebar-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Package />
                        <span>Products</span>
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <ShoppingBag />
                        <span>Orders</span>
                    </NavLink>
                    <NavLink to="/admin/customers" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Users />
                        <span>Customers</span>
                    </NavLink>
                    <NavLink to="/admin/payments" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <CreditCard />
                        <span>Payments</span>
                    </NavLink>
                    <NavLink to="/admin/analytics" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <BarChart2 />
                        <span>Analytics</span>
                    </NavLink>
                    <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Settings />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Visible only on Mobile) */}
            <div className={`admin-mobile-top-layout ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-header-top">
                    <div className="admin-logo mobile">
                        <ShoppingBag size={24} color="#0071e3" />
                        <h2>Nappy Garde</h2>
                    </div>

                    {/* Apple-style Hamburger */}
                    <button
                        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            <div
                className={`admin-mobile-menu-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={closeMobileMenu}
            />

            {/* Mobile Menu Overlay */}
            <div className={`admin-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="admin-mobile-menu-content">
                    <nav className="admin-mobile-nav">
                        <NavLink to="/admin" end className="admin-mobile-link" onClick={closeMobileMenu}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/products" className="admin-mobile-link" onClick={closeMobileMenu}>
                            Products
                        </NavLink>
                        <NavLink to="/admin/orders" className="admin-mobile-link" onClick={closeMobileMenu}>
                            Orders
                        </NavLink>
                        <NavLink to="/admin/customers" className="admin-mobile-link" onClick={closeMobileMenu}>
                            Customers
                        </NavLink>
                        <NavLink to="/admin/payments" className="admin-mobile-link" onClick={closeMobileMenu}>
                            Payments
                        </NavLink>
                        <NavLink to="/admin/analytics" className="admin-mobile-link" onClick={closeMobileMenu}>
                            Analytics
                        </NavLink>
                        <NavLink to="/admin/settings" className="admin-mobile-link" onClick={closeMobileMenu}>
                            Settings
                        </NavLink>
                        <button className="admin-mobile-link logout" onClick={handleLogout}>
                            Log Out
                        </button>
                    </nav>
                </div>
            </div>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
