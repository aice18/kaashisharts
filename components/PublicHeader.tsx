import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Database } from '../services/database';

export const PublicHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // PWA Install State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Admin Login States
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Listen for PWA install event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setInstallPrompt(null);
        }
      });
    }
  };

  const handleSecretClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setSecretClicks(prev => prev + 1);
      if (secretClicks + 1 === 5) {
          setShowAdminLogin(true);
          setSecretClicks(0);
      }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const user = await Database.login('admin', adminId, adminPass);
      if (user) {
          navigate(`/login?admin_auth=true&id=${adminId}&pass=${adminPass}`);
          setShowAdminLogin(false);
      } else {
          setAdminError("Access Denied");
          setAdminPass('');
      }
  }

  const links = [
    { name: 'Institute', path: '/' },
    { name: 'Curriculum', path: '/programs' },
    { name: 'Exhibitions', path: '/gallery' },
    { name: 'Inquiries', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
    {/* Admin Login Modal Portal */}
    {showAdminLogin && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-[#111] border border-white/20 p-8 w-full max-w-sm rounded-sm shadow-2xl relative">
                <button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>
                <div className="mb-6 text-center">
                    <span className="text-4xl">👁️</span>
                    <h2 className="text-white font-serif text-xl mt-4">Administrator Access</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Restricted Area</p>
                </div>
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Operator ID" 
                        className="w-full bg-white/5 border border-white/10 p-3 text-white placeholder-white/20 outline-none focus:border-white/50 text-center uppercase tracking-widest text-xs"
                        value={adminId}
                        onChange={e => setAdminId(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Passcode" 
                        className="w-full bg-white/5 border border-white/10 p-3 text-white placeholder-white/20 outline-none focus:border-white/50 text-center uppercase tracking-widest text-xs"
                        value={adminPass}
                        onChange={e => setAdminPass(e.target.value)}
                    />
                    {adminError && <p className="text-red-500 text-xs text-center">{adminError}</p>}
                    <button className="w-full bg-white text-black py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-gray-200 transition-colors">
                        Unlock
                    </button>
                </form>
            </div>
        </div>,
        document.body
    )}

    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-surface/95 backdrop-blur-md py-6' : 'bg-transparent py-10'}`}>
      <div className="max-w-[1600px] mx-auto px-8 md:px-16">
        <div className="flex justify-between items-baseline">
          {/* Logo - Pure Typography */}
          <Link to="/" className="group z-50">
            <span className="font-serif text-3xl font-medium tracking-tight leading-none text-primary block">KASH ARTS.</span>
            <span 
                onClick={handleSecretClick}
                className="text-[9px] uppercase tracking-[0.4em] text-secondary group-hover:text-primary transition-colors duration-500 mt-1 block pl-1 cursor-default select-none"
            >
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
            
            {/* PWA Install Button (Only shows if installable) */}
            {installPrompt && (
              <button
                onClick={handleInstallClick}
                className="text-[10px] uppercase tracking-[0.2em] text-cobalt hover:text-primary transition-colors font-bold animate-pulse"
              >
                Install App
              </button>
            )}

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
             {installPrompt && (
              <button
                onClick={() => { handleInstallClick(); setIsOpen(false); }}
                className="block w-full text-center text-xl font-serif text-cobalt hover:text-primary transition-colors italic mt-4"
              >
                Install App
              </button>
            )}
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
    </>
  );
};