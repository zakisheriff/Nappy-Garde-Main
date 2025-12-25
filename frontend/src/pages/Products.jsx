import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api/api';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        search: searchParams.get('search') || '',
        brand: [],
        size: [],
        type: [],
        minPrice: '',
        maxPrice: '',
        minPieces: '',
        maxPieces: '',
        inStock: false,
        sort: 'newest',
    });

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const BRANDS = ['Marvel', 'Global II', 'Velona Cuddles', 'Pampers'];
    const CATEGORY_FILTERS = {
        'Diapers': {
            showBrand: true,
            showSize: true,
            showType: true,
            showPrice: true,
            showPieces: true,
            sizes: ['Newborn', 'Small', 'Medium', 'Large', 'XL', 'XXL'],
            types: ['Tape', 'Pants']
        },
        'Wipes': {
            showBrand: true,
            showSize: true, // "Pack of 3" etc
            showType: true, // "Sensitive" etc
            showPrice: true,
            showPieces: true // "100" wipes
        },
        'Clothing': {
            showBrand: true,
            showSize: true,
            showType: true,
            showPrice: true,
            showPieces: false,
            sizes: ['Newborn', '0-3M', '3-6M', '6-12M', '12-18M', '18-24M', 'Small', 'Medium', 'Large'],
            types: ['Bodysuit', 'Set', 'Accessory']
        },
        'Toys': {
            showBrand: true,
            showSize: false,
            showType: true,
            showPrice: true,
            showPieces: false,
            types: ['Rattle', 'Plush', 'Educational', 'Teether']
        },
        'Health': {
            showBrand: true,
            showSize: false,
            showType: true,
            showPrice: true,
            showPieces: false,
            types: ['Thermometer', 'Grooming', 'Monitor']
        },
        'Skincare': {
            showBrand: true,
            showSize: true, // "200ml"
            showType: true, // "Lotion"
            showPrice: true,
            showPieces: false
        },
        // Fallback for empty or unknown category (e.g. "All Products")
        'default': {
            showBrand: true,
            showSize: true,
            showType: true,
            showPrice: true,
            showPieces: true,
            sizes: ['Newborn', 'Small', 'Medium', 'Large', 'XL', 'XXL'], // Default to diaper sizes as they are main product
            types: ['Tape', 'Pants']
        }
    };

    const currentCategoryConfig = CATEGORY_FILTERS[filters.category] || CATEGORY_FILTERS['default'];

    // If we have custom sizes/types for the category, use them, otherwise use generic or empty
    const availableSizes = currentCategoryConfig.sizes || [];
    const availableTypes = currentCategoryConfig.types || [];


    useEffect(() => {
        // Sync filters with URL params when they change
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';

        setFilters(prev => {
            // Reset sub-filters if switching categories to avoid invalid states
            // e.g. switching from Diapers (Size: Small) to Toys (Size: N/A) -> Clean Size
            if (prev.category !== category) {
                return {
                    ...prev,
                    category,
                    search,
                    size: [],
                    type: []
                };
            }

            if (prev.search !== search) {
                return {
                    ...prev,
                    search
                };
            }
            return prev;
        });
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};

            if (filters.category) params.category = filters.category;
            if (filters.search) params.search = filters.search;
            if (filters.brand.length > 0) params.brand = filters.brand.join(',');
            if (filters.size.length > 0) params.size = filters.size.join(',');
            if (filters.type.length > 0) params.type = filters.type.join(',');
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.minPieces) params.minPieces = filters.minPieces;
            if (filters.maxPieces) params.maxPieces = filters.maxPieces;
            if (filters.inStock) params.inStock = 'true';
            if (filters.sort) params.sort = filters.sort;

            const response = await api.get('/products', { params });
            // The backend returns { products: [] }
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]); // Ensure products is always an array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        // Debounce could be added here for search/inputs
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleMultiSelect = (key, value) => {
        setFilters(prev => {
            const current = prev[key];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return {
                ...prev,
                [key]: updated
            };
        });
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            search: '',
            brand: [],
            size: [],
            type: [],
            minPrice: '',
            maxPrice: '',
            minPieces: '',
            maxPieces: '',
            inStock: false,
            sort: 'newest',
        });
        setSearchParams({});
        setShowMobileFilters(false);
    };

    // Reusable Filter Content
    const FilterContent = () => (
        <>
            {/* Search */}
            <div className="filter-group">
                <h4>Search</h4>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                />
            </div>

            {/* Brand Filter */}
            {currentCategoryConfig.showBrand && (
                <div className="filter-group">
                    <h4>Brand</h4>
                    {BRANDS.map(brand => (
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
            )}

            {/* Size Filter */}
            {currentCategoryConfig.showSize && availableSizes.length > 0 && (
                <div className="filter-group">
                    <h4>Size</h4>
                    {availableSizes.map(size => (
                        <label key={size} className="filter-option">
                            <input
                                type="checkbox"
                                checked={filters.size.includes(size)}
                                onChange={() => handleMultiSelect('size', size)}
                            />
                            {size}
                        </label>
                    ))}
                </div>
            )}

            {/* Type Filter */}
            {currentCategoryConfig.showType && availableTypes.length > 0 && (
                <div className="filter-group">
                    <h4>Type</h4>
                    {availableTypes.map(type => (
                        <label key={type} className="filter-option">
                            <input
                                type="checkbox"
                                checked={filters.type.includes(type)}
                                onChange={() => handleMultiSelect('type', type)}
                            />
                            {type}
                        </label>
                    ))}
                </div>
            )}

            {/* Price Range */}
            {currentCategoryConfig.showPrice && (
                <div className="filter-group">
                    <h4>Price Range</h4>
                    <div className="price-inputs">
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Pack Size (Pieces) */}
            {currentCategoryConfig.showPieces && (
                <div className="filter-group">
                    <h4>Pack Size (Pieces)</h4>
                    <div className="price-inputs">
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Min"
                            value={filters.minPieces}
                            onChange={(e) => handleFilterChange('minPieces', e.target.value)}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Max"
                            value={filters.maxPieces}
                            onChange={(e) => handleFilterChange('maxPieces', e.target.value)}
                        />
                    </div>
                </div>
            )}

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
                    <FilterContent />
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
                            <FilterContent />
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
                            <select
                                className="sort-select"
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                style={{ width: 'auto', minWidth: '160px' }}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="pieces_asc">Pieces: Low to High</option>
                                <option value="pieces_desc">Pieces: High to Low</option>
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
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;
