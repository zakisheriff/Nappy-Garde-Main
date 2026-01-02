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
    const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

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
        if (cartItems.length === 0 && !orderSuccess) {
            router.push('/cart');
        }
    }, [cartItems, router, orderSuccess]);

    useEffect(() => {
        if (orderSuccess) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [orderSuccess]);


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
        if (code === 'HELLO2026' || code === 'WELCOME10') {
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
                const fullOrderDetails = {
                    orderId: orderData.orderId,
                    date: new Date().toLocaleString(),
                    customer: formData,
                    items: cartItems,
                    subtotal: total,
                    discount: discount,
                    deliveryCharge: deliveryCharge,
                    total: finalTotal,
                    promoCode: discount > 0 ? promoCode : ''
                };
                setOrderSuccess(fullOrderDetails);
                clearCart();
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

    if (orderSuccess) {
        return (
            <div className="checkout-page page">
                <div className="container-wide checkout-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column' }}>

                    <div id="receipt-area" style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        maxWidth: '600px',
                        width: '100%',
                        marginBottom: '30px',
                        color: '#1d1d1f'
                    }}>
                        {/* Header */}
                        <div style={{ textAlign: 'center', borderBottom: '2px solid #f5f5f7', paddingBottom: '20px', marginBottom: '20px' }}>
                            <img src="/new_logo.png" alt="Nappy Garde" style={{ width: '80px', height: '80px', margin: '0 auto 10px', objectFit: 'contain' }} />
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>Nappy Garde</h2>
                            <p style={{ fontSize: '14px', color: '#6e6e73', margin: '4px 0' }}>231 Wolfendhal St, Colombo 00130, LK</p>
                            <p style={{ fontSize: '14px', color: '#6e6e73', margin: '0' }}>+94 77 779 8788</p>
                        </div>

                        {/* Order Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '14px' }}>
                            <div>
                                <p style={{ fontWeight: '600', marginBottom: '4px' }}>Order ID:</p>
                                <p>{orderSuccess.orderId}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: '600', marginBottom: '4px' }}>Date:</p>
                                <p>{orderSuccess.date}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div style={{ marginBottom: '30px', fontSize: '14px' }}>
                            <p style={{ fontWeight: '600', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Bill To:</p>
                            <p style={{ margin: '0' }}>{orderSuccess.customer.name}</p>
                            <p style={{ margin: '0' }}>{orderSuccess.customer.phone}</p>
                            <p style={{ margin: '0' }}>{orderSuccess.customer.address}, {orderSuccess.customer.district}</p>
                        </div>

                        {/* Items Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '8px 0', fontWeight: '600' }}>Item</th>
                                    <th style={{ padding: '8px 0', textAlign: 'center' }}>Qty</th>
                                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderSuccess.items.map((item: any, idx: number) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '12px 0' }}>{item.ProductName}</td>
                                        <td style={{ padding: '12px 0', textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ padding: '12px 0', textAlign: 'right' }}>LKR {(Number(item.Price) * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div style={{ borderTop: '2px solid #f5f5f7', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                <span>Subtotal</span>
                                <span>LKR {orderSuccess.subtotal.toFixed(2)}</span>
                            </div>

                            {orderSuccess.discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#27ae60' }}>
                                    <span>Discount ({orderSuccess.promoCode})</span>
                                    <span>- LKR {orderSuccess.discount.toFixed(2)}</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                <span>Delivery</span>
                                <span>LKR {orderSuccess.deliveryCharge.toFixed(2)}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '18px', fontWeight: 'bold', color: '#1d1d1f' }}>
                                <span>Total</span>
                                <span>LKR {orderSuccess.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#86868b' }}>
                            <p>Thank you for shopping with Nappy Garde!</p>
                            <p>www.nappygarde.lk</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                        <button
                            onClick={() => {
                                const printContent = document.getElementById('receipt-area');
                                if (printContent) {
                                    const style = document.createElement('style');
                                    style.innerHTML = `
                                        @media print {
                                            body * { visibility: hidden; }
                                            #receipt-area, #receipt-area * { visibility: visible; }
                                            #receipt-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
                                            .btn, button { display: none !important; }
                                        }
                                    `;
                                    document.head.appendChild(style);
                                    window.print();
                                    document.head.removeChild(style);
                                }
                            }}
                            className="btn"
                            style={{
                                minWidth: '200px',
                                borderRadius: '980px', // Pill shape
                                backgroundColor: '#ff3b30', // Apple Red
                                color: 'white',
                                fontWeight: '600',
                                padding: '16px 32px',
                                boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
                                flex: '1 1 200px'
                            }}
                        >
                            Download Receipt
                        </button>

                        <button
                            onClick={() => router.push('/products')}
                            className="btn"
                            style={{
                                minWidth: '200px',
                                borderRadius: '980px', // Pill shape
                                backgroundColor: 'transparent',
                                border: '1px solid #0071e3', // Apple Blue Border
                                color: '#0071e3',
                                fontWeight: '600',
                                padding: '14px 30px', /* accounting for border */
                                flex: '1 1 200px'
                            }}
                        >
                            Continue Shopping
                        </button>
                    </div>

                </div>
            </div>
        );
    }

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
                            {loading ? 'Processing...' : `Place Order (LKR ${(total - discount + deliveryCharge).toFixed(2)})`}
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
