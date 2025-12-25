import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ProductCard from './ProductCard';
import './RecommendedProducts.css';

const RecommendedProducts = ({ title = "You might also like", excludeId = null, limit = 4, layout = 'grid' }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // In a real app, uses a recommendation endpoint. 
                // Here we fetch all and pick random ones.
                const response = await api.get('/products');
                let allProducts = response.data.products;

                if (excludeId) {
                    allProducts = allProducts.filter(p => p.id !== excludeId);
                }

                // Shuffle array
                const shuffled = allProducts.sort(() => 0.5 - Math.random());
                setProducts(shuffled.slice(0, limit));
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [excludeId, limit]);

    if (loading || products.length === 0) return null;

    return (
        <div className={`recommended-section ${layout}`}>
            <h2 className="recommended-title">{title}</h2>
            <div className={`recommended-grid ${layout}`}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default RecommendedProducts;
