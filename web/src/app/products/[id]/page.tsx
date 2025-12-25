"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface Product {
    ProductID: string;
    ProductName: string;
    Price: string | number;
    Stock: string | number;
    ImageURL?: string;
    Description?: string;
}

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Inefficient but simple: fetch all and find
                const res = await fetch('/api/products');
                const products = await res.json();
                const found = products.find((p: any) => p.ProductID === id);
                setProduct(found || null);
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading product...</div>;
    if (!product) return <div className="p-8 text-center">Product not found.</div>;

    const stock = Number(product.Stock);
    const isOutOfStock = stock <= 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <img
                        src={product.ImageURL || 'https://via.placeholder.com/500'}
                        alt={product.ProductName}
                        className="w-full rounded-xl shadow-lg object-cover"
                        style={{ maxHeight: '500px' }}
                    />
                </div>
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold mb-4">{product.ProductName}</h1>
                    <div className="text-2xl font-bold text-blue-600 mb-6">LKR {Number(product.Price).toFixed(2)}</div>

                    <p className="text-gray-700 leading-relaxed mb-6">
                        {product.Description || 'No description available.'}
                    </p>

                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => {
                                addToCart(product, 1);
                                toast.success(`Added to cart!`);
                            }}
                            disabled={isOutOfStock}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-lg disabled:opacity-50"
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>

                    {stock > 0 && stock < 10 && (
                        <p className="text-red-500 mt-2 text-sm">Only {stock} items left!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
