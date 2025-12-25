"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
    const { cartItems, total, updateQuantity, removeFromCart, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="mb-8 text-gray-500">Looks like you haven't added anything yet.</p>
                <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="lg:w-2/3 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.ProductID} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <img src={item.ImageURL || 'https://via.placeholder.com/100'} alt={item.ProductName} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                                <h3 className="font-bold">{item.ProductName}</h3>
                                <p className="text-gray-600">LKR {Number(item.Price).toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={() => updateQuantity(item.ProductID, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-700 disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                                <span className="font-semibold w-6 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.ProductID, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-700">+</button>
                            </div>

                            <button onClick={() => removeFromCart(item.ProductID)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}

                    <button onClick={clearCart} className="text-red-500 text-sm hover:underline mt-4">
                        Clear Cart
                    </button>
                </div>

                {/* Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>LKR {total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Shipping</span>
                            <span className="text-green-600">Calculated at Checkout</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-xl mb-6">
                            <span>Total</span>
                            <span>LKR {total.toFixed(2)}</span>
                        </div>

                        <Link href="/checkout" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-full font-bold">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
