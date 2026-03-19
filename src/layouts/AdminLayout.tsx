import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
    ChartBarIcon,
    TagIcon,
    CalendarDaysIcon,
    ClipboardDocumentCheckIcon,
    BanknotesIcon,
    UserGroupIcon,
    UsersIcon,
    ArrowRightEndOnRectangleIcon,
    HomeIcon,
    Bars3Icon, // <-- Icon Hamburger (Mới)
    XMarkIcon,  // <-- Icon Dấu X (Mới)
    Squares2X2Icon // <-- Icon Categories
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from '../components/NotificationBell';

// === Component Sidebar (Đã được nâng cấp) ===
// Chúng ta thêm prop "isOpen"
interface SidebarProps {
    isOpen: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
        { name: 'Quản lý Danh mục', href: '/admin/categories', icon: Squares2X2Icon },
        { name: 'Quản lý Tour (Template)', href: '/admin/tours', icon: TagIcon },
        { name: 'Quản lý Lịch Khởi Hành', href: '/admin/departures', icon: CalendarDaysIcon },
        { name: 'Quản lý Booking', href: '/admin/bookings', icon: ClipboardDocumentCheckIcon },
        { name: 'Kế toán (Doanh thu)', href: '/admin/accounting', icon: BanknotesIcon },
        { name: 'Quản lý Tài xế', href: '/admin/drivers', icon: UserGroupIcon },
        { name: 'Quản lý Người dùng', href: '/admin/users', icon: UsersIcon },
    ];

    return (
        // === SỬA CSS Ở ĐÂY ===
        // Thêm transition-all và duration-300
        // Đổi w-64 (mở) thành w-20 (đóng)
        <div className={`fixed top-0 left-0 h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 z-30 ${isOpen ? 'w-64 p-4' : 'w-20 p-4 items-center'}`}>

            {/* Tiêu đề (ẩn khi đóng) */}
            <div className={`text-2xl font-bold mb-8 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 h-0'}`}>
                Admin Panel
            </div>
            <div className={`text-2xl font-bold mb-8 ${isOpen ? 'hidden' : 'block'}`}>AP</div>

            {/* Nav Menu */}
            <nav className="flex-grow">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        title={item.name} // Hiện tooltip khi sidebar đóng
                        className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <item.icon className="h-6 w-6 flex-shrink-0" />
                        {/* Ẩn text khi sidebar đóng */}
                        <span className={`ml-3 whitespace-nowrap ${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer Sidebar */}
            <div className="mt-auto">
                <Link
                    to="/"
                    title="Về trang User"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-700 text-sm"
                >
                    <HomeIcon className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-3 whitespace-nowrap ${isOpen ? 'block' : 'hidden'}`}>Về trang User</span>
                </Link>
                <button
                    onClick={logout}
                    title="Đăng xuất"
                    className="flex items-center w-full p-3 rounded-lg hover:bg-red-700 text-red-300 hover:text-white text-sm"
                >
                    <ArrowRightEndOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
                    <span className={`ml-3 whitespace-nowrap ${isOpen ? 'block' : 'hidden'}`}>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

// === Component Layout Chính (Đã được nâng cấp) ===
const AdminLayout: React.FC = () => {
    // Thêm state để quản lý đóng/mở
    const [isOpen, setIsOpen] = useState(true); // Mặc định là mở

    return (
        <div className="flex bg-lightgray">
            {/* 1. Sidebar */}
            <Sidebar isOpen={isOpen} />

            {/* 2. Nội dung chính */}
            {/* === SỬA CSS Ở ĐÂY === */}
            {/* Thêm transition-all và duration-300 */}
            {/* Đổi margin-left (ml-64 / ml-20) */}
            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>

                {/* Header của nội dung chính (chứa nút hamburger) */}
                <header className="bg-white shadow-sm sticky top-0 z-20 flex items-center justify-between p-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-700 hover:text-primary"
                    >
                        {/* Hiển thị icon X hoặc icon 3 gạch tùy state */}
                        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>

                    {/* Notification Bell + User info */}
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <Link to="/" className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                            <HomeIcon className="h-4 w-4" />
                            Trang chu
                        </Link>
                    </div>
                </header>

                {/* 3. Trang con (Dashboard, Booking...) */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;