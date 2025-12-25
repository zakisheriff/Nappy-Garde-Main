"use client";

import Link from 'next/link';

const Newsletter = () => {
    return (
        <section className="bg-white text-center py-20 px-4 w-full relative z-10">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-4 text-black tracking-tight" style={{ color: '#000000' }}>Join the Nappy Garde Family</h2>
                <p className="text-gray-500 mb-8 text-lg max-w-2xl mx-auto">
                    Get expert parenting tips and exclusive offers delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full sm:w-80 border border-gray-300 rounded-full px-6 py-4 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-black bg-white shadow-sm"
                    />
                    <button className="w-full sm:w-auto bg-[#0071E3] hover:bg-blue-600 text-white font-semibold rounded-full px-8 py-4 text-base transition-all hover:-translate-y-0.5 shadow-md whitespace-nowrap flex-shrink-0">
                        Sign Up
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
