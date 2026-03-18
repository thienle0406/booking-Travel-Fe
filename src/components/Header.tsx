import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingCartIcon,
    UserCircleIcon,
    PhoneIcon,
    ArrowRightEndOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    MapIcon,
    DocumentTextIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Sticky header on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Trang chủ', href: '/', icon: HomeIcon },
        { name: 'Danh sách Tour', href: '/tours', icon: MapIcon },
        { name: 'Chính sách', href: '/policy', icon: DocumentTextIcon },
        { name: 'Liên hệ', href: '/contact', icon: EnvelopeIcon },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
                        : 'bg-white shadow-sm py-4'
                }`}
            >
                <nav className="container mx-auto px-4 flex justify-between items-center">

                    {/* Logo */}
                    <Link
                        to="/"
                        className={`text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent transition-all duration-300 ${
                            isScrolled ? 'text-2xl' : 'text-3xl'
                        }`}
                    >
                        MyTour
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="text-gray-700 hover:text-primary font-medium transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-600 to-orange-600 group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    {/* Cart */}
                                    <button className="text-gray-600 hover:text-primary transition-colors relative">
                                        <ShoppingCartIcon className="h-6 w-6" />
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            0
                                        </span>
                                    </button>

                                    {/* User Dropdown */}
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                                            <UserCircleIcon className="h-6 w-6" />
                                            <span className="font-medium">{user?.username}</span>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-primary transition-colors"
                                                >
                                                    Hồ sơ của tôi
                                                </Link>
                                                <Link
                                                    to="/my-bookings"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-primary transition-colors"
                                                >
                                                    Tour của tôi
                                                </Link>
                                                {user?.role === 'ADMIN' && (
                                                    <Link
                                                        to="/admin/dashboard"
                                                        className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-primary transition-colors"
                                                    >
                                                        Trang Admin
                                                    </Link>
                                                )}
                                                <hr className="my-2" />
                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-primary font-medium transition-colors"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-primary text-sm px-4 py-2"
                                    >
                                        Đăng ký
                                    </Link>
                                </>
                            )}

                            {/* Hotline */}
                            <a
                                href="tel:+00232677"
                                className="hidden lg:flex items-center bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                <PhoneIcon className="h-5 w-5 mr-2"/>
                                +00 232 677
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-700 hover:text-primary transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">Menu</h2>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        {isAuthenticated && (
                            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                <UserCircleIcon className="h-10 w-10 text-white" />
                                <div>
                                    <p className="text-white font-bold">{user?.username}</p>
                                    <p className="text-white/80 text-sm">{user?.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-primary transition-all group"
                                >
                                    <link.icon className="h-5 w-5 text-gray-400 group-hover:text-primary" />
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            ))}
                        </div>

                        {isAuthenticated && (
                            <>
                                <hr className="my-4" />
                                <div className="space-y-2">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-primary transition-all"
                                    >
                                        <UserCircleIcon className="h-5 w-5" />
                                        <span className="font-medium">Hồ sơ</span>
                                    </Link>
                                    <Link
                                        to="/my-bookings"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-primary transition-all"
                                    >
                                        <ShoppingCartIcon className="h-5 w-5" />
                                        <span className="font-medium">Tour của tôi</span>
                                    </Link>
                                    {user?.role === 'ADMIN' && (
                                        <Link
                                            to="/admin/dashboard"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-primary transition-all"
                                        >
                                            <span className="font-medium">Trang Admin</span>
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </nav>

                    {/* Footer */}
                    <div className="p-6 border-t">
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
                            >
                                <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                                Đăng xuất
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-center border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-center btn-primary py-3"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content jump */}
            <div className="h-16 md:h-20" />
        </>
    );
};

export default Header;