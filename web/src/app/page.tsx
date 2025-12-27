"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import "./Home.css";
import { useScrollAnimationObserver } from '@/hooks/useScrollAnimation';
// Icons
import {
  Package,
  HeartHandshake,
  FastForward,
  Sparkles,
  Star,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface Product {
  ProductID: string;
  ProductName: string;
  Price: string | number;
  Stock: string | number;
  ImageURL?: string;
  category?: string; // Optional if not in sheet
}

const Home = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Size Calculator State
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [weight, setWeight] = useState('');
  const [sizeResult, setSizeResult] = useState<string | null>(null);

  // Enable scroll animations
  useScrollAnimationObserver();

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        // Fetch from Next.js API
        const response = await fetch('/api/products');
        const products = await response.json();

        if (Array.isArray(products) && products.length > 0) {
          setNewArrivals(products.slice(0, 4));
          setBestSellers(products.slice(4, 7));
        }
      } catch (error) {
        console.error("Failed to fetch products for home page", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const calculateSize = () => {
    const w = parseFloat(weight);
    if (!w || isNaN(w)) return;

    if (w <= 4) setSizeResult('Newborn');
    else if (w <= 8) setSizeResult('Small');
    else if (w <= 11) setSizeResult('Medium');
    else if (w <= 14) setSizeResult('Large');
    else if (w <= 17) setSizeResult('XL');
    else setSizeResult('XXL');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    if (sizeResult) setSizeResult(null);
  };

  // No blocking loader - page shows immediately

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-aurora-1"></div>
        <div className="hero-aurora-2"></div>

        <div className="hero-container-split">
          <div className="hero-content-left">
            <h1 className="hero-headline-large">
              Nappy Garde
            </h1>
            <p className="hero-subtext-large">
              Premium Diapers & Baby Care.
            </p>

            <div className="hero-actions-left">
              <Link href="/products" className="btn btn-primary btn-xl btn-blue">
                Shop All Essentials
              </Link>
              <button
                onClick={() => setShowSizeModal(true)}
                className="btn btn-primary btn-xl btn-red"
              >
                Find Size Guide
              </button>
            </div>

            <div className="hero-badges-row">
              <div className="badge-pill"><FastForward size={14} /> Fast Delivery</div>
              <div className="badge-pill"><ShieldCheck size={14} /> Authentic Brands</div>
              <div className="badge-pill"><Sparkles size={14} /> Premium Quality</div>
            </div>
          </div>

          {/* Right: Visuals - Hidden on mobile via CSS */}
          <div className="hero-visuals-right">
            <div className="hero-main-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2787&auto=format&fit=crop"
                alt="Happy Baby"
                className="hero-main-image"
              />
              <img
                src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop"
                alt="Baby Products"
                className="hero-collage-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. New Arrivals */}
      <section className="section-container">
        <h2 className="section-headline">New Arrivals for Your Baby</h2>
        <div className="products-grid bestsellers-grid">
          {loading ? (
            <div className="products-loading">Loading products...</div>
          ) : newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <div key={product.ProductID} className="product-card-wrapper">
                <ProductCard product={product} />
              </div>
            ))
          ) : null}
        </div>
      </section>

      {/* 3. Best Sellers */}
      <section className="section-container bestsellers-section">
        <h2 className="section-headline">What Parents Are Loving</h2>
        <div className="products-grid bestsellers-grid">
          {loading ? (
            <div className="products-loading">Loading products...</div>
          ) : bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <div key={product.ProductID} className="product-card-wrapper">
                <ProductCard product={product} />
              </div>
            ))
          ) : null}
        </div>
      </section>

      {/* 5. Shop by Baby Stage */}
      <section className="section-container shop-by-stage">
        <h2 className="section-headline text-3xl font-bold mb-8 text-center">Find the Perfect Fit</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Newborn', 'Infant', 'Toddler'].map((stage, idx) => (
            <Link href={`/products?category=${stage}`} key={stage} className="stage-card">
              <div className="stage-bg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-${idx === 0 ? '1544126592-807ade215a0b' : idx === 1 ? '1519689680058-324335c77eba' : '1519340241574-2cec6aef0c01'}?auto=format&fit=crop&w=800&q=80')` }}>
              </div>
              <div className="stage-overlay"></div>
              <div className="stage-content">
                <div className="stage-title">{stage} Care</div>
                <div className="stage-subtitle">Essentials</div>
              </div>
            </Link>
          ))}
        </div>
      </section >

      {/* 6. Why Choose Nappy Garde */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <h2 className="why-choose-title">Why Parents Trust Nappy Garde</h2>
          <p className="why-choose-subtitle">Quality you can count on, every time.</p>

          <div className="why-choose-grid">
            <div className="why-card">
              <div className="why-icon">
                <ShieldCheck size={32} />
              </div>
              <h3 className="why-card-title">100% Authentic</h3>
              <p className="why-card-text">Every product is sourced directly from authorized distributors.</p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <FastForward size={32} />
              </div>
              <h3 className="why-card-title">Same Day Delivery</h3>
              <p className="why-card-text">Order before 2 PM and receive your essentials the same day.</p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <HeartHandshake size={32} />
              </div>
              <h3 className="why-card-title">Expert Support</h3>
              <p className="why-card-text">Our team of parents is here to help you choose the right products.</p>
            </div>
          </div>

          <div className="why-cta">
            <Link href="/products" className="why-cta-btn">
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Parent Reviews Marquee */}
      <section className="section-container reviews-section">
        <h2 className="section-headline" style={{ textAlign: 'center' }}>Loved by Parents Like You</h2>
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {/* Original Set */}
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Super fast delivery! I ordered in the morning and got it by evening. Lifesaver for busy moms."</p>
              <p className="review-author">Sarah, Colombo</p>
            </div>
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Love the variety. I can buy different brands for day and night in one go. Excellent service from Nappy Garde."</p>
              <p className="review-author">Mike, Kandy</p>
            </div>
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Genuine products at the best prices. Nappy Garde is my go-to for all baby essentials."</p>
              <p className="review-author">Emily, Galle</p>
            </div>
            {/* Duplicated for seamless loop */}
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Super fast delivery! I ordered in the morning and got it by evening. Lifesaver for busy moms."</p>
              <p className="review-author">Sarah, Colombo</p>
            </div>
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Love the variety. I can buy different brands for day and night in one go. Excellent service from Nappy Garde."</p>
              <p className="review-author">Mike, Kandy</p>
            </div>
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Genuine products at the best prices. Nappy Garde is my go-to for all baby essentials."</p>
              <p className="review-author">Emily, Galle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Size Calculator Modal */}
      {
        showSizeModal && (
          <div className="modal-overlay" onClick={() => setShowSizeModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setShowSizeModal(false)}>
                <X size={24} />
              </button>

              <h3 className="modal-title">Find Your Perfect Fit</h3>
              <p className="modal-subtitle">Enter your baby's weight.</p>

              <div className="modal-form-group">
                <label className="modal-label">Baby's Weight (kg)</label>
                <input
                  type="number"
                  className="modal-input"
                  placeholder="e.g. 5"
                  value={weight}
                  onChange={handleInput}
                  onKeyDown={e => e.key === 'Enter' && calculateSize()}
                />
              </div>

              <button className="modal-submit-btn" onClick={calculateSize}>
                Find Size
              </button>

              {sizeResult && (
                <div className="modal-result">
                  <div>
                    <span className="modal-result-label">RECOMMENDED</span>
                    <span className="modal-result-size">{sizeResult}</span>
                  </div>
                  <Link
                    href={`/products?size=${sizeResult}`}
                    className="modal-result-link"
                    onClick={() => setShowSizeModal(false)}
                  >
                    Shop Now <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Home;
