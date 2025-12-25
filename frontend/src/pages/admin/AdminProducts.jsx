import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Search, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import './AdminDashboard.css'; // Reuse existing styles

const AdminProducts = () => {
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        images: [] // For now handle as array of strings (URLs)
    });
    const [imageInput, setImageInput] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            showToast('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            showToast('Product deleted successfully', 'success');
        } catch (error) {
            showToast('Failed to delete product', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: imageInput ? [imageInput] : (editingProduct ? editingProduct.images : []) // Simple image handling for now
            };

            if (editingProduct) {
                const response = await api.put(`/products/${editingProduct.id}`, payload);
                setProducts(products.map(p => p.id === editingProduct.id ? response.data.product : p));
                showToast('Product updated successfully', 'success');
            } else {
                const response = await api.post('/products', payload);
                setProducts([response.data.product, ...products]);
                showToast('Product created successfully', 'success');
            }
            closeModal();
        } catch (error) {
            console.error('Save error:', error);
            showToast('Failed to save product', 'error');
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
                description: product.description || '',
                images: product.images
            });
            setImageInput(product.images && product.images[0] ? product.images[0] : '');
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: '',
                price: '',
                stock: '',
                description: '',
                images: []
            });
            setImageInput('');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    return (
        <div>
            <header className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Products</h1>
                    <p style={{ color: '#86868b', fontSize: 14, marginTop: 4 }}>Manage your product catalog</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()} style={{ display: 'flex', gap: 8 }}>
                    <Plus size={18} />
                    Add Product
                </button>
            </header>

            {/* Search Bar */}
            <div className="global-search-container mb-24">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="global-search-input"
                />
            </div>

            <div className="content-card">
                <div className="table-responsive">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {product.images && product.images[0] ? (
                                                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <ImageIcon size={20} color="#d2d2d7" />
                                                )}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{product.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="status-badge" style={{ background: '#f5f5f7', color: '#1d1d1f' }}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td>LKR {parseFloat(product.price).toLocaleString()}</td>
                                    <td>
                                        <span style={{ color: product.stock < 10 ? '#ff3b30' : '#1d1d1f', fontWeight: product.stock < 10 ? 600 : 400 }}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => openModal(product)} className="action-btn edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="action-btn delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid-2" style={{ gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (LKR)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid-2" style={{ gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Stock</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={imageInput}
                                        onChange={e => setImageInput(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    rows="3"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
