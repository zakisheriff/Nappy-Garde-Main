import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import RecommendedProducts from '../components/RecommendedProducts';
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

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data.product);
            } catch (error) {
                console.error('Failed to fetch product', error);
                // navigate('/products'); // Redirect to products on error?
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setAdding(true);
        const result = await addToCart(product.id, quantity);
        setAdding(false);

        if (result.success) {
            addToast('Products Added', 'success');
        } else {
            addToast(result.error || 'Failed to add to cart. Please try again.', 'error');
        }
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
    if (!product) return <div className="loading-container">Product not found</div>;

    return (
        <div className="product-detail-page page">
            <div className="container-wide product-grid">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image">
                        {product.images && product.images[currentImage] && (
                            <img src={product.images[currentImage]} alt={product.name} />
                        )}
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="thumbnail-list">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${currentImage === index ? 'active' : ''} `}
                                    onClick={() => setCurrentImage(index)}
                                >
                                    <img src={img} alt={`${product.name} view ${index + 1} `} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info-column">
                    <div className="product-header">
                        <span className="product-category">{product.category}</span>
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-meta">
                            <div className="product-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} />
                                    ))}
                                </div>
                                <span className="review-count">({product.review_count} reviews)</span>
                            </div>
                            <span className="product-price">LKR {product.price}</span>
                        </div>
                    </div>

                    <div className="product-description">
                        <p>{product.description}</p>
                        <ul className="feature-list">
                            <li>Hypoallergenic & Dermatologist Tested</li>
                            <li>12-hour leak protection</li>
                            <li>Wetness indicator</li>
                            <li>Ultra-soft breathable materials</li>
                        </ul>
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
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                >+</button>
                            </div>
                        </div>

                        <div className="total-price-preview">
                            Total: <strong>LKR {(Number(product.price) * quantity).toFixed(2)}</strong>
                        </div>

                        <button
                            className="btn btn-primary btn-large add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={adding || product.stock === 0}
                        >
                            {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Bag'}
                        </button>
                    </div>

                    <div className="delivery-info">
                        <div className="info-item">
                            <span className="icon"><TruckIcon /></span>
                            <span>Free shipping on orders over LKR 5000</span>
                        </div>
                        <div className="info-item">
                            <span className="icon"><ReturnIcon /></span>
                            <span>30-day money-back guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-wide">
                <RecommendedProducts excludeId={product.id} />
            </div>
        </div>
    );
};

export default ProductDetail;
