"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import './ProductDetail.css';

const StarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f5a623">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
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

const ReturnIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 14 4 9 9 4" />
        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
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
        // Reset state when navigating to a new product
        setLoading(true);
        setProduct(null);
        setQuantity(1);

        const fetchProduct = async () => {
            try {
                const res = await fetch('/api/products');
                const products = await res.json();
                const found = products.find((p: any) => p.ProductID === id);
                setProduct(found || null);

                // Get recommended products (excluding current product)
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
                            <ul className="feature-list">
                                {/* Fallback or empty if no benefits provided in sheet */}
                            </ul>
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
                </div>
            </div>

            {/* Recommended Products */}
            {recommended.length > 0 && (
                <div className="container-wide recommended-section">
                    <h2 className="recommended-title">You Might Also Like</h2>
                    <div className="recommended-grid">
                        {recommended.map(product => (
                            <ProductCard key={product.ProductID} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
