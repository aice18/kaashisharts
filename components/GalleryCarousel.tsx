import React, { useState, useEffect } from 'react';
import { GALLERY_IMAGES } from '../constants';

export const GalleryCarousel = () => {
    const [index, setIndex] = useState(0);
    const images = GALLERY_IMAGES;

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative h-[600px] md:h-[500px] w-full overflow-hidden rounded-2xl shadow-xl group my-25 md:my-25">
             {images.map((item, i) => (
                 <div 
                    key={i} 
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
                 >
                    <img src={item.url} className="w-full h-full object-cover" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                        <h3 className="text-white font-serif text-2xl md:text-3xl tracking-wide">{item.title}</h3>
                    </div>
                 </div>
             ))}
             
             {/* Indicators */}
             <div className="absolute bottom-4 right-4 flex gap-2">
                {images.map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                    />
                ))}
             </div>
        </div>
    );
}
