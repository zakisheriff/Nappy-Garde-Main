import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "./focus-fix.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';

import Fireworks from "@/components/Fireworks";

// Enterprise SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://nappygarde.lk'),
  title: {
    default: "Nappy Garde",
    template: "%s | Nappy Garde"
  },
  description: "Nappy Garde Offers Premium Baby Diapers, Pants, Wipes, and Skincare Products in Sri Lanka. Ultra-soft Comfort, Superior Absorption, and Island-wide Delivery.",
  keywords: ["Nappy Garde", "nappy garde", "Nappy Garde LK", "Nappy Garde Website", "Marvel Diapers", "Pampers Shop", "baby diapers", "baby pants", "wet wipes", "sensitive skin diapers", "baby care Sri Lanka", "diaper delivery Colombo"],
  authors: [{ name: "Nappy Garde" }],
  creator: "Nappy Garde",
  publisher: "Nappy Garde",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/ng_logo.png',
    shortcut: '/ng_logo.png',
    apple: '/ng_logo.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Nappy Garde",
    description: "Premium comfort for your little one. Shop Nappy Garde's range of ultra-soft diapers, wipes, and baby care essentials. Island-wide delivery in Sri Lanka.",
    url: 'https://nappygarde.lk',
    siteName: 'Nappy Garde',
    images: [
      {
        url: '/ng_logo.png',
        width: 1200,
        height: 630,
        alt: 'Nappy Garde - Premium Baby Care',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nappy Garde",
    description: "Premium comfort for your little one. Shop Nappy Garde's range of ultra-soft diapers, wipes, and baby care essentials.",
    images: ['/ng_logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

// JSON-LD Schema for Brand Signals
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://nappygarde.lk/#organization",
      "name": "Nappy Garde",
      "url": "https://nappygarde.lk",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nappygarde.lk/ng_logo.png",
        "width": 112,
        "height": 112
      },
      "sameAs": [
        "https://www.facebook.com/nappygarde",
        "https://www.instagram.com/nappygarde"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+94777798788",
        "contactType": "customer service",
        "areaServed": "LK",
        "availableLanguage": "en"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "231 Wolfendhal St",
        "addressLocality": "Colombo",
        "postalCode": "00130",
        "addressCountry": "LK"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://nappygarde.lk/#website",
      "url": "https://nappygarde.lk",
      "name": "Nappy Garde",
      "description": "Premium Baby Diapers & Care Products",
      "publisher": {
        "@id": "https://nappygarde.lk/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://nappygarde.lk/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <Fireworks />
          <Suspense fallback={<div className="h-20 bg-white shadow-sm" />}>
            <Navbar />
          </Suspense>
          <main className="main-content min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
