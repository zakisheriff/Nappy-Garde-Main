"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Define types for Cart Item
interface CartItem {
    ProductID: string;
    ProductName: string;
    Price: string; // or number, sheet returns strings usually
    ImageURL: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    total: number;
    cartCount: number;
    addToCart: (product: any, quantity?: number) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);

    // Load cart from local storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('nappy_garde_cart');
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('nappy_garde_cart', JSON.stringify(cartItems));
        calculateTotal(cartItems);
    }, [cartItems]);

    const calculateTotal = (items: CartItem[]) => {
        const t = items.reduce((sum, item) => {
            // Helper to parse price string like "$12.99" or "12.99"
            const priceParams = String(item.Price).replace(/[^0-9.]/g, '');
            const price = parseFloat(priceParams) || 0;
            return sum + price * item.quantity;
        }, 0);
        setTotal(t);
    };

    const addToCart = (product: any, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.ProductID === product.ProductID);
            if (existing) {
                return prev.map((item) =>
                    item.ProductID === product.ProductID
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prev, {
                    ProductID: product.ProductID,
                    ProductName: product.ProductName,
                    Price: product.Price,
                    ImageURL: product.ImageURL,
                    quantity
                }];
            }
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.ProductID === productId ? { ...item, quantity } : item
            )
        );
    };

    const removeFromCart = (productId: string) => {
        setCartItems((prev) => prev.filter((item) => item.ProductID !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        total,
        cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
