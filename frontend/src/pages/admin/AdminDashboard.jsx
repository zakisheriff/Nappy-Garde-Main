import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/api';
import { DollarSign, ShoppingBag, Truck, Package, AlertCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/orders');
            const fetchedOrders = response.data.orders;
            setOrders(fetchedOrders);
            calculateStats(fetchedOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            showToast('Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (ordersData) => {
        const totalRevenue = ordersData.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
        const pending = ordersData.filter(o => o.status === 'Pending').length;
        const delivered = ordersData.filter(o => o.status === 'Delivered').length;
        setStats({
            totalRevenue,
            totalOrders: ordersData.length,
            pendingOrders: pending,
            deliveredOrders: delivered
        });
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    return (
        <div className="dashboard-overview">
            <header className="admin-page-header">
                <h1 className="admin-page-title">Dashboard Overview</h1>
                <div style={{ color: '#86868b' }}>Welcome back, {user?.email}</div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-bg purple">
                        <DollarSign color="#af52de" />
                    </div>
                    <div>
                        <div className="stat-label">Total Revenue</div>
                        <div className="stat-value">LKR {stats.totalRevenue.toLocaleString()}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-bg blue">
                        <ShoppingBag color="#0071e3" />
                    </div>
                    <div>
                        <div className="stat-label">Total Orders</div>
                        <div className="stat-value">{stats.totalOrders}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-bg orange">
                        <Package color="#ff9500" />
                    </div>
                    <div>
                        <div className="stat-label">Pending Orders</div>
                        <div className="stat-value">{stats.pendingOrders}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-bg green">
                        <Truck color="#34c759" />
                    </div>
                    <div>
                        <div className="stat-label">Delivered</div>
                        <div className="stat-value">{stats.deliveredOrders}</div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="dashboard-content-grid">
                {/* Recent Orders - Simplified */}
                <div className="content-card">
                    <div className="card-header">
                        <h3>Recent Orders</h3>
                    </div>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map(order => (
                                <tr
                                    key={order.id}
                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>
                                        <Link to={`/admin/orders/${order.id}`} className="order-link">
                                            #{order.id}
                                        </Link>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>LKR {parseFloat(order.total_price).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Low Stock Alerts (Mock for now as backend endpoint for low stock aggregation is pending) */}
                <div className="content-card">
                    <div className="card-header">
                        <h3>Low Stock Alerts</h3>
                        <AlertCircle size={20} color="#ff3b30" />
                    </div>
                    <div className="empty-state-card">
                        <p>No stock alerts at this time.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
