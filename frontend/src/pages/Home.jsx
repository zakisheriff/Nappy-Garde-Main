import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
// Updated icons for baby product vibe and professional look
import {
    Package,       // For Wide Selection/Shipping
    HeartHandshake, // For Trusted Service/Authentic Products
    FastForward,   // For Fast Delivery
    Sparkles,      // For Quality/Premium
    Star,
    ArrowRight,
    CheckCircle,    // Replaces the ✓
    Baby,           // New icon for baby focus
    ShieldCheck,    // Keeping this for Auth
    X               // Close icon for modal
} from 'lucide-react';

import api from '../api/api';

const Home = () => {
    useEffect(() => {
        // Scroll to top on mount for single-page app feel
        window.scrollTo(0, 0);
    }, []);

    const [newArrivals, setNewArrivals] = React.useState([]);
    const [bestSellers, setBestSellers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    // Size Calculator State
    const [showSizeModal, setShowSizeModal] = React.useState(false);
    const [weight, setWeight] = React.useState('');
    const [sizeResult, setSizeResult] = React.useState(null);

    const calculateSize = () => {
        const w = parseFloat(weight);
        if (!w || isNaN(w)) return;

        if (w <= 4) setSizeResult('Newborn');
        else if (w <= 8) setSizeResult('Small');
        else if (w <= 11) setSizeResult('Medium');
        else if (w <= 14) setSizeResult('Large');
        else if (w <= 17) setSizeResult('XL');
        else setSizeResult('XXL');
    };

    const handleInput = (e) => {
        setWeight(e.target.value);
        if (sizeResult) setSizeResult(null); // Reset result on new input
    };

    useEffect(() => {
        const fetchHomeProducts = async () => {
            try {
                const response = await api.get('/products');
                const allProducts = response.data.products;

                if (allProducts && allProducts.length > 0) {
                    // Simulating "New Arrivals" with the first 4 products
                    setNewArrivals(allProducts.slice(0, 4));
                    // Simulating "Best Sellers" with the next 3 products or random
                    setBestSellers(allProducts.slice(4, 7));
                }
            } catch (error) {
                console.error("Failed to fetch products for home page", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeProducts();
    }, []);

    if (loading) {
        return <div className="loading-container"><div className="loading-spinner"></div></div>;
    }

    return (
        <div className="home-page page">
            {/* 1. Hero Section (Hero 2.0 Premium - More 'Nappy Garde' focused) */}
            <section className="hero-section hero-split-layout">
                {/* Aurora Background Effects (Animation source in CSS) */}
                <div className="hero-aurora-1"></div>
                <div className="hero-aurora-2"></div>

                <div className="section-container hero-container-split">
                    {/* Left: Content */}
                    <div className="hero-content-left">
                        <h1 className="hero-headline-large">Premium Diapers <br />& Baby Care.</h1>
                        <p className="hero-subtext-large">
                            <strong>Nappy Garde</strong> is your trusted source for <strong>100% authentic</strong> products from <strong>Pampers</strong>, <strong>Velona Cuddles</strong>, and more.
                            <br className="desktop-only-break" />Quality care delivered directly to your home.
                        </p>

                        <div className="hero-actions-left">
                            <Link to="/products" className="btn btn-primary btn-xl animated-btn">Shop All Essentials</Link>
                            <button onClick={() => setShowSizeModal(true)} className="btn btn-primary btn-xl animated-btn" style={{ background: "rgba(203, 27, 27, 1)", border: 'none', cursor: 'pointer' }}>Find Size Guide</button>
                        </div>

                        <div className="hero-badges-row">
                            {/* Replaced Emojis with Icons & better text */}
                            <div className="badge-pill"><FastForward size={14} /> Fast Delivery</div>
                            <div className="badge-pill"><ShieldCheck size={14} /> Authentic Brands</div>
                            <div className="badge-pill"><Sparkles size={14} /> Premium Quality</div>
                        </div>
                    </div>

                    {/* Right: Visuals (Collage) */}
                    <div className="hero-visuals-right">
                        <div className="hero-main-image-wrapper">
                            {/* Main Image - Added a subtle animation class */}
                            <img
                                src="https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2787&auto=format&fit=crop"
                                alt="Happy Baby"
                                className="hero-main-image animated-image-tilt"
                            />
                            {/* Secondary Collage Image */}
                            <img
                                src="https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Baby Products"
                                className="hero-collage-img animated-image-pop"
                            />

                            {/* Floating Brand Cards (Animated in CSS) */}
                            <div className="floating-card card-1 brand-pampers animated-card">
                                <span className="brand-logo-text">Pampers</span>
                            </div>
                            <div className="floating-card card-2 brand-velona animated-card">
                                <span className="brand-logo-text">Velona Cuddles</span>
                            </div>
                            <div className="floating-card card-3 brand-global animated-card">
                                <span className="brand-logo-text">Global II</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. New Arrivals (Carousel) - Added an animation class */}
            <section className="section-container">
                <h2 className="section-headline">New Arrivals for Your Baby</h2>
                <div className="horizontal-scroll-container">
                    {newArrivals.map((product, index) => (
                        <Link to={`/products/${product.id}`} key={product.id} className="product-card-min animated-card-slide" style={{ textDecoration: 'none', color: 'inherit', animationDelay: `${index * 0.1}s` }}>
                            <div className="product-img-placeholder" style={{ height: '220px', background: '#f5f5f7', borderRadius: '14px', marginBottom: '16px', overflow: 'hidden' }}>
                                {product.images && product.images[0] ? (
                                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : null}
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{product.name}</h3>
                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{product.category}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontWeight: '700', fontSize: '16px' }}>LKR {product.price}</p>
                                {/* Added Baby Icon */}

                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. What's Moving Fast (Best Sellers) */}
            <section className="section-container best-sellers-section">
                <h2 className="section-headline">What Parents Are Loving</h2>
                <div className="horizontal-scroll-container">
                    {bestSellers.map(product => (
                        <Link to={`/products/${product.id}`} key={product.id} className="product-card-min animated-card-slide" style={{ position: 'relative', textDecoration: 'none', color: 'inherit' }}>
                            <span style={{ background: '#d63384', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '6px 10px', borderRadius: '20px', position: 'absolute', top: '16px', left: '16px', zIndex: 2, letterSpacing: '0.02em' }}>BESTSELLER</span>
                            <div className="product-img-placeholder" style={{ height: '240px', background: '#e5e5e5', borderRadius: '14px', marginBottom: '16px', overflow: 'hidden' }}>
                                {product.images && product.images[0] ? (
                                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : null}
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{product.name}</h3>
                            <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                                <Star size={14} fill="#f5a623" stroke="none" /><Star size={14} fill="#f5a623" stroke="none" /><Star size={14} fill="#f5a623" stroke="none" /><Star size={14} fill="#f5a623" stroke="none" /><Star size={14} fill="#f5a623" stroke="none" />
                                <span style={{ fontSize: '13px', color: '#666', marginLeft: '6px' }}>({Math.floor(Math.random() * 50) + 10})</span>
                            </div>
                            <p style={{ fontWeight: '700', fontSize: '16px', color: '#1d1d1f' }}>LKR {product.price}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 4. Why Parents Trust Us (Icon Grid - Icons updated and added hover) */}
            <section className="section-container">
                <h2 className="section-headline" style={{ textAlign: 'center', marginBottom: '40px' }}>The Nappy Garde Difference</h2>
                <div className="trust-grid">
                    <div className="trust-card animated-trust-card">
                        <div className="trust-icon-large"><Package size={48} strokeWidth={1.5} /></div>
                        <h3>Extensive Range</h3>
                        <p style={{ color: '#6e6e73' }}>Every essential for every stage.</p>
                    </div>
                    <div className="trust-card animated-trust-card">
                        <div className="trust-icon-large"><ShieldCheck size={48} strokeWidth={1.5} /></div>
                        <h3>Authentic Products</h3>
                        <p style={{ color: '#6e6e73' }}>100% Original Guaranteed.</p>
                    </div>
                    <div className="trust-card animated-trust-card">
                        <div className="trust-icon-large"><FastForward size={48} strokeWidth={1.5} /></div>
                        <h3>Swift Delivery</h3>
                        <p style={{ color: '#6e6e73' }}>Fast, reliable, and tracked shipping.</p>
                    </div>
                    <div className="trust-card animated-trust-card">
                        <div className="trust-icon-large"><HeartHandshake size={48} strokeWidth={1.5} /></div>
                        <h3>Parent Support</h3>
                        <p style={{ color: '#6e6e73' }}>We're here to help you.</p>
                    </div>
                </div>
            </section>

            {/* 5. Shop by Baby Stage (Added a Baby-Themed Title) */}
            <section className="section-container">
                <h2 className="section-headline">Find the Perfect Fit</h2>
                <div className="stage-grid">
                    <Link to="/products?category=Newborn" className="stage-card">
                        <div className="stage-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80')" }}></div>
                        <div className="stage-overlay"></div>
                        <div className="stage-content">
                            <div className="stage-title">Newborn Care</div>
                            <div className="stage-subtitle">0–4 kg Essentials</div>
                        </div>
                    </Link>
                    <Link to="/products?category=Infant" className="stage-card">
                        <div className="stage-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}></div>
                        <div className="stage-overlay"></div>
                        <div className="stage-content">
                            <div className="stage-title">Infant Needs</div>
                            <div className="stage-subtitle">4–8 kg Products</div>
                        </div>
                    </Link>
                    <Link to="/products?category=Toddler" className="stage-card">
                        <div className="stage-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=800&q=80')" }}></div>
                        <div className="stage-overlay"></div>
                        <div className="stage-content">
                            <div className="stage-title">Toddler Time</div>
                            <div className="stage-subtitle">8–14 kg Range</div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* 6. Day vs Night Diapers (Keeping the visual distinction) */}
            <section className="section-container">
                <div className="split-section animated-split-section">
                    <div className="split-card day">
                        <span style={{ fontWeight: '600', color: '#0071e3', marginBottom: '8px', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>Daytime Comfort</span>
                        <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>For Happy Playtime.</h2>
                        <p style={{ fontSize: '18px', maxWidth: '300px', marginBottom: '32px' }}>Flexible fit that moves with your baby for unrestricted play and dryness.</p>
                        <Link to="/products?type=day" className="btn btn-secondary animated-btn-secondary" style={{ width: 'fit-content' }}>Shop Day Diapers</Link>
                    </div>
                    <div className="split-card night">
                        <span style={{ fontWeight: '600', color: '#6e6e73', marginBottom: '8px', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>Overnight Protection</span>
                        <h2 style={{ fontSize: '36px', marginBottom: '16px', color: '#a1a1a6' }}>For Dream-Filled Nights.</h2>
                        <p style={{ fontSize: '18px', maxWidth: '300px', marginBottom: '32px', color: '#a1a1a6' }}>Max absorbency core locks wetness away for 12 hours of uninterrupted sleep.</p>
                        <Link to="/products?type=night" className="btn btn-primary animated-btn" style={{ width: 'fit-content' }}>Shop Night Diapers</Link>
                    </div>
                </div>
            </section>

            {/* 7. Real Parent Reviews (Infinite Loop - Animation handled in CSS) */}
            <section className="section-container">
                <h2 className="section-headline" style={{ textAlign: 'center' }}>Loved by Parents Like You</h2>
                <div className="marquee-wrapper">
                    <div className="marquee-content">
                        {/* Original Set */}
                        <div className="review-card">
                            <div className="stars">
                                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
                            </div>
                            <p className="review-text">“Super fast delivery! I ordered in the morning and got it by evening. Lifesaver for busy moms.”</p>
                            <p className="review-author">Sarah, Colombo</p>
                        </div>
                        <div className="review-card">
                            <div className="stars">
                                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
                            </div>
                            <p className="review-text">“Love the variety. I can buy different brands for day and night in one go. Excellent service from Nappy Garde.”</p>
                            <p className="review-author">Mike, Kandy</p>
                        </div>
                        <div className="review-card">
                            <div className="stars">
                                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
                            </div>
                            <p className="review-text">“Genuine products at the best prices. Nappy Garde is my go-to for all baby essentials.”</p>
                            <p className="review-author">Emily, Galle</p>
                        </div>
                        {/* Duplicated for Loop (Simple duplication for smooth scroll) */}
                        <div className="review-card">
                            <div className="stars">
                                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
                            </div>
                            <p className="review-text">“Super fast delivery! I ordered in the morning and got it by evening. Lifesaver for busy moms.”</p>
                            <p className="review-author">Sarah, Colombo</p>
                        </div>
                        <div className="review-card">
                            <div className="stars">
                                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
                            </div>
                            <p className="review-text">“Love the variety. I can buy different brands for day and night in one go. Excellent service from Nappy Garde.”</p>
                            <p className="review-author">Mike, Kandy</p>
                        </div>
                        <div className="review-card">
                            <div className="stars">
                                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
                            </div>
                            <p className="review-text">“Genuine products at the best prices. Nappy Garde is my go-to for all baby essentials.”</p>
                            <p className="review-author">Emily, Galle</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* 12. Parenting Tips (Blog Cards) */}
            <section className="section-container">
                <h2 className="section-headline">Nappy Garde Parenting Tips</h2>
                <div className="tips-grid">
                    <Link to="/guide/choosing-the-right-size" className="tip-card animated-tip-card">
                        <div className="tip-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}></div>
                        <div className="tip-content">
                            <h4 className="tip-title">Choosing the Right Size</h4>
                            <p className="tip-desc">How to prevent leaks by ensuring the perfect fit.</p>
                            <span className="tip-link">Read Guide <ArrowRight size={16} /></span>
                        </div>
                    </Link>
                    <Link to="/guide/preventing-diaper-rash" className="tip-card animated-tip-card">
                        <div className="tip-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}></div>
                        <div className="tip-content">
                            <h4 className="tip-title">Preventing Diaper Rash</h4>
                            <p className="tip-desc">Tips from dermatologists to keep baby skin healthy.</p>
                            <span className="tip-link">Read Guide <ArrowRight size={16} /></span>
                        </div>
                    </Link>
                    <Link to="/guide/day-vs-night-diapers" className="tip-card animated-tip-card">
                        <div className="tip-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}></div>
                        <div className="tip-content">
                            <h4 className="tip-title">Day vs Night Diapers</h4>
                            <p className="tip-desc">When to switch to maximum overnight protection.</p>
                            <span className="tip-link">Read Guide <ArrowRight size={16} /></span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* 13. Newsletter */}
            <section className="section-container" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '24px' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: '700' }}>Join the Nappy Garde Family</h2>
                <p style={{ color: '#666', marginBottom: '24px', fontSize: '17px' }}>Get expert parenting tips and exclusive offers delivered to your inbox.</p>
                <div style={{ maxWidth: '460px', margin: '0 auto', display: 'flex', gap: '8px' }}>
                    <input type="email" placeholder="Email address" className="form-input" style={{ borderRadius: '50px', border: '1px solid #ccc', padding: '12px 24px', flex: 1, fontSize: '16px' }} />
                    <button className="btn btn-primary animated-btn" style={{ borderRadius: '50px', padding: '14px 32px', fontSize: '16px', fontWeight: '600' }}>Sign Up</button>
                </div>
            </section>

            {/* Size Calculator Modal */}
            {showSizeModal && (
                <div className="modal-backdrop" onClick={() => setShowSizeModal(false)}>
                    <div className="size-finder-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setShowSizeModal(false)}>
                            <X size={20} />
                        </button>

                        <h3 className="modal-title">Find Your Perfect Fit</h3>
                        <p className="modal-subtitle">Enter your baby's weight to get the best size recommendation.</p>

                        <div className="size-input-group">
                            <label className="size-input-label">Baby's Weight</label>
                            <div className="size-input-wrapper">
                                <input
                                    type="number"
                                    className="size-input"
                                    placeholder="e.g. 5"
                                    value={weight}
                                    onChange={handleInput}
                                    onKeyDown={e => e.key === 'Enter' && calculateSize()}
                                />
                                <span className="input-suffix">kg</span>
                            </div>
                        </div>

                        <button className="calculate-btn" onClick={calculateSize}>
                            Find Size
                        </button>

                        {sizeResult && (
                            <div className="result-card">
                                <span className="result-label">Recommended Size</span>
                                <span className="result-size">{sizeResult}</span>
                                <Link
                                    to={`/products?size=${sizeResult}`}
                                    className="shop-size-btn"
                                    onClick={() => setShowSizeModal(false)}
                                >
                                    Shop {sizeResult} Diapers <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;