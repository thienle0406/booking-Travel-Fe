// src/components/NotificationBell.tsx
// Icon chuong thong bao voi badge do + dropdown danh sach
import { useState, useEffect, useRef } from 'react';
import { BellIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { wsService, type WsNotification } from '../services/websocket';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';

const NotificationBell = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [notifications, setNotifications] = useState<WsNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Ket noi WebSocket khi dang nhap
    useEffect(() => {
        if (!user) return;

        wsService.connect(String(user.id), user.role);

        const unsubscribe = wsService.onNotification((notification) => {
            setNotifications(prev => [notification, ...prev].slice(0, 50));
            setUnreadCount(prev => prev + 1);

            // Hien toast thong bao
            if (notification.type === 'NEW_BOOKING') {
                toast.info(notification.title + ': ' + notification.message);
            } else if (notification.type === 'BOOKING_CONFIRMED') {
                toast.success(notification.title);
            } else if (notification.type === 'BOOKING_CANCELLED') {
                toast.warning(notification.title);
            } else if (notification.type === 'DRIVER_ASSIGNED') {
                toast.info(notification.title);
            } else {
                toast.info(notification.title);
            }
        });

        return () => {
            unsubscribe();
            wsService.disconnect();
        };
    }, [user]);

    // Dong dropdown khi click ra ngoai
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClickNotification = (noti: WsNotification) => {
        setIsOpen(false);
        if (user?.role === 'ADMIN') {
            navigate('/admin/bookings');
        } else {
            navigate('/my-bookings');
        }
    };

    const markAllRead = () => {
        setUnreadCount(0);
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return 'Vua xong';
        if (diffMin < 60) return diffMin + ' phut truoc';
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return diffHour + ' gio truoc';
        return date.toLocaleDateString('vi-VN');
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'NEW_BOOKING': return '🆕';
            case 'BOOKING_CONFIRMED': return '✅';
            case 'BOOKING_CANCELLED': return '❌';
            case 'BOOKING_COMPLETED': return '🎉';
            case 'DRIVER_ASSIGNED': return '🚗';
            default: return '📢';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Nut chuong */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-600 hover:text-primary transition-colors p-1"
            >
                {unreadCount > 0 ? (
                    <BellAlertIcon className="h-6 w-6 animate-bounce-slow" />
                ) : (
                    <BellIcon className="h-6 w-6" />
                )}

                {/* Badge do */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs
                                     rounded-full min-w-[20px] h-5 flex items-center justify-center
                                     font-bold px-1 shadow-lg">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown danh sach thong bao */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl
                                border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-orange-50
                                    flex justify-between items-center border-b">
                        <h3 className="font-bold text-gray-900">
                            Thong bao
                            {unreadCount > 0 && (
                                <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                    {unreadCount} moi
                                </span>
                            )}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                Doc tat ca
                            </button>
                        )}
                    </div>

                    {/* Danh sach */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">Chua co thong bao nao</p>
                            </div>
                        ) : (
                            notifications.map((noti, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleClickNotification(noti)}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer
                                               border-b border-gray-50 transition-colors
                                               flex gap-3 items-start"
                                >
                                    <span className="text-lg flex-shrink-0 mt-0.5">
                                        {getTypeIcon(noti.type)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-900 truncate">
                                            {noti.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                            {noti.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatTime(noti.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
