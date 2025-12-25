import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import RecommendedProducts from '../components/RecommendedProducts';
import './Cart.css';

const BagIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#86868b' }}>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const Cart = () => {
    const { cartItems, total, updateQuantity, removeFromCart, refreshCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        refreshCart();
    }, []);

    const handleQuantityChange = async (id, newQty) => {
        if (newQty < 1) return;
        await updateQuantity(id, newQty);
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page page empty">
                <div className="empty-cart-container">
                    <div className="empty-icon"><BagIcon /></div>
                    <h2>Your bag is empty.</h2>
                    <p>Free delivery and free returns.</p>
                    <Link to="/products" className="btn btn-primary btn-large">Continue Shopping</Link>
                </div>
                <div className="container-wide">
                    <RecommendedProducts title="You might also like" />
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page page">
            <div className="container-wide">
                <h1 className="cart-title">Review your bag.</h1>
                <p className="cart-subtitle">Free delivery and free returns.</p>

                <div className="cart-layout">
                    {/* Cart Items List */}
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    <img src={item.images && item.images[0] ? item.images[0] : ''} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <div className="item-header">
                                        <h3>{item.name}</h3>
                                        <div className="item-price">LKR {(Number(item.price) * item.quantity).toFixed(2)}</div>
                                    </div>
                                    <p className="item-specs">Unit Price: LKR {Number(item.price).toFixed(2)}</p>

                                    <div className="item-controls">
                                        <div className="quantity-control-small">
                                            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                                        </div>
                                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary">
                        <div className="summary-card">
                            <h2>Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>LKR {total.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated Tax</span>
                                <span>Included</span>
                            </div>
                            <div className="divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>LKR {total.toFixed(2)}</span>
                            </div>

                            <Link to="/checkout" className="btn btn-primary btn-large checkout-btn">Check Out</Link>
                        </div>
                    </div>
                </div>

                <RecommendedProducts />
            </div>
        </div>
    );
};

export default Cart;
