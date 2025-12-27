import type { Metadata } from "next";
import "./globals.css";
import "./focus-fix.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';

import Fireworks from "@/components/Fireworks";

export const metadata: Metadata = {
  title: "Nappy Garde",
  description: "Premium baby diapers and products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Fireworks />
          <Navbar />
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
