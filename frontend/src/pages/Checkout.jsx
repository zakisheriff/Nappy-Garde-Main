import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RecommendedProducts from '../components/RecommendedProducts';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, total, clearCart, removeFromCart } = useCart();
    const { user } = useAuth(); // Get user from auth context
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        delivery_name: '',
        delivery_phone: '',
        delivery_address: '',
        city: '',
        zip: '',
        payment_method: 'COD' // Default for now
    });

    // Pre-fill form from user profile
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                delivery_name: user.name || '',
                delivery_phone: user.phone || '',
                delivery_address: user.address || '',
                city: user.city || '',
                zip: user.zip || ''
            }));
        }
    }, [user]);

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const fullAddress = `${formData.delivery_address}, ${formData.city}, ${formData.zip} `;

        try {
            const response = await api.post('/orders', {
                delivery_name: formData.delivery_name,
                delivery_phone: formData.delivery_phone,
                delivery_address: fullAddress,
                payment_method: formData.payment_method
            });

            if (response.status === 201) {
                addToast('Order placed successfully!', 'success');
                clearCart();
                navigate('/account'); // Redirect to account/orders page
            }
        } catch (error) {
            console.error('Checkout error:', error);
            addToast('Failed to place order. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page page">
            <div className="container-wide checkout-container">
                <div className="checkout-main">
                    <h1 className="checkout-title">Checkout</h1>

                    <form id="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h2>Delivery Information</h2>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="delivery_name"
                                    className="form-input"
                                    value={formData.delivery_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="delivery_phone"
                                    className="form-input"
                                    value={formData.delivery_phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Street Address</label>
                                <input
                                    type="text"
                                    name="delivery_address"
                                    className="form-input"
                                    value={formData.delivery_address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-row two-col">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-input"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        className="form-input"
                                        value={formData.zip}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Payment</h2>
                            <div className="payment-options">
                                <div className="payment-option selected">
                                    <input type="radio" checked readOnly />
                                    <span>Cash on Delivery (COD)</span>
                                </div>
                                {/* Add more payment methods later */}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="checkout-sidebar">
                    <div className="order-summary-card">
                        <h2>In Your Bag</h2>
                        <div className="summary-items-list">
                            {cartItems.map(item => (
                                <div key={item.id} className="summary-item">
                                    <div className="summary-item-img">
                                        <img src={item.images && item.images[0]} alt={item.name} />
                                    </div>
                                    <div className="summary-item-info">
                                        <span className="name">{item.name}</span>
                                        <span className="qty">Qty: {item.quantity}</span>
                                    </div>
                                    <div className="summary-item-price-actions">
                                        <div className="summary-item-price">
                                            LKR {(Number(item.price) * item.quantity).toFixed(2)}
                                        </div>
                                        <button
                                            type="button"
                                            className="summary-remove-btn"
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label="Remove item"
                                        >×</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="divider"></div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>LKR {total.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="btn btn-primary btn-large place-order-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-wide">
                <RecommendedProducts title="Don't forget these essentials" limit={3} />
            </div>
        </div>
    );
};

export default Checkout;
