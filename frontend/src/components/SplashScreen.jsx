import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Show splash screen for at least 2 seconds
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Wait for transition to finish before unmounting/hiding
            setTimeout(onFinish, 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <div className="splash-logo">Nappy Garde</div>
                <div className="splash-loader">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
