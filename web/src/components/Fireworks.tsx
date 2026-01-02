"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import './Fireworks.css';

const Fireworks = () => {
    const pathname = usePathname();

    if (pathname !== '/') {
        return null;
    }

    return (
        <div className="fireworks-container">
            {/* Apple Blue & Red Fireworks covering more area */}
            <div className="firework firework-1"></div>
            <div className="firework firework-2"></div>
            <div className="firework firework-3"></div>
            <div className="firework firework-4"></div>
            <div className="firework firework-5"></div>
            <div className="firework firework-6"></div>
        </div>
    );
};

export default Fireworks;
