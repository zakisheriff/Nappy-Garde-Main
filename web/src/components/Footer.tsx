"use client";

import Link from 'next/link';

const Footer = () => {
    return (
        <div className="flex flex-col w-full">

            {/* Footer Section - Dark Background */}
            <footer className="bg-gray-900 text-white w-full mt-0" style={{ padding: '80px 0' }}>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 whitespace-nowrap" style={{ gap: '48px', marginBottom: '64px', textAlign: 'center' }}>
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-1 whitespace-normal flex flex-col items-center">
                            <h3 className="text-xl font-bold mb-4 !text-white text-center">Nappy Garde</h3>
                        </div>

                        {/* Shop */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                            <h4 className="font-semibold text-lg !text-white" style={{ marginBottom: '8px' }}>Shop</h4>
                            <ul className="text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
                                <li><Link href="/products?category=Diapers" className="text-gray-400 hover:text-white transition-colors">Diapers & Pants</Link></li>
                                <li><Link href="/products?category=Wipes" className="text-gray-400 hover:text-white transition-colors">Wet Wipes</Link></li>
                                <li><Link href="/products?category=Skincare" className="text-gray-400 hover:text-white transition-colors">Skincare</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                            <h4 className="font-semibold text-lg !text-white" style={{ marginBottom: '8px' }}>Support</h4>
                            <ul className="text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                            <h4 className="font-semibold text-lg !text-white" style={{ marginBottom: '8px' }}>Quick Links</h4>
                            <ul className="text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                                <li><Link href="/cart" className="text-gray-400 hover:text-white transition-colors">Shopping Cart</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div  style={{marginTop: '20px'}}>
                        <p className="text-gray-500 text-sm text-center">
                            © {new Date().getFullYear()} Nappy Garde. All rights reserved.
                        </p>
                        <div className="flex gap-6 justify-center">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Facebook">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Instagram">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
