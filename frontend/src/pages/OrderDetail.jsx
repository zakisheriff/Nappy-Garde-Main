import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data.order);
                setItems(response.data.items);
            } catch (err) {
                console.error('Failed to fetch order', err);
                setError('Order not found or you do not have permission to view it.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="page loading">Loading...</div>;
    if (error) return (
        <div className="page error-page">
            <div className="container-wide">
                <h2>{error}</h2>
                <Link to="/account" className="btn btn-primary">Back to Account</Link>
            </div>
        </div>
    );
    if (!order) return null;

    return (
        <div className="order-detail-page page">
            <div className="container-wide">
                <div className="order-detail-header">
                    <Link to="/account" className="back-link">← Back to Orders</Link>
                    <h1>Order #{order.id}</h1>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>

                <div className="order-content-grid">
                    <div className="order-items-section">
                        <h2>Items</h2>
                        <div className="order-items-list">
                            {items.map(item => (
                                <div key={item.id} className="order-item-card">
                                    <div className="item-image">
                                        <img src={item.images && item.images[0]} alt={item.product_name} />
                                    </div>
                                    <div className="item-info">
                                        <h3>{item.product_name}</h3>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        LKR {Number(item.price).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-info-sidebar">
                        <div className="info-card">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Date</span>
                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>LKR {Number(order.total_price).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3>Delivery Details</h3>
                            <p className="recipient">{order.delivery_name}</p>
                            <p className="address">
                                {order.delivery_address}
                            </p>
                            <p className="phone">{order.delivery_phone}</p>
                        </div>

                        <div className="info-card">
                            <h3>Payment</h3>
                            <p>{order.payment_method === 'COD' ? 'Cash on Delivery' : order.payment_method}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
