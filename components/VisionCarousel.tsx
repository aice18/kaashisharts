import React, { useState, useEffect } from 'react';

export const VisionCarousel = () => {
    const [index, setIndex] = useState(0);
    const images = [
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80",
        "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=1200&q=80",
        "https://images.unsplash.com/photo-1560421683-6856ea585c78?w=1200&q=80",
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden rounded-2xl shadow-2xl group">
             {images.map((img, i) => (
                 <div 
                    key={i} 
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
                 >
                    <div className="absolute inset-0 bg-cobalt/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-700"></div>
                    <img src={img} className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2000ms]" alt="Vision" />
                 </div>
             ))}
             
             {/* Carousel Indicators */}
             <div className="absolute bottom-6 left-6 z-20 flex gap-2">
                {images.map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                    />
                ))}
             </div>
        </div>
    );
}
