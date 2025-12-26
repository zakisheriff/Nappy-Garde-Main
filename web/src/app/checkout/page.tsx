"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import './Checkout.css';

export default function CheckoutPage() {
    const { cartItems, total, clearCart, removeFromCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (cartItems.length === 0) {
            router.push('/cart');
        }
    }, [cartItems, router]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Save to Google Sheet via API
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: formData,
                    items: cartItems,
                    total: total,
                }),
            });

            const orderData = await orderRes.json();

            if (orderData.success) {
                // 2. Construct WhatsApp Message
                const itemsList = cartItems.map(i => `- ${i.ProductName} (x${i.quantity})`).join('%0a');
                const message = `*New Order: ${orderData.orderId}*%0a%0a*Customer:* ${formData.name}%0a*Phone:* ${formData.phone}%0a*Address:* ${formData.address}%0a%0a*Items:*%0a${itemsList}%0a%0a*Total:* LKR ${total.toFixed(2)}%0a%0aPlease confirm my order.`;

                const shopPhone = '94758760367';
                const whatsappUrl = `https://wa.me/${shopPhone}?text=${message}`;

                clearCart();
                window.location.href = whatsappUrl;
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong.');
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
                                    name="name"
                                    className="form-input"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="phone-input-wrapper">
                                    <span className="phone-prefix">+94</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input phone-input"
                                        placeholder="7XXXXXXXX"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        pattern="[0-9]{9}"
                                        maxLength={9}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Delivery Address</label>
                                <textarea
                                    name="address"
                                    className="form-input"
                                    rows={3}
                                    placeholder="e.g. 123 Main Street, Colombo 07"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Payment</h2>
                            <div className="payment-options">
                                <div className="payment-option selected">
                                    <input type="radio" checked readOnly />
                                    <span>Cash on Delivery (COD)</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="checkout-sidebar">
                    <div className="order-summary-card">
                        <h2>In Your Bag</h2>
                        <div className="summary-items-list">
                            {cartItems.map(item => (
                                <div key={item.ProductID} className="summary-item">
                                    <div className="summary-item-img">
                                        <img src={item.ImageURL || 'https://via.placeholder.com/80'} alt={item.ProductName} />
                                    </div>
                                    <div className="summary-item-info">
                                        <span className="name">{item.ProductName}</span>
                                        <span className="qty">Qty: {item.quantity}</span>
                                    </div>
                                    <div className="summary-item-price-actions">
                                        <div className="summary-item-price">
                                            LKR {(Number(item.Price) * item.quantity).toFixed(2)}
                                        </div>
                                        <button
                                            type="button"
                                            className="summary-remove-btn"
                                            onClick={() => removeFromCart(item.ProductID)}
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
                            {loading ? 'Processing...' : 'Place Order on WhatsApp'}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
