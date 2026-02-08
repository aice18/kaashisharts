import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { HashRouter, Routes, Route, useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { PortalNavigation } from './components/Navigation';
import { PublicHeader } from './components/PublicHeader';
import { DailyLogCard } from './components/DailyLogCard';
import { StudentSkillsChart, ClassDistributionChart, WeeklyActivityChart } from './components/Charts';
import { SYLLABUS_DATA, GALLERY_IMAGES } from './constants';
import { Student, SyllabusItem, UserRole, Teacher, DailyLog } from './types';
import { Database } from './services/database';

// --- Utility for Colors ---
const PIGMENTS = ['text-cobalt', 'text-vermilion', 'text-ochre', 'text-viridian', 'text-violet'];
const BG_PIGMENTS = ['bg-cobalt', 'bg-vermilion', 'bg-ochre', 'bg-viridian', 'bg-violet'];

// --- Shared Components ---

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const Lightbox: React.FC<{ src: string | null, onClose: () => void }> = ({ src, onClose }) => {
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
                <img src={src} className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm" alt="Art Piece" />
            </div>
        </div>,
        document.body
    );
};

const FeesModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-surface/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
             <div className="bg-surface w-full max-w-lg p-12 shadow-2xl border border-subtle relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-viridian to-ochre"></div>
                
                {/* Close X for Modal */}
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary hover:text-primary p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex justify-between items-start mb-12 mt-2">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-secondary block mb-2">Statement</span>
                        <h2 className="text-3xl font-serif text-primary">Financial Status</h2>
                    </div>
                    <span className="bg-viridian/10 text-viridian px-4 py-1 text-[9px] uppercase tracking-[0.2em] font-bold">Paid</span>
                </div>

                <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center pb-6 border-b border-subtle">
                        <span className="text-secondary font-light text-sm">Tuition (Term 3)</span>
                        <span className="font-serif text-xl text-primary">₹ 4,500</span>
                    </div>
                    <div className="flex justify-between items-center pb-6 border-b border-subtle">
                        <span className="text-secondary font-light text-sm">Materials & Assets</span>
                        <span className="font-serif text-xl text-primary">₹ 1,200</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-serif text-2xl text-primary">Total</span>
                        <span className="font-serif text-2xl text-primary">₹ 5,700</span>
                    </div>
                </div>

                <button onClick={onClose} className="w-full border border-subtle text-secondary py-4 text-[10px] uppercase tracking-[0.2em] hover:border-viridian hover:text-viridian transition-colors">
                    Close Statement
                </button>
             </div>
        </div>,
        document.body
    );
};

// --- Layouts ---

const PublicLayout = () => (
    <div className="min-h-screen bg-background text-primary font-sans selection:bg-cobalt selection:text-white">
        <ScrollToTop />
        <PublicHeader />
        <main>
            <Outlet />
        </main>
        <footer className="border-t border-primary/5 py-32 px-8 md:px-16 bg-background">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
                <div>
                    <span className="font-serif text-3xl font-medium tracking-tight">KASH ARTS.</span>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-secondary mt-4">Est. 2010</p>
                </div>
                <div className="flex flex-col gap-6 text-[10px] uppercase tracking-[0.2em] text-secondary">
                    <a href="#" className="hover:text-cobalt transition-colors">Instagram</a>
                    <a href="#" className="hover:text-cobalt transition-colors">LinkedIn</a>
                    <a href="#/login" className="hover:text-cobalt transition-colors">Portal</a>
                </div>
                <div className="md:text-right">
                     <p className="text-[9px] text-secondary font-light">© 2024 Institute of Arts.</p>
                     <p className="text-[9px] text-secondary font-light mt-2">Privacy & Legal</p>
                </div>
            </div>
        </footer>
    </div>
);

const PortalLayout: React.FC<{ role: UserRole }> = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine active tab from URL
    const activeTab = location.pathname.split('/').pop() || 'dashboard';

    const handleTabChange = (tab: string) => {
        navigate(tab);
    };

    return (
        <div className="min-h-screen bg-background max-w-lg mx-auto relative flex flex-col border-x border-primary/5 shadow-[0_0_100px_rgba(0,0,0,0.03)]">
            <ScrollToTop />
            <div className="flex-1 overflow-y-auto no-scrollbar px-10 pb-32">
                <Outlet />
            </div>
            <PortalNavigation activeTab={activeTab} setActiveTab={handleTabChange} role={role} />
        </div>
    );
};

