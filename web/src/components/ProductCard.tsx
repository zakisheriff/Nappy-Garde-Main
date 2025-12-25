"use client";

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import './ProductCard.css';

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

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if link is clicked
        e.stopPropagation();

        addToCart(product, 1);
        toast.success(`Added ${product.ProductName} to cart!`);
    };

    const imageUrl = product.ImageURL || 'https://via.placeholder.com/300x300?text=No+Image';
    const stock = Number(product.Stock);
    const price = Number(product.Price).toFixed(2);
    const isOutOfStock = stock <= 0;

    return (
        <Link href={`/products/${product.ProductID}`} className="product-card card-glass block">
            <div className="product-image-container relative">
                {/* Ensure aspect ratio or size in CSS */}
                <img
                    src={imageUrl}
                    alt={product.ProductName}
                    className="product-image w-full h-48 object-cover rounded-t-lg" // Basic Tailwind backup
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
                {isOutOfStock && (
                    <div className="out-of-stock-badge absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded">Out of Stock</div>
                )}
            </div>

            <div className="product-details p-4">
                {/* Category if available, not in schema but maybe in Descr? */}
                {/* <div className="product-category text-sm text-gray-500 mb-1">Category</div> */}

                <h3 className="product-name font-bold text-lg mb-2 truncate">{product.ProductName}</h3>

                <div className="product-footer flex justify-between items-center mt-4">
                    <div className="product-price font-bold text-xl">LKR {price}</div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="bg-primary hover:bg-primary-dark text-black px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#e2e8f0' }} // Fallback style if primary not defined
                    >
                        {isOutOfStock ? 'Sold Out' : 'Add +'}
                    </button>
                </div>

                {!isOutOfStock && stock < 10 && (
                    <div className="stock-warning text-red-500 text-xs mt-1">Only {stock} left!</div>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
