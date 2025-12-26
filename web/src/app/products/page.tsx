"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import './Products.css';

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [allProducts, setAllProducts] = useState<any[]>([]); // Store all raw products
    const [products, setProducts] = useState<any[]>([]); // Store filtered products to display
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Lock body scroll when mobile filters are open
    useEffect(() => {
        if (showMobileFilters) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showMobileFilters]);

    const [filters, setFilters] = useState<{
        category: string;
        search: string;
        brand: string[];
        inStock: boolean;
        sort: string;
    }>({
        category: searchParams.get('category') || '',
        search: searchParams.get('search') || '',
        brand: [],
        inStock: false,
        sort: 'newest',
    });

    const BRANDS = ['Marvel', 'Global II', 'Velona Cuddles', 'Pampers'];

    useEffect(() => {
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';
        setFilters(prev => ({ ...prev, category, search }));
    }, [searchParams]);

    // Initial Fetch - Runs ONCE
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter Logic - Runs when filters or data change
    useEffect(() => {
        let data = [...allProducts];

        // Apply filters
        if (filters.category) {
            data = data.filter(p => p.category === filters.category);
        }
        if (filters.search) {
            data = data.filter(p =>
                p.ProductName.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        if (filters.brand.length > 0) {
            data = data.filter(p => filters.brand.includes(p.brand));
        }
        if (filters.inStock) {
            data = data.filter(p => Number(p.Stock) > 0);
        }

        // Apply sorting
        if (filters.sort === 'price_asc') {
            data.sort((a, b) => Number(a.Price) - Number(b.Price));
        } else if (filters.sort === 'price_desc') {
            data.sort((a, b) => Number(b.Price) - Number(a.Price));
        }

        setProducts(data);
    }, [filters, allProducts]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/products');
            const data = await res.json();
            setAllProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setAllProducts([]);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleMultiSelect = (key: 'brand', value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(v => v !== value)
                : [...prev[key], value]
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            search: '',
            brand: [],
            inStock: false,
            sort: 'newest',
        });
        router.push('/products');
    };

    return (
        <div className="products-page">
            <div className="products-layout">
                {/* Mobile Filter Toggle */}
                <button
                    className="mobile-filter-toggle mobile-only"
                    onClick={() => setShowMobileFilters(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    Filters
                </button>

                {/* Desktop Sidebar */}
                <aside className="filters-sidebar desktop-only">
                    <div className="filters-header">
                        <h3>Filters</h3>
                        <button onClick={clearFilters} className="clear-filters-btn">Clear All</button>
                    </div>
                    <FilterContent
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                        handleMultiSelect={handleMultiSelect}
                        brands={BRANDS}
                    />
                </aside>

                {/* Mobile Filter Modal */}
                {showMobileFilters && (
                    <div className="mobile-filters-modal">
                        <div className="filters-header" style={{ padding: '20px' }}>
                            <h3>Filters</h3>
                            <button
                                className="close-filters-mobile"
                                onClick={() => setShowMobileFilters(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="mobile-filters-content">
                            <div className="filters-header">
                                <button onClick={clearFilters} className="clear-filters-btn">Clear All</button>
                            </div>
                            <FilterContent
                                filters={filters}
                                handleFilterChange={handleFilterChange}
                                handleMultiSelect={handleMultiSelect}
                                brands={BRANDS}
                            />
                            <button
                                className="mobile-filter-toggle"
                                style={{ marginTop: '20px', backgroundColor: '#0071e3', color: 'white', border: 'none' }}
                                onClick={() => setShowMobileFilters(false)}
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="products-content">
                    <div className="products-header">
                        <h1>{filters.category ? `${filters.category} Products` : 'All Products'}</h1>
                        <div className="products-controls">
                            {/* Mobile Search - shown only on mobile */}
                            <input
                                type="text"
                                className="mobile-search-input mobile-only"
                                placeholder="Search..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                            <select
                                className="sort-select"
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : !Array.isArray(products) || products.length === 0 ? (
                        <div className="no-products">
                            <p>No products found. Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-4" style={{ gap: '24px' }}>
                            {products.map((product) => (
                                <ProductCard key={product.ProductID} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

const FilterContent = ({ filters, handleFilterChange, handleMultiSelect, brands }: any) => (
    <>
        {/* Search */}
        <div className="filter-group">
            <h4>SEARCH</h4>
            <input
                type="text"
                className="form-input"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={{ border: '1px solid #d2d2d7', borderRadius: '12px', padding: '10px 12px', width: '100%' }}
            />
        </div>

        {/* Brand Filter */}
        <div className="filter-group">
            <h4>BRAND</h4>
            {brands.map((brand: string) => (
                <label key={brand} className="filter-option">
                    <input
                        type="checkbox"
                        checked={filters.brand.includes(brand)}
                        onChange={() => handleMultiSelect('brand', brand)}
                    />
                    {brand}
                </label>
            ))}
        </div>

        {/* In Stock Toggle */}
        <div className="filter-group checkbox-group">
            <label className="filter-option">
                <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                />
                In Stock Only
            </label>
        </div>
    </>
);

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
