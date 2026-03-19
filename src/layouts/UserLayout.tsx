// src/layouts/UserLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ZaloButton from '../components/ZaloButton';

const UserLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            {/* Nut bong bong Zalo + Hotline - hien thi tren moi trang user */}
            <ZaloButton />
        </div>
    );
};

export default UserLayout;