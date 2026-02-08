import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const PublicHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Institute', path: '/' },
    { name: 'Curriculum', path: '/programs' },
    { name: 'Exhibitions', path: '/gallery' },
    { name: 'Inquiries', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-surface/95 backdrop-blur-md py-6' : 'bg-transparent py-10'}`}>
      <div className="max-w-[1600px] mx-auto px-8 md:px-16">
        <div className="flex justify-between items-baseline">
          {/* Logo - Pure Typography */}
          <Link to="/" className="group z-50">
            <span className="font-serif text-3xl font-medium tracking-tight leading-none text-primary block">KASH ARTS.</span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-secondary group-hover:text-primary transition-colors duration-500 mt-1 block pl-1">
              Est. 2010
            </span>
          </Link>
          
          {/* Desktop Menu - Minimalist */}
          <div className="hidden md:flex items-center gap-16">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] uppercase tracking-[0.2em] transition-all duration-500 relative ${
                  isActive(link.path) 
                    ? 'text-primary' 
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {link.name}
                {isActive(link.path) && <span className="absolute -bottom-2 left-0 w-full h-px bg-primary transform scale-x-100 transition-transform"></span>}
              </Link>
            ))}
            <Link
              to="/login"
              className="text-[11px] uppercase tracking-[0.2em] border border-primary/20 px-8 py-3 hover:bg-primary hover:text-surface hover:border-primary transition-all duration-500"
            >
              Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-primary focus:outline-none z-50"
          >
            <div className="space-y-2">
                <span className={`block w-10 h-px bg-current transition-transform duration-500 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`block w-10 h-px bg-current transition-opacity duration-500 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-10 h-px bg-current transition-transform duration-500 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-surface z-40 animate-fade-in flex flex-col justify-center px-8">
          <div className="space-y-12 text-center">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-5xl font-serif text-primary hover:text-accent transition-colors italic"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-16 w-full flex justify-center">
                <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-xs uppercase tracking-[0.3em] border-b border-primary pb-2 hover:text-accent transition-colors"
                >
                Portal Access
                </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
