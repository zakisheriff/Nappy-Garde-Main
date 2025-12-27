"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    ProductID: string;
    ProductName: string;
    Price: string | number;
    Stock: string | number;
    ImageURL?: string;
    // Optional / Legacy fields
    Description?: string;
}

const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();

    const imageUrl = product.ImageURL || 'https://via.placeholder.com/300x300?text=No+Image';
    const stock = Number(product.Stock);
    const price = Number(product.Price).toFixed(2);
    const isOutOfStock = stock <= 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();

        // Pass the product object with correct keys as expected by CartContext
        addToCart({
            ProductID: product.ProductID,
            ProductName: product.ProductName,
            Price: product.Price,
            ImageURL: imageUrl, // Use the computed URL (with fallback)
        });
        toast.success(`Added ${product.ProductName} to cart`);
    };

    return (
        <Link href={`/products/${product.ProductID}`} className="product-card card-glass">
            <div className="product-image-container">
                {/* Ensure aspect ratio or size in CSS */}
                <img
                    src={imageUrl}
                    alt={product.ProductName}
                    className="product-image"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
                {isOutOfStock && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                )}
            </div>

            <div className="product-details">
                {/* Category if available, not in schema but maybe in Descr? */}


                <h3 className="product-name">{product.ProductName}</h3>

                <div className="product-footer">
                    <div className="product-price">LKR {price}</div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="product-card-action-btn"
                    >
                        <ShoppingCart size={16} />
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>

                {!isOutOfStock && stock < 10 && (
                    <div className="stock-warning">Only {stock} left!</div>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
