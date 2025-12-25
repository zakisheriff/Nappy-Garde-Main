import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { addToast } = useToast();

    const handleAddToCart = async (e) => {
        e.preventDefault();

        const result = await addToCart(product.id, 1);
        if (result.success) {
            addToast('Added to cart!', 'success');
        } else {
            addToast(result.error || 'Failed to add to cart', 'error');
        }
    };

    const firstImage = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/300x300?text=No+Image';

    const avgRating = product.avg_rating || 0;
    const reviewCount = product.review_count || 0;

    return (
        <Link to={`/products/${product.id}`} className="product-card card-glass">
            <div className="product-image-container">
                <img
                    src={firstImage}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
                {product.stock === 0 && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                )}
            </div>

            <div className="product-details">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>

                {/* Rating */}
                {reviewCount > 0 && (
                    <div className="product-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < Math.round(avgRating) ? 'star filled' : 'star'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                </span>
                            ))}
                        </div>
                        <span className="rating-text">
                            {avgRating.toFixed(1)} ({reviewCount})
                        </span>
                    </div>
                )}

                {/* Piece Count - New */}
                {product.piece_count > 0 && (
                    <div className="product-pieces" style={{ fontSize: '13px', color: '#666', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        {product.piece_count} Pieces
                    </div>
                )}

                <div className="product-footer">
                    <div className="product-price">LKR {Number(product.price).toFixed(2)}</div>
                </div>

                {product.stock > 0 && product.stock < 10 && (
                    <div className="stock-warning">Only {product.stock} left!</div>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
