import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch cart from backend when authenticated
    const fetchCart = async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            setTotal(0);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/cart');
            setCartItems(response.data.cart_items || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Fetch cart error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            // handled by component
            return { success: false, error: 'Not authenticated' };
        }

        try {
            await api.post('/cart', { product_id: productId, quantity });
            await fetchCart(); // Refresh cart
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to add to cart',
            };
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        try {
            await api.put(`/cart/${cartItemId}`, { quantity });
            await fetchCart();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update cart',
            };
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await api.delete(`/cart/${cartItemId}`);
            await fetchCart();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to remove item',
            };
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    };

    const value = {
        cartItems,
        total,
        loading,
        cartCount: cartItems.length,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
