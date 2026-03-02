import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

export const PublicLayout = () => (
    <div className="min-h-screen bg-background text-primary font-sans selection:bg-cobalt selection:text-white pb-20 md:pb-0">
        <ScrollToTop />
        <main>
            <Outlet />
        </main>
    </div>
);
