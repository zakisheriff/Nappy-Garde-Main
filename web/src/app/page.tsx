"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import "./Home.css";
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section hero-split-layout relative overflow-hidden">
        <div className="hero-aurora-1 absolute"></div>
        <div className="hero-aurora-2 absolute"></div>

        <div className="section-container hero-container-split flex flex-col md:flex-row items-center gap-8 py-12 px-4 relative z-10">
          <div className="hero-content-left flex-1 text-center md:text-left">
            <h1 className="hero-headline-large text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Premium Diapers <br />& Baby Care.
            </h1>
            <p className="hero-subtext-large text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">
              <strong>Nappy Garde</strong> is your trusted source for <strong>100% authentic</strong> products.
              <br className="hidden md:block" />Quality care delivered directly to your home.
            </p>

            <div className="hero-actions-left flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/products" className="btn btn-primary btn-xl bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-all" style={{ color: '#ffffff' }}>
                Shop All Essentials
              </Link>
              <button
                onClick={() => setShowSizeModal(true)}
                className="btn btn-primary btn-xl px-8 py-3 rounded-full font-semibold transition-all"
                style={{ background: "rgba(203, 27, 27, 1)", color: '#ffffff' }}
              >
                Find Size Guide
              </button>
            </div>

            <div className="hero-badges-row flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              <div className="badge-pill flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-sm"><FastForward size={14} /> Fast Delivery</div>
              <div className="badge-pill flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-sm"><ShieldCheck size={14} /> Authentic Brands</div>
              <div className="badge-pill flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-sm"><Sparkles size={14} /> Premium Quality</div>
            </div>
          </div>

          {/* Right: Visuals */}
          <div className="hero-visuals-right flex-1 relative hidden md:block">
            <div className="hero-main-image-wrapper relative h-[400px] w-full">
              {/* Images would be next/image ideally, using standard img for external URLs compatibility with legacy */}
              <img
                src="https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2787&auto=format&fit=crop"
                alt="Happy Baby"
                className="hero-main-image w-3/4 h-full object-cover rounded-2xl shadow-2xl absolute right-0 top-0 z-10"
              />
              <div className="hero-collage-img w-1/2 h-1/2 absolute bottom-[-20px] left-0 z-20 rounded-xl overflow-hidden shadow-lg border-4 border-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Baby Products"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. New Arrivals */}
      <section className="section-container container mx-auto px-4 py-12">
        <h2 className="section-headline text-3xl font-bold mb-8">New Arrivals for Your Baby</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.ProductID} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Best Sellers */}
      <section className="section-container container mx-auto px-4 py-12 bg-gray-50 rounded-xl">
        <h2 className="section-headline text-3xl font-bold mb-8 text-black">What Parents Are Loving</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.ProductID} product={product} /> // Reusing ProductCard instead of custom mini card for consistency
          ))}
        </div>
      </section>

      {/* 5. Shop by Baby Stage */}
      <section className="section-container container mx-auto px-4 py-12">
        <h2 className="section-headline text-3xl font-bold mb-8 text-center">Find the Perfect Fit</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Newborn', 'Infant', 'Toddler'].map((stage, idx) => (
            <Link href={`/products?category=${stage}`} key={stage} className="stage-card relative h-64 rounded-xl overflow-hidden group block">
              <div className="stage-bg absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-${idx === 0 ? '1544126592-807ade215a0b' : idx === 1 ? '1519689680058-324335c77eba' : '1519340241574-2cec6aef0c01'}?auto=format&fit=crop&w=800&q=80')` }}>
              </div>
              <div className="stage-overlay absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
              <div className="stage-content absolute bottom-6 left-6 text-white p-4">
                <div className="stage-title text-2xl font-bold">{stage} Care</div>
                <div className="stage-subtitle text-sm opacity-90">Essentials</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 13. Newsletter */}
      <section className="section-container container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Join the Nappy Garde Family</h2>
        <p className="text-gray-400 mb-8 text-lg">Get expert parenting tips and exclusive offers.</p>
        <div className="max-w-md mx-auto flex gap-2">
          <input type="email" placeholder="Email address" className="flex-1 rounded-full border border-gray-600 bg-gray-800 px-6 py-3 text-white focus:outline-none focus:border-blue-500" />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">Sign Up</button>
        </div>
      </section>


      {/* Size Calculator Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowSizeModal(false)}>
          <div className="bg-white text-black rounded-2xl p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-black" onClick={() => setShowSizeModal(false)}>
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-2">Find Your Perfect Fit</h3>
            <p className="text-gray-600 mb-6">Enter your baby's weight.</p>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Baby's Weight (kg)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 5"
                value={weight}
                onChange={handleInput}
                onKeyDown={e => e.key === 'Enter' && calculateSize()}
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold mb-6" onClick={calculateSize}>
              Find Size
            </button>

            {sizeResult && (
              <div className="bg-gray-100 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="block text-xs text-uppercase font-bold text-gray-500">RECOMMENDED</span>
                  <span className="text-xl font-bold text-blue-600">{sizeResult}</span>
                </div>
                <Link
                  href={`/products?size=${sizeResult}`}
                  className="text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                  onClick={() => setShowSizeModal(false)}
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
