"use client";

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h2 className="text-4xl font-bold mb-4 text-[#1d1d1f]">Page Not Found</h2>
            <p className="text-[#6e6e73] mb-8 text-lg">Could not find requested resource</p>
            <Link
                href="/"
                className="px-8 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#FCD34D] hover:shadow-lg transition-all"
            >
                Return Home
            </Link>
        </div>
    );
}
