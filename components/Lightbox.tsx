import React from 'react';
import { createPortal } from 'react-dom';

export const Lightbox: React.FC<{ src: string | null, onClose: () => void }> = ({ src, onClose }) => {
    if (!src) return null;
    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-fade-in" onClick={onClose}>
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-3 group hover:bg-subtle rounded-full transition-all duration-300 z-50"
                aria-label="Close Gallery"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-primary group-hover:text-vermilion transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="relative max-w-full max-h-full p-2" onClick={(e) => e.stopPropagation()}>
                <img src={src} className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm" alt="Zoomed View" />
            </div>
        </div>,
        document.body
    );
};