import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import "./focus-fix.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';

// const inter = Inter({ subsets: ["latin"] });

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
