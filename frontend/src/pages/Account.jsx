import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/api';
import './Account.css';

const Account = () => {
    const { user, logout, isAuthenticated, updateProfile } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        zip: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                zip: user.zip || ''
            });
        }
    }, [user]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data.orders || []);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
        navigate('/');
    };

    const handleSaveProfile = async () => {
        const result = await updateProfile(formData);
        if (result.success) {
            setIsEditing(false);
            addToast('Profile updated successfully', 'success');
        } else {
            addToast(result.error, 'error');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!user) return null;

    return (
        <div className="account-page page">
            <div className="container-wide">
                <div className="account-header">
                    <h1>My Account</h1>
                </div>

                <div className="account-grid">
                    {/* User Profile */}
                    <div className="account-card profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="profile-info">
                                {isEditing ? (
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Full Name"
                                    />
                                ) : (
                                    <>
                                        <h2>{user.name}</h2>
                                        <p>{user.email}</p>
                                    </>
                                )}
                            </div>
                            <button
                                className="btn btn-sm btn-outline edit-btn"
                                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                            >
                                {isEditing ? 'Save' : 'Edit'}
                            </button>
                        </div>
                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="label">Phone</span>
                                {isEditing ? (
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input header-input"
                                        placeholder="Phone Number"
                                    />
                                ) : (
                                    <span className="value">{user.phone || 'Not provided'}</span>
                                )}
                            </div>

                            {/* Address Section */}
                            <div className="detail-item full-width">
                                <span className="label">Address</span>
                                {isEditing ? (
                                    <div className="address-edit-grid">
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Street Address"
                                        />
                                        <div className="form-row">
                                            <input
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="City"
                                            />
                                            <input
                                                name="zip"
                                                value={formData.zip}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="ZIP Code"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="value">
                                        {user.address ? (
                                            <>
                                                {user.address}<br />
                                                {user.city}, {user.zip}
                                            </>
                                        ) : 'No address saved'}
                                    </span>
                                )}
                            </div>

                            <div className="detail-item">
                                <span className="label">Member Since</span>
                                <span className="value">{new Date(user.created_at || Date.now()).getFullYear()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="account-card orders-card">
                        <h2>Order History</h2>
                        {loading ? (
                            <div className="loading-spinner small"></div>
                        ) : orders.length === 0 ? (
                            <div className="empty-state">
                                <p>You haven't placed any orders yet.</p>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <Link key={order.id} to={`/orders/${order.id}`} className="order-item-link">
                                        <div className="order-item">
                                            <div className="order-header">
                                                <span className="order-id">#{order.id}</span>
                                                <span className={`order - status ${order.status.toLowerCase()} `}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="order-details">
                                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                <span>LKR {parseFloat(order.total_price).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
