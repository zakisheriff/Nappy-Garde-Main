import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { Search, Filter, ChevronDown } from 'lucide-react';
import './AdminDashboard.css'; // Reusing table styles for consistency

const AdminOrders = () => {
    const { showToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data.orders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
            );
            showToast(`Order #${orderId} updated to ${newStatus}`, 'success');
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toString().includes(searchTerm) ||
            order.delivery_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    return (
        <div>
            <header className="admin-page-header">
                <h1 className="admin-page-title">Orders</h1>
            </header>

            {/* Toolbar: Search + Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 24 }}>
                <div className="orders-controls">
                    <div className="global-search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="global-search-input"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
                    {['All', 'Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                background: filterStatus === status ? '#0071e3' : '#e5e5ea',
                                color: filterStatus === status ? '#fff' : '#1d1d1f',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="content-card">
                <div className="table-responsive">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td className="user-info-cell">
                                            <div>{order.delivery_name}</div>
                                            <div>{order.delivery_phone}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '13px', color: '#1d1d1f' }}>
                                                {order.items && order.items.map((item, idx) => (
                                                    <div key={idx} style={{ marginBottom: 4 }}>
                                                        {item.quantity}x {item.product_name}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>LKR {parseFloat(order.total_price).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                <select
                                                    className="status-select"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <Link to={`/admin/orders/${order.id}`} className="view-btn">View</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#86868b' }}>
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
