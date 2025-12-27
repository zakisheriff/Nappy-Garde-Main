"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import './Checkout.css';

interface Product {
    ProductID: string;
    ProductName: string;
    Price: string | number;
    Stock: string | number;
    ImageURL?: string;
}

export default function CheckoutPage() {
    const { cartItems, total, clearCart, removeFromCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        district: '',
    });
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [deliveryNote, setDeliveryNote] = useState('');

    // Sri Lankan Districts
    const districts = [
        'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
        'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
        'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
        'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
        'Monaragala', 'Ratnapura', 'Kegalle'
    ];
    const [recommended, setRecommended] = useState<Product[]>([]);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const response = await fetch('/api/products');
                const products = await response.json();
                if (Array.isArray(products)) {
                    const cartIds = cartItems.map(item => item.ProductID);
                    const available = products.filter((p: Product) => !cartIds.includes(p.ProductID));
                    const shuffled = available.sort(() => 0.5 - Math.random());
                    setRecommended(shuffled.slice(0, 4));
                }
            } catch (error) {
                console.error('Failed to fetch recommended products', error);
            }
        };
        fetchRecommended();
    }, [cartItems]);

    useEffect(() => {
        if (cartItems.length === 0) {
            router.push('/cart');
        }
    }, [cartItems, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === 'district') {
            const selectedDistrict = e.target.value;
            if (selectedDistrict === 'Colombo') {
                setDeliveryCharge(300);
                setDeliveryNote('');
            } else if (selectedDistrict === '') {
                setDeliveryCharge(0);
                setDeliveryNote('');
            } else {
                setDeliveryCharge(500);
                setDeliveryNote('(Delivery: LKR 400 - 500)');
            }
        }

        // Anti-Fraud: Clear discount if details are changed after applying
        if (discount > 0) {
            setDiscount(0);
            setPromoSuccess('');
            setPromoError('Details changed. Please re-apply promo code.');
        }
    };

    const handleApplyPromo = async () => {
        setPromoError('');
        setPromoSuccess('');
        const code = promoCode.trim().toUpperCase();

        // 0. Check prerequisites
        if (!formData.phone || !formData.address) {
            setPromoError('Please enter your Phone Number and Address first to verify eligibility.');
            return;
        }

        // 1. Validate Code locally
        let validCode = false;
        if (code === 'NEWYEAR2026' || code === 'WELCOME10') {
            validCode = true;
        }

        if (!validCode) {
            setDiscount(0);
            setPromoError('Invalid promo code');
            return;
        }

        // 2. Validate Usage with Backend
        try {
            const res = await fetch('/api/verify-promo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.phone,
                    address: formData.address,
                    code: code
                })
            });
            const data = await res.json();

            if (!data.allowed) {
                setDiscount(0);
                setPromoError(data.message || 'Promo code not available.');
                return;
            }

            // 3. Apply Discount
            const discountAmount = total * 0.10; // 10% Discount
            setDiscount(discountAmount);
            setPromoSuccess('Promo applied: 10% Off!');

        } catch (err) {
            console.error(err);
            setPromoError('Could not verify promo code. Please try again.');
        }
    };

    // ... existing useEffects ...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const finalTotal = total - discount + deliveryCharge;

        try {
            // 1. Save to Google Sheet via API
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: formData,
                    items: cartItems,
                    total: finalTotal,
                    promoCode: discount > 0 ? promoCode : '',
                    discount: discount,
                    deliveryCharge: deliveryCharge
                }),
            });

            const orderData = await orderRes.json();

            if (orderData.success) {
                // 2. Construct WhatsApp Message
                const itemsList = cartItems.map(i => `- ${i.ProductName} (x${i.quantity})`).join('%0a');
                let message = `*New Order: ${orderData.orderId}*%0a%0a*Customer:* ${formData.name}%0a*Phone:* ${formData.phone}%0a*Address:* ${formData.address}%0a*District:* ${formData.district}%0a%0a*Items:*%0a${itemsList}`;

                if (discount > 0) {
                    message += `%0a%0a*Subtotal:* LKR ${total.toFixed(2)}%0a*Discount:* -LKR ${discount.toFixed(2)} (${promoCode})`;
                }

                if (deliveryCharge > 0) {
                    message += `%0a*Delivery:* LKR ${deliveryCharge.toFixed(2)}`;
                }

                message += `%0a*Total:* LKR ${finalTotal.toFixed(2)}%0a%0aPlease confirm my order.`;

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
                            <div className="form-group">
                                <label>District</label>
                                <select
                                    name="district"
                                    className="form-select"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 48px 12px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid #d2d2d7',
                                        fontSize: '16px',
                                        color: '#1d1d1f',
                                        backgroundColor: '#fff',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM4Njg2OGIiIHN0cm9rZS13aWR0aD0iMiI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+")',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 16px center',
                                        backgroundSize: '16px',
                                    }}
                                >
                                    <option value="">Select your district</option>
                                    {districts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
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

                        <div className="promo-code-section">
                            <div className="promo-input-group">
                                <input
                                    type="text"
                                    placeholder="Promo Code"
                                    className="form-input promo-input"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary promo-btn"
                                    onClick={handleApplyPromo}
                                >
                                    Apply
                                </button>
                            </div>
                            {promoError && <p className="promo-message error">{promoError}</p>}
                            {promoSuccess && <p className="promo-message success">{promoSuccess}</p>}
                        </div>

                        <div className="divider"></div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>LKR {total.toFixed(2)}</span>
                        </div>

                        {discount > 0 && (
                            <div className="summary-row discount">
                                <span>Discount</span>
                                <span>- LKR {discount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="summary-row">
                            <span>Delivery</span>
                            <div style={{ textAlign: 'right' }}>
                                <span>LKR {deliveryCharge.toFixed(2)}</span>
                                {deliveryNote && <div style={{ fontSize: '10px', color: '#86868b' }}>{deliveryNote}</div>}
                            </div>
                        </div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>LKR {(total - discount + deliveryCharge).toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="place-order-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Place Order (LKR ${(total - discount + deliveryCharge).toFixed(2)}) on WhatsApp`}
                        </button>

                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            {recommended.length > 0 && (
                <div className="container-wide">
                    <div className="recommended-section">
                        <h2 className="recommended-title">Add More to Your Order</h2>
                        <div className="recommended-grid">
                            {recommended.map(product => (
                                <ProductCard key={product.ProductID} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
