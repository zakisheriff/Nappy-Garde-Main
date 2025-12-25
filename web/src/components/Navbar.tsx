"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { cartCount } = useCart();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }

        return () => {
            document.body.classList.remove('menu-open');
        };
    }, [mobileMenuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchOpen(false);
            setMobileMenuOpen(false);
        }
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`navbar ${mobileMenuOpen ? 'menu-open' : ''} ${searchOpen ? 'search-active' : ''}`} role="navigation" aria-label="Main navigation">
                <div className="navbar-container h-[72px] px-8 max-w-[1440px] mx-auto flex items-center justify-between">
                    {/* Default Navbar Content (Hidden when search is open) */}
                    <div className={`nav-content-wrapper ${searchOpen ? 'search-mode-hidden' : ''}`}>
                        {/* Logo */}
                        <Link href="/" className="navbar-logo search-hide" onClick={closeMobileMenu}>
                            <span className="logo-text">Nappy Garde</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="navbar-links search-hide flex gap-12 items-center justify-center flex-1">
                            <Link href="/" className="nav-link text-sm font-medium">Home</Link>
                            <Link href="/products?category=Diapers" className="nav-link text-sm font-medium">Diapers & Pants</Link>
                            <Link href="/products?category=Wipes" className="nav-link text-sm font-medium">Wet Wipes</Link>
                            <Link href="/products?category=Skincare" className="nav-link text-sm font-medium">Bath & Skincare</Link>
                            <Link href="/products?category=Clothing" className="nav-link text-sm font-medium">Clothing</Link>
                            <Link href="/products?category=Toys" className="nav-link text-sm font-medium">Toys</Link>
                            <Link href="/products?category=Health" className="nav-link text-sm font-medium">Health</Link>
                        </div>

                        {/* Right Side Actions */}
                        <div className="navbar-actions flex gap-7 items-center z-[10000]" style={{ gap: '28px' }}>
                            {/* Cart */}
                            <Link href="/cart" className="nav-icon-btn cart-btn" aria-label={`Shopping cart with ${cartCount} items`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>

                            {/* Hamburger Menu Toggle */}
                            <button
                                className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                                aria-expanded={mobileMenuOpen}
                            >
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                            </button>
                        </div>
                    </div>

                    {/* Inline Search Bar (Visible when search is open) */}
                    <div className={`inline-search-container ${searchOpen ? 'active' : ''}`}>
                        <button
                            className="search-icon-static"
                            aria-hidden="true"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                        <form onSubmit={handleSearch} className="inline-search-form">
                            <input
                                type="text"
                                className="inline-search-input"
                                placeholder="Search Nappy Garde"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus={searchOpen}
                            />
                        </form>
                        <button
                            className="search-close-btn"
                            onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery('');
                            }}
                            aria-label="Close search"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                </div>
            </nav>

            {/* Mobile Menu Backdrop */}
            <div
                className={`mobile-menu-backdrop ${mobileMenuOpen ? 'active' : ''}`}
                onClick={closeMobileMenu}
                aria-hidden="true"
            />

            {/* Mobile Menu - Slides down from top */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-content">
                    {/* Navigation Links */}
                    <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
                        <Link href="/" className="mobile-link" onClick={closeMobileMenu}>
                            Home
                        </Link>
                        <Link href="/products?category=Diapers" className="mobile-link" onClick={closeMobileMenu}>
                            Diapers & Pants
                        </Link>
                        <Link href="/products?category=Wipes" className="mobile-link" onClick={closeMobileMenu}>
                            Wet Wipes
                        </Link>
                        <Link href="/products?category=Skincare" className="mobile-link" onClick={closeMobileMenu}>
                            Bath & Skincare
                        </Link>
                        <Link href="/products?category=Clothing" className="mobile-link" onClick={closeMobileMenu}>
                            Clothing
                        </Link>
                        <Link href="/products?category=Toys" className="mobile-link" onClick={closeMobileMenu}>
                            Toys & Gear
                        </Link>
                        <Link href="/products?category=Health" className="mobile-link" onClick={closeMobileMenu}>
                            Health & Safety
                        </Link>
                        <Link href="/cart" className="mobile-link" onClick={closeMobileMenu}>
                            Cart {cartCount > 0 && `(${cartCount})`}
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Navbar;
