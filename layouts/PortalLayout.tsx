import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { UserRole } from '../types';
import { PortalNavigation } from '../components/Navigation';

export const PortalLayout: React.FC<{ role: UserRole }> = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Determine active tab from URL logic
    let activeTab = 'dashboard';
    if (location.pathname.includes('/teacher-home')) activeTab = 'teacher-home';
    else if (location.pathname.includes('/messages')) activeTab = 'messages';
    else if (location.pathname.includes('/students')) activeTab = 'students';
    else if (location.pathname.includes('/add-log')) activeTab = 'add-log';
    else if (location.pathname.includes('/profile') || location.pathname.includes('/teacher-profile')) activeTab = role === 'parent' ? 'profile' : 'teacher-profile';
    else if (location.pathname.includes('/syllabus')) activeTab = 'syllabus';
    else if (location.pathname.includes('/logs')) activeTab = 'logs';
    else if (location.pathname.includes('/gallery')) activeTab = 'gallery';

    const handleTabChange = (tab: string) => {
        navigate(tab);
    };

    // Scroll to top of content area on route change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.pathname]);

    const isMessages = activeTab === 'messages';

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            <PortalNavigation activeTab={activeTab} setActiveTab={handleTabChange} role={role} />
            <div ref={scrollRef} className={`flex-1 md:ml-64 max-w-[1920px] scroll-smooth ${isMessages ? 'overflow-hidden h-[100dvh] pb-16 md:pb-0' : 'overflow-y-auto no-scrollbar px-6 md:px-12 py-8 pb-32'}`}>
                <Outlet />
            </div>
        </div>
    );
};
