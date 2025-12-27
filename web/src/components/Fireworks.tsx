import React from 'react';
import './Fireworks.css';

const Fireworks = () => {
    return (
        <div className="fireworks-container">
            {/* Simple CSS-based Firework bursts */}
            <div className="firework firework-1"></div>
            <div className="firework firework-2"></div>
            <div className="firework firework-3"></div>

            {/* Can add more if needed */}
        </div>
    );
};

export default Fireworks;