// --- Public Pages ---

const HomePage = () => {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [heroIndex, setHeroIndex] = useState(0);

    const HERO_IMAGES = [
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // Studio
        "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // Hands painting
        "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // Inspiration
        "https://images.unsplash.com/photo-1529154691717-3306083d869e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"  // Brushes
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleWhatsAppRedirect = () => {
        const phoneNumber = "919876543210";
        const message = encodeURIComponent("Greetings. I would like to inquire about scheduling a consultation for admission at KashArts Institute.");
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
    <div className="animate-fade-in bg-background overflow-hidden">
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

        {/* Hero Section */}
        <div className="min-h-screen flex items-center px-8 md:px-16 pt-20 relative">
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-cobalt/10 via-violet/10 to-transparent rounded-full blur-[120px] -z-10 animate-blob mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-ochre/10 via-vermilion/5 to-transparent rounded-full blur-[100px] -z-10 animate-blob animation-delay-2000 mix-blend-multiply"></div>

            <div className="max-w-[1600px] mx-auto w-full">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-6 space-y-12 z-20">
                        <h1 className="text-7xl md:text-9xl font-serif text-primary leading-[0.85] tracking-tight">
                            Vision <span className="italic font-light text-cobalt">&</span><br/>
                            Discipline.
                        </h1>
                        <p className="text-lg md:text-xl text-secondary max-w-md font-light leading-relaxed pl-1 border-l-2 border-vermilion/30">
                            An institute for the dedicated study of visual arts. Cultivating observation, technique, and avant-garde expression.
                        </p>
                        <div className="flex items-center gap-12 pt-4">
                            <button onClick={handleWhatsAppRedirect} className="group flex items-center gap-4">
                                <span className="w-12 h-px bg-primary group-hover:w-20 group-hover:bg-vermilion transition-all duration-500"></span>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] group-hover:text-vermilion transition-colors">Book Consultation</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Carousel */}
                    <div className="lg:col-span-6 relative h-[65vh] w-full z-10">
                         <div className="absolute -inset-4 border border-primary/5 rounded-none z-0"></div>
                         <div className="w-full h-full overflow-hidden bg-subtle relative z-10 shadow-2xl shadow-primary/5 group">
                             {HERO_IMAGES.map((img, index) => (
                                 <img 
                                    key={index}
                                    src={img} 
                                    alt={`Studio ${index}`} 
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${
                                        index === heroIndex 
                                        ? 'opacity-100 scale-105' 
                                        : 'opacity-0 scale-100'
                                    }`}
                                />
                             ))}
                             
                             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                                {HERO_IMAGES.map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setHeroIndex(i)}
                                        className={`w-2 h-2 rounded-full transition-all duration-500 ${i === heroIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white'}`}
                                    ></button>
                                ))}
                             </div>

                             <div className="absolute -bottom-10 -left-10 bg-surface p-8 max-w-xs hidden md:block z-20 shadow-xl shadow-cobalt/5 transition-transform hover:-translate-y-2 duration-500">
                                <p className="font-serif text-2xl italic text-primary">"The eye must learn to listen."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Selected Works - Moved Up */}
        <div className="py-32 px-8 md:px-16 bg-surface">
            <div className="max-w-[1600px] mx-auto">
                <div className="mb-24 flex justify-between items-end">
                    <h2 className="text-4xl font-serif">Student Showcase</h2>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-viridian font-bold">Latest Works</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {GALLERY_IMAGES.slice(0, 3).map((src, i) => (
                        <div key={i} className="group cursor-zoom-in" onClick={() => setLightboxSrc(src)}>
                            <div className="aspect-[4/5] overflow-hidden bg-subtle mb-6 relative">
                                <img src={src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                                <div className={`absolute inset-0 ${BG_PIGMENTS[i % BG_PIGMENTS.length]} mix-blend-color opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none`}></div>
                            </div>
                            <div className="flex justify-between items-baseline border-t border-primary/5 pt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="font-serif italic text-lg text-primary">Untitled Study No. {i + 1}</span>
                                <span className={`text-[10px] uppercase tracking-widest ${PIGMENTS[i % PIGMENTS.length]}`}>Age {8 + i}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-24 text-center">
                     <a href="#/gallery" className="inline-block border border-primary/10 px-10 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-surface transition-colors font-bold">View Full Exhibition</a>
                </div>
            </div>
        </div>

        {/* Philosophy */}
        <div className="py-40 px-8 md:px-16 bg-background relative">
             <div className="max-w-[1600px] mx-auto">
                 <div className="grid md:grid-cols-12 gap-16 border-t border-primary/5 pt-16">
                     <div className="md:col-span-4">
                         <span className="text-[10px] uppercase tracking-[0.3em] text-ochre block mb-6 font-bold">Philosophy</span>
                         <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                             Perception precedes <br/>creation.
                         </h2>
                     </div>
                     <div className="md:col-span-4 md:col-start-6 space-y-8">
                         <p className="text-lg font-light text-secondary leading-relaxed">
                             Our pedagogy moves beyond replication. We deconstruct the visual world into fundamental components—<span className="text-cobalt/80">light</span>, <span className="text-primary/80">shadow</span>, and <span className="text-vermilion/80">geometry</span>—empowering students to reconstruct reality.
                         </p>
                     </div>
                     <div className="md:col-span-2 md:col-start-11 flex items-end justify-end">
                         <a href="#/about" className="text-[10px] uppercase tracking-[0.2em] border-b border-primary pb-1 hover:text-ochre hover:border-ochre transition-colors font-bold">
                             Read Manifesto
                         </a>
                     </div>
                 </div>
             </div>
        </div>

        {/* Curriculum */}
        <div className="py-40 px-8 md:px-16 bg-surface">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex justify-between items-baseline mb-24">
                     <h2 className="text-4xl font-serif">Academic Progression</h2>
                     <a href="#/programs" className="text-[10px] uppercase tracking-[0.2em] text-secondary hover:text-cobalt font-bold">View Full Syllabus</a>
                </div>
                
                <div>
                    {SYLLABUS_DATA.slice(0, 4).map((item, i) => (
                        <div key={i} className="group grid grid-cols-12 py-12 border-b border-primary/5 hover:border-primary/20 transition-colors cursor-pointer items-baseline" onClick={() => window.location.hash = '#/programs'}>
                            <div className={`col-span-2 md:col-span-1 text-xl font-serif ${PIGMENTS[i % PIGMENTS.length]} opacity-60 group-hover:opacity-100 transition-opacity`}>0{item.level}</div>
                            <div className="col-span-10 md:col-span-5 text-3xl font-serif group-hover:translate-x-4 transition-transform duration-500 italic text-primary">{item.title}</div>
                            <div className="hidden md:block md:col-span-4 text-sm font-light text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">{item.description}</div>
                            <div className="hidden md:block md:col-span-2 text-right">
                                <span className={`text-2xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${PIGMENTS[i % PIGMENTS.length]}`}>→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="py-40 px-8 md:px-16 text-center bg-background border-t border-primary/5 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vermilion/5 rounded-full blur-[100px] -z-10"></div>
            <h2 className="text-6xl md:text-8xl font-serif mb-12 text-primary tracking-tight">Begin your legacy.</h2>
            <button onClick={handleWhatsAppRedirect} className="bg-primary text-surface px-16 py-6 text-[11px] uppercase tracking-[0.2em] hover:bg-vermilion transition-colors duration-500 font-bold">
                Inquire for Admission
            </button>
        </div>
    </div>
    );
};

const AboutPage = () => (
    <div className="max-w-[1200px] mx-auto py-40 px-8 md:px-16 animate-fade-in relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-ochre/10 rounded-full blur-[80px] -z-10"></div>
        <div className="text-center mb-32">
             <span className="text-[10px] uppercase tracking-[0.3em] text-cobalt block mb-8 font-bold">Our Narrative</span>
             <h1 className="text-5xl md:text-7xl font-serif leading-[1.1]">
                We do not teach art.<br/> We teach <span className="italic text-vermilion">vision.</span>
             </h1>
        </div>
        
        <div className="grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5 sticky top-32">
                 <img 
                    src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    className="w-full h-auto grayscale shadow-2xl" 
                />
                <p className="text-[9px] uppercase tracking-[0.2em] text-secondary mt-6 border-l-2 border-viridian pl-4">Studio 1, Main Campus</p>
            </div>
            <div className="md:col-span-6 md:col-start-7 space-y-12 text-lg font-light text-secondary leading-relaxed">
                <p>
                    <span className="text-6xl float-left mr-4 mt-[-10px] font-serif text-cobalt">F</span>ounded in 2010, KashArts Institute emerged from a necessity: to create a space where rigorous technique meets boundless expression. We reject the notion that art is merely a hobby.
                </p>
                <p>
                    Here, the studio is a laboratory. Every stroke is deliberate, every color choice calculated. We guide students through the history of aesthetics while pushing them to define the future.
                </p>
            </div>
        </div>
    </div>
);

const ProgramsPage = () => (
    <div className="max-w-[1600px] mx-auto py-40 px-8 md:px-16 animate-fade-in relative">
        <div className="absolute top-20 left-0 w-[600px] h-[600px] bg-viridian/5 rounded-full blur-[100px] -z-10"></div>
        <h1 className="text-6xl font-serif mb-32 pl-4 border-l-4 border-cobalt">The Curriculum</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
            {SYLLABUS_DATA.map((item, i) => (
                <div key={item.level} className="group">
                    <div className="flex items-baseline justify-between border-b border-primary/10 pb-6 mb-8">
                        <span className={`text-6xl font-serif ${PIGMENTS[i % PIGMENTS.length]} opacity-30 group-hover:opacity-100 transition-all duration-500`}>0{item.level}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Module {item.level}</span>
                    </div>
                    <h3 className="text-4xl font-serif mb-6 group-hover:pl-4 transition-all duration-300">{item.title}</h3>
                    <p className="text-secondary font-light mb-8 max-w-md leading-relaxed">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-3">
                        {item.modules.map((mod, j) => (
                            <span key={j} className="text-[10px] uppercase tracking-wider border border-primary/10 px-4 py-2 text-secondary group-hover:border-primary/30 group-hover:text-primary transition-colors">
                                {mod}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const GalleryPage = () => {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    return (
    <div className="max-w-[1600px] mx-auto py-40 px-8 md:px-16 animate-fade-in">
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        <h1 className="text-6xl font-serif mb-12">Exhibition</h1>
        <div className="flex gap-8 mb-24 overflow-x-auto no-scrollbar">
            {['All Works', 'Oil on Canvas', 'Charcoal', 'Digital'].map((cat, i) => (
                <button key={i} className={`text-[11px] uppercase tracking-[0.2em] whitespace-nowrap font-bold ${i===0 ? 'text-vermilion border-b border-vermilion pb-1' : 'text-secondary hover:text-primary'}`}>
                    {cat}
                </button>
            ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {GALLERY_IMAGES.map((src, idx) => (
                <div key={idx} className="aspect-[3/4] relative group overflow-hidden bg-gray-100 cursor-zoom-in" onClick={() => setLightboxSrc(src)}>
                    <img 
                        src={src} 
                        alt={`Art ${idx}`} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0" 
                    />
                    <div className={`absolute inset-0 ${BG_PIGMENTS[idx % BG_PIGMENTS.length]} mix-blend-multiply opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`}></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center text-surface p-8 text-center z-10">
                        <span className="text-[9px] uppercase tracking-[0.3em] mb-4">Catalog No. {100 + idx}</span>
                        <h3 className="font-serif text-3xl italic mb-2">Untitled Study</h3>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};

const ContactPage = () => (
    <div className="max-w-[1600px] mx-auto py-40 px-8 md:px-16 animate-fade-in bg-background relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-violet/5 to-transparent -z-10"></div>
        <div className="grid md:grid-cols-12 gap-24">
            <div className="md:col-span-5">
                <h1 className="text-7xl font-serif mb-16">Inquiries</h1>
                <div className="space-y-16">
                     <div>
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-viridian mb-4 font-bold">Location</span>
                        <p className="text-2xl font-light leading-relaxed">123 Art District, Creative Block,<br/>Metropolis, 400001</p>
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-viridian mb-4 font-bold">Contact</span>
                        <p className="text-2xl font-light leading-relaxed">+91 98765 43210<br/>admissions@kasharts.com</p>
                     </div>
                </div>
            </div>
            <form className="md:col-span-7 space-y-12 pt-8">
                <div className="group">
                    <input type="text" className="w-full bg-transparent border-b border-primary/20 py-4 font-serif text-3xl outline-none placeholder-primary/20 focus:border-cobalt transition-colors rounded-none" placeholder="Your Name" />
                </div>
                <div className="group">
                    <input type="email" className="w-full bg-transparent border-b border-primary/20 py-4 font-serif text-3xl outline-none placeholder-primary/20 focus:border-cobalt transition-colors rounded-none" placeholder="Email Address" />
                </div>
                <div className="group">
                    <textarea className="w-full bg-transparent border-b border-primary/20 py-4 font-serif text-3xl outline-none placeholder-primary/20 focus:border-cobalt transition-colors rounded-none h-40 resize-none" placeholder="Message"></textarea>
                </div>
                <div className="pt-8">
                    <button className="border border-primary bg-transparent text-primary px-16 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-cobalt hover:border-cobalt hover:text-surface transition-colors duration-500">
                        Transmit Message
                    </button>
                </div>
            </form>
        </div>
    </div>
);

const LoginPage: React.FC<{ onLogin: (role: UserRole, user: Student | Teacher) => void }> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [activeRole, setActiveRole] = useState<UserRole>('parent');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const demoHint = activeRole === 'parent' ? "Try ID: ST-2024-001 (Password: 1234)" : "Try ID: T-001 (Password: 1234)";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const user = await Database.login(activeRole, userId, password);
        setLoading(false);

        if (user) {
            onLogin(activeRole, user);
            navigate(activeRole === 'teacher' ? '/portal/teacher' : '/portal/parent');
        } else {
            setError('Invalid credentials. Please verify your ID.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-surface relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-vermilion/5 to-transparent rounded-full blur-3xl -z-10"></div>
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cobalt/5 to-transparent rounded-full blur-3xl -z-10"></div>

            <div className="w-full max-w-md animate-fade-in border border-primary/10 p-12 relative bg-surface/90 backdrop-blur-xl shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cobalt via-vermilion to-ochre"></div>
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif mb-2">Portal Access</h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-secondary">Authorized Personnel Only</p>
                </div>

                <div className="flex border-b border-primary/10 mb-8">
                    <button 
                        onClick={() => { setActiveRole('parent'); setError(''); }}
                        className={`flex-1 pb-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${activeRole === 'parent' ? 'text-cobalt border-b-2 border-cobalt' : 'text-secondary hover:text-primary'}`}
                    >
                        Parent
                    </button>
                    <button 
                        onClick={() => { setActiveRole('teacher'); setError(''); }}
                        className={`flex-1 pb-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${activeRole === 'teacher' ? 'text-vermilion border-b-2 border-vermilion' : 'text-secondary hover:text-primary'}`}
                    >
                        Faculty
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="group">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">
                            {activeRole === 'parent' ? 'Student ID' : 'Faculty ID'}
                        </label>
                        <input 
                            type="text" 
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-transparent border-b border-primary/20 py-2 font-serif text-xl outline-none focus:border-primary transition-colors rounded-none placeholder-gray-300"
                            placeholder={activeRole === 'parent' ? 'ST-...' : 'T-...'}
                        />
                    </div>
                    <div className="group">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b border-primary/20 py-2 font-serif text-xl outline-none focus:border-primary transition-colors rounded-none"
                            placeholder="••••••"
                        />
                    </div>

                    {error && <p className="text-vermilion text-xs">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-surface transition-all duration-500 ${loading ? 'bg-secondary cursor-wait' : activeRole === 'parent' ? 'bg-cobalt hover:bg-primary' : 'bg-vermilion hover:bg-primary'}`}
                    >
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>

                <p className="text-center mt-8 text-[9px] text-gray-400">
                    {demoHint}
                </p>
                <p className="text-center mt-6">
                    <a href="/" className="text-[9px] uppercase tracking-[0.2em] text-secondary hover:text-primary border-b border-transparent hover:border-primary transition-all pb-1">Return to Institute</a>
                </p>
            </div>
        </div>
    );
};

// --- Portal Components ---

const ParentDashboard: React.FC<{ student: Student }> = ({ student }) => {
  const [showFees, setShowFees] = useState(false);
  const studentLogs = Database.getLogsForStudent(student.id);

  return (
    <div className="space-y-16 animate-fade-in pt-12">
      <FeesModal isOpen={showFees} onClose={() => setShowFees(false)} />
      
      <div className="flex justify-between items-end border-b border-primary/10 pb-8">
        <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-secondary block mb-2">Student Profile</span>
            <h1 className="text-4xl font-serif text-primary">{student.name}</h1>
        </div>
        <img src={student.profileImage} className="w-16 h-16 grayscale object-cover ring-2 ring-offset-4 ring-cobalt/20 rounded-full" />
      </div>

      {/* Stats and Charts Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
         {/* Key Metrics */}
         <div className="lg:col-span-5 grid grid-cols-1 gap-px bg-primary/10 border border-primary/10 h-min">
             <div className="bg-surface p-10 hover:bg-cobalt/5 transition-colors group">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-secondary group-hover:text-cobalt">Level</span>
                 <p className="text-5xl font-serif mt-4 text-primary group-hover:text-cobalt transition-colors">0{student.currentLevel}</p>
             </div>
             <div className="bg-surface p-10 hover:bg-vermilion/5 transition-colors group">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-secondary group-hover:text-vermilion">Attendance</span>
                 <p className="text-5xl font-serif mt-4 text-primary group-hover:text-vermilion transition-colors">92%</p>
             </div>
         </div>
         
         {/* Skills Chart */}
         <div className="lg:col-span-7">
             <StudentSkillsChart student={student} />
         </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-8 border-b border-primary/10 pb-2">
             <h3 className="text-xl font-serif italic">Recent Progression</h3>
        </div>
        {studentLogs.length > 0 ? (
            <DailyLogCard log={studentLogs[0]} />
        ) : (
            <p className="text-secondary font-light italic">No activity logs recorded yet.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <button onClick={() => setShowFees(true)} className="p-8 border border-primary/10 hover:bg-viridian hover:text-surface transition-colors text-left group">
            <span className="text-3xl block mb-4 font-serif">Fees</span>
            <span className="text-[9px] uppercase tracking-[0.2em] opacity-60">View Statement</span>
        </button>
        <button className="p-8 border border-primary/10 hover:bg-ochre hover:text-surface transition-colors text-left group">
            <span className="text-3xl block mb-4 font-serif">Portfolio</span>
            <span className="text-[9px] uppercase tracking-[0.2em] opacity-60">View Works</span>
        </button>
      </div>
    </div>
  );
};

const SyllabusView: React.FC = () => {
    const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

    return (
        <div className="space-y-10 animate-fade-in pt-12">
            <h1 className="text-3xl font-serif border-b border-primary/10 pb-6">Curriculum Path</h1>
            <div className="space-y-4">
                {SYLLABUS_DATA.map((item, i) => (
                    <div key={item.level} className="bg-background border border-primary/5">
                        <button 
                            onClick={() => setExpandedLevel(expandedLevel === item.level ? null : item.level)}
                            className="w-full flex items-center justify-between p-8 hover:bg-surface transition-colors text-left"
                        >
                            <span className="font-serif text-xl"><span className={`${PIGMENTS[i % PIGMENTS.length]}`}>0{item.level}</span> — {item.title}</span>
                            <span className={`text-[10px] transition-transform duration-300 ${expandedLevel === item.level ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {expandedLevel === item.level && (
                            <div className="p-8 border-t border-primary/5 bg-surface">
                                <p className="text-sm font-light text-secondary mb-8 max-w-lg leading-relaxed">{item.description}</p>
                                <div className="flex flex-wrap gap-3">
                                    {item.modules.map((mod, idx) => (
                                        <span key={idx} className="text-[9px] uppercase tracking-[0.2em] border border-primary/10 px-4 py-2 text-secondary hover:text-primary hover:border-primary/50 transition-colors">
                                            {mod}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const LogsView: React.FC<{ student: Student }> = ({ student }) => {
    const logs = Database.getLogsForStudent(student.id);
    return (
        <div className="space-y-10 animate-fade-in pt-12">
             <h1 className="text-3xl font-serif border-b border-primary/10 pb-6">Academic Logs</h1>
             {logs.length > 0 ? (
                logs.map(log => <DailyLogCard key={log.id} log={log} />)
             ) : (
                <p className="text-secondary font-light">No academic records found.</p>
             )}
        </div>
    );
}

const ProfileView: React.FC<{ user: Student | Teacher, role: UserRole, onLogout: () => void }> = ({ user, role, onLogout }) => {
    return (
        <div className="space-y-10 animate-fade-in pt-12">
            <h1 className="text-3xl font-serif border-b border-primary/10 pb-6">User Profile</h1>
            
            <div className="flex items-center gap-8 p-8 border border-primary/10 bg-surface">
                <img 
                    src={user.profileImage} 
                    alt={user.name}
                    className="w-24 h-24 grayscale object-cover rounded-full"
                />
                <div>
                    <h2 className="text-2xl font-serif mb-2">{user.name}</h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-secondary">{user.id}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cobalt mt-1 font-bold">{role}</p>
                </div>
            </div>

            <div className="space-y-px bg-primary/10 border border-primary/10">
                 <button className="w-full flex items-center justify-between p-8 bg-surface hover:bg-background transition-colors text-left">
                    <span className="text-sm font-light">Notifications</span>
                    <div className="w-2 h-2 bg-vermilion rounded-full"></div>
                 </button>
                 <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-between p-8 bg-surface hover:bg-vermilion hover:text-surface transition-colors text-left"
                >
                    <span className="text-sm font-light">Terminate Session</span>
                    <span>→</span>
                 </button>
            </div>
        </div>
    );
}

const TeacherDashboard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
    const allStudents = Database.getAllStudents();
    
    return (
        <div className="space-y-16 animate-fade-in pt-12">
            <div className="flex justify-between items-end border-b border-primary/10 pb-8">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-secondary block mb-2">Faculty</span>
                    <h1 className="text-4xl font-serif text-primary">Welcome, {teacher.name.split(' ')[0]}</h1>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="p-10 bg-cobalt text-surface">
                    <div className="text-5xl font-serif mb-4">{teacher.upcomingClasses}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] opacity-60">Pending Sessions</div>
                </div>
                <div className="p-10 border border-primary/10 bg-surface">
                    <div className="text-5xl font-serif mb-4">{allStudents.length}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-secondary">Active Students</div>
                </div>
            </div>

            {/* Teacher Analytics Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                <ClassDistributionChart students={allStudents} />
                <WeeklyActivityChart />
            </div>

            <div>
                <h3 className="text-xl font-serif italic mb-8">Today's Itinerary</h3>
                <div className="space-y-px bg-primary/10 border border-primary/10">
                    <div className="p-8 bg-surface flex gap-8 items-baseline border-l-4 border-viridian">
                        <span className="text-2xl font-serif w-24">16:00</span>
                        <div>
                            <div className="text-lg font-medium">Level 3: Natural Form</div>
                            <div className="text-xs text-secondary mt-1">Batch A • Studio 2</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeacherStudentList = () => {
    const students = Database.getAllStudents();
    
    return (
        <div className="space-y-10 animate-fade-in pt-12">
            <div className="flex justify-between items-end border-b border-primary/10 pb-6">
                 <h1 className="text-3xl font-serif">Student Registry</h1>
                 <button className="text-[9px] font-bold uppercase tracking-[0.2em] border border-primary px-6 py-3 hover:bg-primary hover:text-surface transition-colors">Add Record</button>
            </div>
            <div className="space-y-px bg-primary/5 border border-primary/5">
                 {students.map((s, i) => (
                     <div key={i} className="flex items-center p-8 bg-surface hover:bg-background transition-colors cursor-pointer group justify-between">
                         <div className="flex items-center gap-6">
                            <img src={s.profileImage} className="w-12 h-12 grayscale object-cover rounded-full" />
                            <div>
                                <h4 className="font-serif text-xl mb-1">{s.name}</h4>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-secondary">Level 0{s.currentLevel} • {s.id}</span>
                            </div>
                         </div>
                         <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xl font-light text-cobalt">→</span>
                     </div>
                 ))}
            </div>
        </div>
    );
};

const TeacherAddLog = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [homework, setHomework] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const students = Database.getAllStudents();
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    const handleSubmit = async () => {
        if (!title || !description || selectedStudentIds.length === 0) return;
        setSubmitting(true);
        
        await Database.addLog({
            studentIds: selectedStudentIds,
            date: new Date().toISOString().split('T')[0],
            entryTime: "04:00 PM",
            exitTime: "05:30 PM",
            activityTitle: title,
            activityDescription: description,
            homework: homework || "Practice daily.",
            mediaUrls: []
        });

        setSubmitting(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setTitle(''); setDescription(''); setHomework(''); setSelectedStudentIds([]);
    };

    const toggleStudent = (id: string) => {
        if (selectedStudentIds.includes(id)) {
            setSelectedStudentIds(selectedStudentIds.filter(sid => sid !== id));
        } else {
            setSelectedStudentIds([...selectedStudentIds, id]);
        }
    }

    return (
        <div className="space-y-10 animate-fade-in pt-12">
            <h1 className="text-3xl font-serif border-b border-primary/10 pb-6">New Academic Record</h1>
            <div className="space-y-10 max-w-xl">
                
                <div className="space-y-4">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Select Students</label>
                    <div className="flex flex-wrap gap-2">
                        {students.map(s => (
                            <button 
                                key={s.id}
                                onClick={() => toggleStudent(s.id)}
                                className={`text-xs px-3 py-2 border transition-colors ${selectedStudentIds.includes(s.id) ? 'bg-primary text-surface border-primary' : 'bg-transparent border-primary/20 text-secondary'}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Module Title</label>
                    <input 
                        type="text" 
                        value={title} onChange={e => setTitle(e.target.value)}
                        className="w-full bg-transparent border-b border-primary/20 py-3 font-serif text-xl outline-none rounded-none placeholder-primary/20 focus:border-cobalt transition-colors" 
                        placeholder="e.g. Color Theory" 
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Observation Notes</label>
                    <textarea 
                        value={description} onChange={e => setDescription(e.target.value)}
                        className="w-full bg-transparent border-b border-primary/20 py-3 font-serif text-xl outline-none rounded-none h-40 resize-none placeholder-primary/20 focus:border-cobalt transition-colors" 
                        placeholder="Details..."
                    ></textarea>
                </div>
                <div className="space-y-4">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Homework</label>
                    <input 
                        type="text" 
                        value={homework} onChange={e => setHomework(e.target.value)}
                        className="w-full bg-transparent border-b border-primary/20 py-3 font-serif text-xl outline-none rounded-none placeholder-primary/20 focus:border-cobalt transition-colors" 
                        placeholder="Assignment" 
                    />
                </div>

                <div className="pt-6">
                    <button 
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-surface transition-colors ${success ? 'bg-viridian' : 'bg-primary hover:bg-cobalt'}`}
                    >
                        {submitting ? 'Committing...' : success ? 'Record Added!' : 'Commit Record'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main App ---

const App: React.FC = () => {
    const [userRole, setUserRole] = useState<UserRole>('guest');
    const [currentUser, setCurrentUser] = useState<Student | Teacher | null>(null);

    const handleLogin = (role: UserRole, user: Student | Teacher) => {
        setUserRole(role);
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setUserRole('guest');
        setCurrentUser(null);
        window.location.hash = '/login';
    };

    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            </Route>

            <Route path="/portal/parent" element={(userRole === 'parent' && currentUser) ? <PortalLayout role="parent" /> : <Navigate to="/login" />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ParentDashboard student={currentUser as Student} />} />
                <Route path="syllabus" element={<SyllabusView />} />
                <Route path="logs" element={<LogsView student={currentUser as Student} />} />
                <Route path="profile" element={<ProfileView user={currentUser!} role="parent" onLogout={handleLogout} />} />
            </Route>

            <Route path="/portal/teacher" element={(userRole === 'teacher' && currentUser) ? <PortalLayout role="teacher" /> : <Navigate to="/login" />}>
                <Route index element={<Navigate to="teacher-home" replace />} />
                <Route path="teacher-home" element={<TeacherDashboard teacher={currentUser as Teacher} />} />
                <Route path="students" element={<TeacherStudentList />} />
                <Route path="add-log" element={<TeacherAddLog />} />
                <Route path="teacher-profile" element={<ProfileView user={currentUser!} role="teacher" onLogout={handleLogout} />} />
            </Route>
        </Routes>
    );
};

const Root = () => (
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Root />);
}