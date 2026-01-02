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
          setBestSellers(products.slice(4, 8));
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
    else if (w <= 17) setSizeResult('XXL');
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
        <div className="aurora-gold-1"></div>
        <div className="aurora-gold-2"></div>

        <div className="hero-container-split">
          <div className="hero-content-left">
            <h1 className="hero-headline-large">
              Nappy Garde
            </h1>
            <p className="hero-subtext-large">
              Start 2026 with premium care for your little one. <br className="hidden md:block" />
              Celebrate with our exclusive New Year collection.
            </p>

            <div className="hero-actions-left">
              <Link href="/products" className="btn btn-primary btn-xl btn-gold">
                Shop 2026 Essentials
              </Link>
              <a
                href="tel:0777798788"
                className="btn btn-xl btn-glass-gold"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Right: Visuals - Hidden on mobile via CSS */}
          <div className="hero-visuals-right">
            <div className="hero-main-image-wrapper">
              <img
                src="/images/ny_hero.png"
                alt="Happy Baby New Year 2026"
                className="hero-main-image"
              />
              <img
                src="/images/ny_collage.jpg"
                alt="New Year Collection"
                className="hero-collage-img"
              />
              {/* Floating Brand Pills */}
              <div className="brand-pill pill-marvel">Marvel</div>
              <div className="brand-pill pill-velona">Velona</div>
              <div className="brand-pill pill-pampers">Pampers</div>
              <div className="brand-pill pill-global">Global II</div>
              <div className="brand-pill pill-lody">Lody Baby</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. New Arrivals */}
      <section className="section-container new-arrivals-clean">
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
      <section className="section-container bestsellers-clean">
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


      {/* 6. Why Choose Nappy Garde */}
      <section className="why-choose-clean">
        <div className="why-choose-container">
          <h2 className="why-choose-title">Why Parents Trust Nappy Garde</h2>
          <p className="why-choose-subtitle">Quality you can count on, every time.</p>

          <div className="why-choose-grid">
            <div className="why-card">
              <div className="why-icon icon-red">
                <ShieldCheck size={32} />
              </div>
              <h3 className="why-card-title">100% Authentic</h3>
              <p className="why-card-text">Every product is sourced directly from authorized distributors.</p>
            </div>

            <div className="why-card">
              <div className="why-icon icon-black">
                <FastForward size={32} />
              </div>
              <h3 className="why-card-title">Same Day Delivery</h3>
              <p className="why-card-text">Order before 10 AM and receive your essentials the same day.</p>
            </div>

            <div className="why-card">
              <div className="why-icon icon-blue">
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
      <section className="reviews-clean">
        <h2 className="section-headline" style={{ textAlign: 'center' }}>Loved by Parents Like You</h2>
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {/* Original Set */}
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Super fast delivery! I ordered in the morning and got it by evening. Lifesaver for busy moms."</p>
              <p className="review-author"><span className="review-author-name">Sarah,</span> <span className="review-author-location">Colombo</span></p>
            </div>
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Love the variety. I can buy different brands for day and night in one go. Excellent service from Nappy Garde."</p>
              <p className="review-author"><span className="review-author-name">Rizlan,</span> <span className="review-author-location">Kandy</span></p>
            </div>
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Genuine products at the best prices. Nappy Garde is my go-to for all baby essentials."</p>
              <p className="review-author"><span className="review-author-name">Emily,</span> <span className="review-author-location">Galle</span></p>
            </div>
            {/* Duplicated for seamless loop */}
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Super fast delivery! I ordered in the morning and got it by evening. Lifesaver for busy moms."</p>
              <p className="review-author"><span className="review-author-name">Sarah,</span> <span className="review-author-location">Colombo</span></p>
            </div>
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Love the variety. I can buy different brands for day and night in one go. Excellent service from Nappy Garde."</p>
              <p className="review-author"><span className="review-author-name">Mohammad,</span> <span className="review-author-location">Kandy</span></p>
            </div>
            <div className="review-card">
              <div className="stars">
                <Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" /><Star size={16} fill="#f5a623" stroke="none" />
              </div>
              <p className="review-text">"Genuine products at the best prices. Nappy Garde is my go-to for all baby essentials."</p>
              <p className="review-author"><span className="review-author-name">Perera,</span> <span className="review-author-location">Galle</span></p>
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
