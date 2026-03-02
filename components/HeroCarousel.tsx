import React, { useState, useEffect } from 'react';

export const HeroCarousel = () => {
    const [index, setIndex] = useState(0);
    const images = [
        "../../assets/hero1.png",
        "../../assets/hero4.png",
        "../../assets/hero3.png",
        "../../assets/hero6.jpeg",
        "../../assets/hero7.png"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
             {images.map((img, i) => (
                 <div 
                    key={i} 
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                 >
                    <img src={img} className="w-full h-full object-cover transform transition-transform duration-[10000ms] ease-linear scale-110" alt="Hero" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
                 </div>
             ))}
        </div>
    );
}
