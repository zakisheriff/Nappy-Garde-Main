"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import './Products.css'; // Ensure this CSS path is correct or moved to global modules

// Component wrapper for Suspense
function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial Filter State
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        search: searchParams.get('search') || '',
        brand: [] as string[],
        size: [] as string[],
        type: [] as string[],
        minPrice: '',
        maxPrice: '',
        minPieces: '',
        maxPieces: '',
        inStock: false,
        sort: 'newest',
    });

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const BRANDS = ['Marvel', 'Global II', 'Velona Cuddles', 'Pampers'];
    // Mock category filters logic (simplified for file length, copying core logic)
    const CATEGORY_FILTERS: any = {
        'Diapers': { showBrand: true, showSize: true, showType: true, showPrice: true, showPieces: true, sizes: ['Newborn', 'Small', 'Medium', 'Large', 'XL', 'XXL'], types: ['Tape', 'Pants'] },
        'Wipes': { showBrand: true, showSize: true, showType: true, showPrice: true, showPieces: true },
        // Add others as needed or default fallback
        'default': { showBrand: true, showSize: true, showType: true, showPrice: true, showPieces: true, sizes: ['Newborn', 'Small', 'Medium', 'Large', 'XL', 'XXL'], types: ['Tape', 'Pants'] }
    };

    const currentCategoryConfig = CATEGORY_FILTERS[filters.category] || CATEGORY_FILTERS['default'];
    const availableSizes = currentCategoryConfig.sizes || [];
    const availableTypes = currentCategoryConfig.types || [];

    // Fetch All Products ONCE
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAllProducts(data);
                }
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Update filters when URL params change
    useEffect(() => {
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';

        setFilters(prev => {
            if (prev.category !== category) return { ...prev, category, search, size: [], type: [] }; // Reset sub-filters
            if (prev.search !== search) return { ...prev, search };
            return prev;
        });
    }, [searchParams]);

    // Apply Filters Locally
    useEffect(() => {
        if (!allProducts.length) return;

        let result = [...allProducts];

        // Filter: Category (Exact or Partial match? Logic implies exact usually, but sheet might have mapped names)
        // We assume sheet has 'Description' or we rely on explicit 'Category' column if added. 
        // Instructions said: ProductID, ProductName, Price, Stock, Description, ImageURL.
        // We might need to guess category from Description or Name if column missing.
        // Or assume user added 'Category' column as per "Update products... without touching code".
        // I'll check property existence.
        if (filters.category) {
            result = result.filter(p =>
                (p.category && p.category === filters.category) ||
                (p.Description && p.Description.includes(filters.category)) ||
                (p.ProductName && p.ProductName.includes(filters.category)) // Fallback
            );
        }

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(p => p.ProductName.toLowerCase().includes(q) || (p.Description && p.Description.toLowerCase().includes(q)));
        }

        if (filters.brand.length > 0) {
            // Basic brand detection
            result = result.filter(p => filters.brand.some(b => p.ProductName.includes(b) || (p.Description && p.Description.includes(b))));
        }

        if (filters.inStock) {
            result = result.filter(p => Number(p.Stock) > 0);
        }

        // Sorting
        if (filters.sort === 'price_asc') result.sort((a, b) => Number(a.Price) - Number(b.Price));
        if (filters.sort === 'price_desc') result.sort((a, b) => Number(b.Price) - Number(a.Price));
        // Newest logic requires Date field, if not present ignore or reverse id
        if (filters.sort === 'newest') result.reverse();

        setFilteredProducts(result);

    }, [filters, allProducts]);


    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        // Also update URL if category/search changes? 
        // Not strictly needed for client filter but good UX.
    };

    const handleMultiSelect = (key: 'brand' | 'size' | 'type', value: string) => {
        setFilters(prev => {
            const current = prev[key];
            const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
            return { ...prev, [key]: updated };
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
        router.push('/products');
        setShowMobileFilters(false);
    };

    // ... (Use same JSX structure from legacy, adapted)

    // Helper for Filters UI to reduce code duplication
    const FilterUI = () => (
        <div className="space-y-6">
            <div className="filter-group">
                <h4 className="font-bold mb-2">Search</h4>
                <input type="text" className="w-full border p-2 rounded" placeholder="Search..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
            </div>
            {/* Brands */}
            <div className="filter-group">
                <h4 className="font-bold mb-2">Brand</h4>
                {BRANDS.map(b => (
                    <label key={b} className="flex items-center space-x-2 block mb-1">
                        <input type="checkbox" checked={filters.brand.includes(b)} onChange={() => handleMultiSelect('brand', b)} />
                        <span>{b}</span>
                    </label>
                ))}
            </div>
            {/* In Stock */}
            <label className="flex items-center space-x-2">
                <input type="checkbox" checked={filters.inStock} onChange={e => handleFilterChange('inStock', e.target.checked)} />
                <span>In Stock Only</span>
            </label>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-16 px-4 md:px-8 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{filters.category ? `${filters.category}` : 'All Products'}</h1>
                        <select value={filters.sort} onChange={e => handleFilterChange('sort', e.target.value)} className="border-none bg-white shadow-sm p-3 rounded-xl min-w-[180px] text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="newest">Newest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Mobile Show Filters Button - Below heading */}
                    <button
                        className="w-full md:hidden bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-xl mb-6 font-semibold shadow-lg active:scale-[0.98] transition-transform"
                        style={{ color: '#ffffff' }}
                        onClick={() => setShowMobileFilters(true)}
                    >
                        Show Filters
                    </button>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Desktop Sidebar - Hidden on Mobile */}
                        <aside className="hidden md:block w-64 flex-shrink-0 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-20">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl">Filters</h3>
                                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear All</button>
                            </div>
                            <FilterUI />
                        </aside>

                        {/* Mobile Modal - Only shows when button clicked */}
                        {showMobileFilters && (
                            <div className="fixed inset-0 z-[100] bg-white overflow-y-auto md:hidden">
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                                    <h3 className="font-bold text-2xl">Filters</h3>
                                    <button onClick={() => setShowMobileFilters(false)} className="text-3xl text-gray-600 w-10 h-10 flex items-center justify-center">&times;</button>
                                </div>
                                <div className="p-4">
                                    <FilterUI />
                                </div>
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                                    <button onClick={() => setShowMobileFilters(false)} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-4 rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-transform" style={{ color: '#ffffff' }}>
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        <main className="flex-1 min-w-0">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredProducts.map(p => (
                                        <ProductCard key={p.ProductID} product={p} />
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm">
                                            <p className="text-gray-500 text-lg mb-4">No products found.</p>
                                            <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 font-semibold">Clear Filters</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
