"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cartItems, total, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    if (cartItems.length === 0) {
        return <div className="p-8 text-center">Cart is empty. Redirecting...</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Save to Google Sheet via API
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: formData,
                    items: cartItems,
                    total: total,
                }),
            });

            const orderData = await orderRes.json();

            if (orderData.success) {
                // 2. Clear Cart
                // Store order details loosely for success page if needed, but we go straight to WhatsApp
                // 3. Construct WhatsApp Message
                const itemsList = cartItems.map(i => `- ${i.ProductName} (x${i.quantity})`).join('%0a');
                const message = `*New Order: ${orderData.orderId}*%0a%0a*Customer:* ${formData.name}%0a*Phone:* ${formData.phone}%0a*Address:* ${formData.address}%0a%0a*Items:*%0a${itemsList}%0a%0a*Total:* LKR ${total.toFixed(2)}%0a%0aPlease confirm my order.`;

                // Replace with shop's phone number
                const shopPhone = '94758760367'; // Nappy Garde WhatsApp
                const whatsappUrl = `https://wa.me/${shopPhone}?text=${message}`;

                clearCart();
                window.location.href = whatsappUrl; // Redirect to WhatsApp
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Full Name</label>
                        <input required name="name" type="text" className="w-full border p-3 rounded-lg" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Phone Number</label>
                        <input required name="phone" type="tel" className="w-full border p-3 rounded-lg" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Delivery Address</label>
                        <textarea required name="address" rows={3} className="w-full border p-3 rounded-lg" value={formData.address} onChange={handleChange} />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold mb-2">Order Summary</h3>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>LKR {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg disabled:opacity-70">
                        {loading ? 'Processing...' : 'Place Order on WhatsApp'}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-2">
                        Clicking place order will save your order and open WhatsApp to send the details to us.
                    </p>
                </form>
            </div>
        </div>
    );
}
