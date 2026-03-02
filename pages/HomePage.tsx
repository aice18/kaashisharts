import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';
import { VisionCarousel } from '../components/VisionCarousel';
import { GalleryCarousel } from '../components/GalleryCarousel';

export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface font-sans text-primary">
            {/* 1. Hero Section - Clickable to Login */}
            <div 
                onClick={() => navigate('/login')}
                className="relative h-[100dvh] w-full cursor-pointer group overflow-hidden"
            >
                <HeroCarousel />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 z-10">
                    <div className="border-t border-b border-white/30 py-8 px-8 md:px-12 backdrop-blur-sm bg-white/5 max-w-4xl mx-auto">
                        <h1 className="text-6xl md:text-9xl font-serif tracking-tighter mb-2 animate-fade-in drop-shadow-2xl leading-none">
                            KashArts<span className="text-vermilion">.</span>
                        </h1>
                        <p className="text-[10px] md:text-sm uppercase tracking-[0.4em] font-light animate-fade-in opacity-90 mt-4">
                            Excellence in Art Education
                        </p>
                    </div>
                    
                    <div className="animate-pulse mt-16 group-hover:scale-105 transition-transform duration-500">
                        <span className="text-[10px] uppercase tracking-[0.3em] bg-white text-black px-8 py-4 rounded-full hover:bg-cobalt hover:text-white transition-all font-bold shadow-xl">
                            Enter Portal
                        </span>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce flex flex-col items-center gap-2 pointer-events-none">
                    <span className="text-[8px] uppercase tracking-[0.2em]">Scroll</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 space-y-32 md:space-y-40">

                {/* 2. Features Section - Moved Up */}
                <div className="border-t border-primary/5 pt-16 md:pt-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-start space-y-4 group hover:-translate-y-2 transition-transform duration-500 p-6 rounded-2xl hover:bg-white hover:shadow-lg md:hover:shadow-none md:hover:bg-transparent md:p-0">
                            <div className="w-14 h-14 bg-cobalt/5 flex items-center justify-center rounded-2xl text-cobalt group-hover:bg-cobalt group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif">Structured Syllabus</h3>
                            <p className="text-sm text-secondary leading-relaxed font-light">
                                A progressive 7-level curriculum designed to build skills layer by layer, ensuring comprehensive artistic development.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col items-start space-y-4 group hover:-translate-y-2 transition-transform duration-500 p-6 rounded-2xl hover:bg-white hover:shadow-lg md:hover:shadow-none md:hover:bg-transparent md:p-0">
                            <div className="w-14 h-14 bg-vermilion/5 flex items-center justify-center rounded-2xl text-vermilion group-hover:bg-vermilion group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif">Digital Portal</h3>
                            <p className="text-sm text-secondary leading-relaxed font-light">
                                Track attendance, view daily logs, and receive personalized feedback through our state-of-the-art parent portal.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col items-start space-y-4 group hover:-translate-y-2 transition-transform duration-500 p-6 rounded-2xl hover:bg-white hover:shadow-lg md:hover:shadow-none md:hover:bg-transparent md:p-0">
                            <div className="w-14 h-14 bg-ochre/5 flex items-center justify-center rounded-2xl text-ochre group-hover:bg-ochre group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif">Student Gallery</h3>
                            <p className="text-sm text-secondary leading-relaxed font-light">
                                Regular exhibitions showcasing student masterpieces, celebrating their growth and creative voice.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* 3. Vision Section - Text Only */}
                <div className="relative">
                    <div className="grid md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-12 relative z-20 bg-white p-8 md:p-16 shadow-xl border-l-4 border-cobalt rounded-xl md:rounded-none text-center md:text-left">
                            <span className="text-cobalt text-[10px] uppercase tracking-[0.3em] font-bold block mb-4 md:mb-6">Our Vision</span>
                            <h2 className="text-3xl md:text-6xl font-serif leading-tight mb-6 md:mb-8 max-w-4xl">
                                Cultivating creativity through <span className="italic text-secondary font-light">disciplined</span> expression.
                            </h2>
                            <p className="text-secondary leading-relaxed font-light text-base md:text-xl mb-8 max-w-3xl">
                                <b>At Kash Artss</b>, we believe art is a powerful form of self-expression that connects hearts and transcends boundaries. What began as a humble, passionate effort to uplift and celebrate art in India has grown into a vibrant space offering diverse classes, workshops, and creative events for all skill levels.
                                Guided by our core values—<b>Creating, Connecting, and Caring</b>—we foster personal growth, community, and compassion. Our dedicated teaching artists ensure a safe, inclusive environment where every student can explore freely, feel valued, and transform imagination into meaningful expression.

                            </p>
                            <button onClick={(e) => { e.stopPropagation(); navigate('/programs'); }} className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold hover:text-cobalt transition-colors border-b border-transparent hover:border-cobalt pb-1">
                                Explore Curriculum
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. Image Carousel - New Gallery Section */}
                <div className="space-y-8">
                    <div className="text-center">
                         <span className="text-vermilion text-[10px] uppercase tracking-[0.3em] font-bold block mb-2">Showcase</span>
                         <h2 className="text-3xl md:text-4xl font-serif">Featured Masterpieces</h2>
                    </div>
                    <GalleryCarousel />
                </div>

                {/* 5. Call to Action - Bold & Clean */}
                <div className="bg-primary text-white p-10 md:p-32 text-center rounded-2xl relative overflow-hidden group cursor-pointer shadow-2xl" onClick={() => navigate('/contact')}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cobalt/20 to-vermilion/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10 space-y-6 md:space-y-8">
                        <h2 className="text-4xl md:text-7xl font-serif tracking-tight">Ready to create?</h2>
                        <p className="text-white/70 max-w-xl mx-auto font-light text-base md:text-lg">
                            Join a community of passionate artists and begin your journey today.
                        </p>
                        <button className="bg-white text-primary px-8 py-4 md:px-10 md:py-5 text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold hover:bg-black hover:text-white transition-all shadow-xl hover:shadow-2xl translate-y-0 hover:-translate-y-1 rounded-full">
                            Enquire Now
                        </button>
                    </div>
                </div>

                {/* 6. Policy Summaries */}
                <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-serif mb-4">Privacy Policy</h3>
                            <p className="text-sm text-secondary mb-4">
                                We collect information to provide and improve services, communicate updates, and personalise your experience. We don’t sell your data and protect it with security measures.
                            </p>
                            <button onClick={() => navigate('/privacy')} className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:text-cobalt inline-flex items-center gap-1">
                                Read Full Policy <span className="transform transition-transform group-hover:translate-x-1">→</span>
                            </button>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-serif mb-4">Terms & Conditions</h3>
                            <p className="text-sm text-secondary mb-4">
                                By using our site you agree to lawful use, respect intellectual property, and understand that all sales are final with liability limits.
                            </p>
                            <button onClick={() => navigate('/terms')} className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:text-cobalt inline-flex items-center gap-1">
                                Read Full Terms <span className="transform transition-transform group-hover:translate-x-1">→</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* 6. Footer */}
            <footer className="bg-white border-t border-primary/5 py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                    {/* Left card - Address */}
                    <div className="bg-surface/50 rounded-xl p-6 shadow-sm">
                        <h4 className="font-serif text-lg font-bold mb-2">Studio Headquarters</h4>
                        <address className="not-italic text-sm text-secondary leading-relaxed">
                            Mit Residency, Lane Number 3B,
                            <br /> Kalyani Nagar, Pune, Maharashtra
                            <br /> 411006
                        </address>
                    </div>

                    {/* Middle card - Contact & Social */}
                    <div className="bg-surface/50 rounded-xl p-6 shadow-sm">
                        <h4 className="font-serif text-lg font-bold mb-2">Contact</h4>
                        <p className="text-sm text-secondary mb-3">Tap to call or email — large touch targets on mobile.</p>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
                            <a href="tel:+919881721288" aria-label="Call +91 98817 21288" className="w-full sm:w-auto text-center py-3 px-4 rounded border border-primary/10 bg-white hover:bg-primary/5 text-primary font-medium shadow-sm">+91 98817 21288</a>
                            <a href="tel:02040097541" aria-label="Call 020 40097541" className="w-full sm:w-auto text-center py-3 px-4 rounded border border-primary/10 bg-white hover:bg-primary/5 text-primary font-medium shadow-sm">020 40097541</a>
                        </div>

                        <div className="mt-4">
                            <a href="mailto:admissions@kasharts.com" aria-label="Email admissions" className="w-full inline-block text-center py-3 px-4 rounded border border-primary/10 bg-white hover:bg-primary/5 text-primary font-medium shadow-sm">admissions@kasharts.com</a>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-3 rounded-md bg-white/0 hover:bg-primary/5 text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7z"/><path d="M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.5 6a.9.9 0 110 1.8.9.9 0 010-1.8z"/></svg>
                            </a>
                            <a href="#" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-3 rounded-md bg-white/0 hover:bg-primary/5 text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.5V12h2.5V9.5c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z"/></svg>
                            </a>
                        </div>
                    </div>

                <div className="max-w-7xl mx-auto px-6 mt-8 text-center">
                    <p className="text-[13px] text-secondary">© Kashartss 2026 | All Rights Reserved</p>
                </div>
                </div>
            </footer>
        </div>
    );
};
