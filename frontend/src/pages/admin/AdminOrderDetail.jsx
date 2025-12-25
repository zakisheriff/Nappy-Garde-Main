import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import './AdminDashboard.css'; // Reusing admin styles
import { ChevronLeft } from 'lucide-react';

import { useToast } from '../../context/ToastContext';

const AdminOrderDetail = () => {
    const { id } = useParams();
    const { showToast } = useToast();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data.order);
                setItems(response.data.items || []); // Store items separately
            } catch (error) {
                console.error('Failed to fetch order', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            setOrder(prev => ({ ...prev, status: newStatus }));
            showToast(`Order updated to ${newStatus}`, 'success');
        } catch (error) {
            console.error('Failed to update status', error);
            showToast('Failed to update status', 'error');
        }
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
    if (!order) return <div className="admin-error">Order not found</div>;

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <Link to="/admin/orders" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#86868b', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                    <ChevronLeft size={16} />
                    Back to Orders
                </Link>
            </div>

            <header className="admin-page-header order-detail-header">
                <div>
                    <h1 className="admin-page-title">Order #{order.id}</h1>
                    <div className="order-actions-bar">
                        <span className="action-label">Action:</span>
                        <select
                            className="status-select"
                            value={order.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
                <div className="order-date-info">
                    <div style={{ fontSize: 13, color: '#86868b' }}>Date Placed</div>
                    <div style={{ fontWeight: 600 }}>{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
            </header>

            <div className="content-card mb-24">
                <h3 className="card-title">Items</h3>
                <div className="table-responsive">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                                                />
                                            )}
                                            <span>{item.product_name}</span>
                                        </div>
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>LKR {parseFloat(item.price).toLocaleString()}</td>
                                    <td>LKR {(item.quantity * parseFloat(item.price)).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 600, paddingTop: 20 }}>Total Amount:</td>
                                <td style={{ fontWeight: 700, fontSize: 16, paddingTop: 20 }}>LKR {parseFloat(order.total_price).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="grid-2 responsive-grid">
                <div className="content-card">
                    <h3 className="card-title">Delivery Details</h3>
                    <div className="detail-row">
                        <div className="detail-value emphasize">{order.delivery_name || order.user_name}</div>
                        <div className="detail-sub">{order.delivery_phone || order.user_phone}</div>
                        <div className="detail-address">
                            {order.delivery_address}
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h3 className="card-title">Payment Info</h3>
                    <div className="detail-group">
                        <div className="detail-key-value">
                            <span className="detail-key">Method:</span>
                            <span className="detail-value">{order.payment_method}</span>
                        </div>
                        <div className="detail-key-value">
                            <span className="detail-key">Payment Status:</span>
                            <span className={`detail-status ${order.status === 'Delivered' ? 'success' : 'pending'}`}>
                                {order.status === 'Delivered' ? 'Paid' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
