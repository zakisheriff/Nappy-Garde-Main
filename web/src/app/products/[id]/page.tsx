"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import './ProductDetail.css';

const StarIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f5a623">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
        <polyline points="9 11 11 13 15 9" />
    </svg>
);

const TruckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
        <line x1="16" y1="8" x2="20" y2="8" />
        <path d="M16 16h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

interface Product {
    ProductID: string;
    ProductName: string;
    Price: string | number;
    Stock: string | number;
    ImageURL?: string;
    Description?: string;
    Benefits?: string;
    OriginalPrice?: string | number;
}

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [recommended, setRecommended] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        setLoading(true);
        setProduct(null);
        setQuantity(1);

        const fetchProduct = async () => {
            try {
                const res = await fetch('/api/products');
                const products = await res.json();
                const found = products.find((p: any) => p.ProductID === id);
                setProduct(found || null);

                if (Array.isArray(products)) {
                    const available = products.filter((p: Product) => p.ProductID !== id);
                    const shuffled = available.sort(() => 0.5 - Math.random());
                    setRecommended(shuffled.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        setAdding(true);
        addToCart(product, quantity);
        toast.success(`Added ${quantity} item(s) to cart!`);
        setAdding(false);
    };

    if (loading) return (
        <div className="product-detail-page page">
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        </div>
    );
    if (!product) return (
        <div className="product-detail-page page">
            <div className="loading-container">Product not found</div>
        </div>
    );

    const stock = Number(product.Stock);

    return (
        <div className="product-detail-page page">
            <div className="container-wide product-grid">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image">
                        <img src={product.ImageURL || 'https://via.placeholder.com/600'} alt={product.ProductName} />
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info-column">
                    <div className="product-header">
                        <span className="product-category">Baby Care</span>
                        <h1 className="product-title">{product.ProductName}</h1>

                        <div className="product-meta">
                            <div className="price-wrapper" style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                                {(product.OriginalPrice && Number(product.OriginalPrice) > Number(product.Price)) && (
                                    <span className="product-price-original" style={{
                                        color: '#86868b',
                                        textDecoration: 'line-through',
                                        fontSize: '20px',
                                        fontWeight: '500'
                                    }}>
                                        LKR {Number(product.OriginalPrice).toFixed(2)}
                                    </span>
                                )}
                                <span className="product-price" style={{
                                    color: (product.OriginalPrice && Number(product.OriginalPrice) > Number(product.Price)) ? '#ff3b30' : '#1d1d1f',
                                    fontSize: '32px'
                                }}>
                                    LKR {Number(product.Price).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="product-description">
                        <p>{product.Description || 'No description available.'}</p>
                        {product.Benefits ? (
                            <ul className="feature-list">
                                {product.Benefits.split(/[\n,]/).map((benefit, index) => (
                                    benefit.trim() && <li key={index}>{benefit.trim()}</li>
                                ))}
                            </ul>
                        ) : (
                            <ul className="feature-list"></ul>
                        )}
                    </div>

                    <div className="purchase-options">
                        <div className="quantity-selector">
                            <label>Quantity</label>
                            <div className="qty-controls">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >−</button>
                                <span>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                    disabled={quantity >= stock}
                                >+</button>
                            </div>
                        </div>

                        <div className="total-price-preview">
                            Total: <strong>LKR {(Number(product.Price) * quantity).toFixed(2)}</strong>
                        </div>

                        <button
                            className="btn btn-primary btn-large add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={adding || stock === 0}
                        >
                            {stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Bag'}
                        </button>
                    </div>

                    <div className="delivery-info">
                        <div className="info-item">
                            <span className="icon"><TruckIcon /></span>
                            <span>Fast Islandwide Delivery (LKR 300 - 500)</span>
                        </div>
                        <div className="info-item">
                            <span className="icon"><ShieldIcon /></span>
                            <span>100% Authentic & Genuine Products</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Parent Reviews Marquee - Matching Home Page Structure Exactly */}
            <section className="section-container reviews-section">
                <h2 className="section-headline" style={{ textAlign: 'center' }}>Loved by Parents Like You</h2>
                <div className="marquee-wrapper">
                    <div className="marquee-content">
                        {/* Original Set */}
                        <div className="review-card">
                            <div className="stars">
                                <StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} />
                            </div>
                            <p className="review-text">"Super fast delivery! I ordered in the morning and got it by evening. Lifesaver for busy moms."</p>
                            <p className="review-author">Ahmed Akram, Colombo</p>
                        </div>
                        <div className="review-card">
                            <div className="stars">
                                <StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} />
                            </div>
                            <p className="review-text">"Love the variety. I can buy different brands for day and night in one go. Excellent service from Nappy Garde."</p>
                            <p className="review-author">Dhanushka de Silva, Kandy</p>
                        </div>
                        <div className="review-card">
                            <div className="stars">
                                <StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} />
                            </div>
                            <p className="review-text">"Genuine products at the best prices. Nappy Garde is my go-to for all baby essentials."</p>
                            <p className="review-author">Samuel K, Galle</p>
                        </div>
                        {/* Duplicated for seamless loop */}
                        <div className="review-card">
                            <div className="stars">
                                <StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} />
                            </div>
                            <p className="review-text">"Super fast delivery! I ordered in the morning and got it by evening. Lifesaver for busy moms."</p>
                            <p className="review-author">Sarah Mohammad, Colombo</p>
                        </div>
                        <div className="review-card">
                            <div className="stars">
                                <StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} />
                            </div>
                            <p className="review-text">"Love the variety. I can buy different brands for day and night in one go. Excellent service from Nappy Garde."</p>
                            <p className="review-author">Kumarasinghe M, Kandy</p>
                        </div>
                        <div className="review-card">
                            <div className="stars">
                                <StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} /><StarIcon size={16} />
                            </div>
                            <p className="review-text">"Genuine products at the best prices. Nappy Garde is my go-to for all baby essentials."</p>
                            <p className="review-author">Rohan S, Galle</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommended Products */}
            {recommended.length > 0 && (
                <section className="recommended-section">
                    <div className="container-wide">
                        <h2 className="recommended-title">You Might Also Like</h2>
                        <div className="recommended-grid">
                            {recommended.map(product => (
                                <ProductCard key={product.ProductID} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
