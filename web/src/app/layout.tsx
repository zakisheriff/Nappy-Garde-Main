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
  applicationName: 'Nappy Garde',
  appleWebApp: {
    capable: true,
    title: 'Nappy Garde',
    statusBarStyle: 'default',
  },
  title: {
    default: "Nappy Garde",
    template: "%s | Nappy Garde"
  },
  description: "Nappy Garde offers Premium Baby Diapers, Pants, Wipes, and Skincare Products in Sri Lanka. Ultra-soft Comfort, Superior Absorption, and Island-Wide Delivery.",
  keywords: ["Nappy Garde", "nappy garde", "Nappy Garde LK", "Nappy Garde Website", "Marvel Diapers", "Pampers Shop", "baby diapers", "baby pants", "wet wipes", "sensitive skin diapers", "baby care Sri Lanka", "diaper delivery Colombo"],
  authors: [{ name: "Nappy Garde" }],
  creator: "Nappy Garde",
  publisher: "Nappy Garde",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  manifest: '/site.webmanifest',
  openGraph: {
    title: "Nappy Garde",
    description: "Premium Comfort for Your Little One. Shop Nappy Garde's Range of Ultra-Soft Diapers, Wipes, and Baby Care Essentials. Island-wide Delivery in Sri Lanka.",
    url: 'https://nappygarde.lk',
    siteName: 'Nappy Garde',
    images: [
      {
        url: '/new_logo.png',
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
    description: "Premium Comfort for Your Little One. Shop Nappy Garde's Range of Ultra-Soft Diapers, Wipes, and Baby Care Essentials.",
    images: ['/new_logo.png'],
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
        "url": "https://nappygarde.lk/new_logo.png",
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
      "alternateName": ["Nappy Garde Sri Lanka", "NappyGarde", "nappygarde.lk"],
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
