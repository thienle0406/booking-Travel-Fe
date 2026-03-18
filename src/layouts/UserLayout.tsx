// src/layouts/UserLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; // Import Header (style "Travo" mới)
import Footer from '../components/Footer'; // Import Footer (style "Travo" mới)

const UserLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {/* Outlet là nơi React Router render các trang con (Page)
          ví dụ: HomePage, ContactPage, PolicyPage...
        */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;