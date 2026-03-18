import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { formatCurrency } from '../../utils/format';
import type { Driver } from '../../types/driver';
import type { AdminBooking } from '../../types/booking';
import type { User } from '../../types/user';
import { Link } from 'react-router-dom';
import {
    BanknotesIcon,
    UsersIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { DashboardSkeleton } from '../../components/Loading';

const DashboardPage: React.FC = () => {
    const { companyId, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        newBookings: 0,
        totalUsers: 0,
        confirmedBookings: 0,
        revenueGrowth: 0,
        bookingGrowth: 0
    });
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [recentBookings, setRecentBookings] = useState<AdminBooking[]>([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!companyId) return;
            setLoading(true);
            try {
                const [bookingData, userData, driverData] = await Promise.all([
                    apiService.bookings.getAll(companyId),
                    apiService.auth.getAllUsers(companyId) as Promise<User[]>,
                    apiService.drivers.getAll(companyId)
                ]);

                setDrivers(driverData);
                setRecentBookings(bookingData.slice(0, 5)); // Top 5 recent

                const totalRevenue = bookingData
                    .filter((b: AdminBooking) => b.status === 'Confirmed')
                    .reduce((sum: number, b: AdminBooking) => sum + b.totalPrice, 0);

                const newBookingsCount = bookingData.filter((b: AdminBooking) => b.status === 'Pending').length;
                const confirmedCount = bookingData.filter((b: AdminBooking) => b.status === 'Confirmed').length;

                setStats({
                    revenue: totalRevenue,
                    newBookings: newBookingsCount,
                    totalUsers: userData.length,
                    confirmedBookings: confirmedCount,
                    revenueGrowth: 12.5, // Mock data
                    bookingGrowth: 8.3    // Mock data
                });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [companyId]);

    if (loading) return <DashboardSkeleton />;

    const availableDrivers = drivers.filter(d => d.status === 'available').length;
    const busyDrivers = drivers.filter(d => d.status === 'busy').length;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-4xl font-bold mb-2">Chào mừng trở lại, {user?.username}! 👋</h1>
                <p className="text-white/90 text-lg">Đây là tổng quan hoạt động của bạn hôm nay</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng Doanh Thu"
                    value={formatCurrency(stats.revenue)}
                    icon={BanknotesIcon}
                    trend={stats.revenueGrowth}
                    color="blue"
                />
                <StatCard
                    title="Booking Mới"
                    value={stats.newBookings.toString()}
                    icon={ClockIcon}
                    trend={stats.bookingGrowth}
                    color="yellow"
                    link="/admin/bookings"
                />
                <StatCard
                    title="Đã Xác Nhận"
                    value={stats.confirmedBookings.toString()}
                    icon={CheckCircleIcon}
                    trend={5.2}
                    color="green"
                />
                <StatCard
                    title="Người Dùng"
                    value={stats.totalUsers.toString()}
                    icon={UsersIcon}
                    trend={3.1}
                    color="purple"
                    link="/admin/users"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Doanh Thu 7 Ngày Qua</h3>
                    <RevenueChart />
                </div>

                {/* Booking Status */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Trạng Thái Booking</h3>
                    <BookingPieChart
                        confirmed={stats.confirmedBookings}
                        pending={stats.newBookings}
                        cancelled={Math.floor(Math.random() * 10)}
                    />
                </div>
            </div>

            {/* Driver Schedule & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Driver Schedule */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Lịch Tài Xế</h2>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-600">Rảnh ({availableDrivers})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-gray-600">Bận ({busyDrivers})</span>
                            </div>
                        </div>
                    </div>
                    <DriverSchedule drivers={drivers} />
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Gần Đây</h2>
                    <RecentBookingsList bookings={recentBookings} />
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: number;
    color: 'blue' | 'green' | 'yellow' | 'purple';
    link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color, link }) => {
    const colors = {
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        yellow: 'from-yellow-500 to-orange-500',
        purple: 'from-purple-500 to-pink-500'
    };

    const content = (
        <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
            <div className="flex items-start justify-between mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Icon className="h-6 w-6" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? 'text-white' : 'text-red-200'}`}>
                        {trend >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );

    return link ? <Link to={link}>{content}</Link> : content;
};

// Simple Revenue Chart (using CSS bars)
const RevenueChart = () => {
    const data = [
        { day: 'T2', value: 65 },
        { day: 'T3', value: 78 },
        { day: 'T4', value: 90 },
        { day: 'T5', value: 81 },
        { day: 'T6', value: 56 },
        { day: 'T7', value: 95 },
        { day: 'CN', value: 88 }
    ];

    return (
        <div className="h-64 flex items-end justify-between gap-3">
            {data.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gradient-to-t from-pink-500 to-orange-500 rounded-t-lg transition-all hover:from-pink-600 hover:to-orange-600"
                         style={{ height: `${item.value}%` }}
                    />
                    <span className="text-sm text-gray-600 font-medium">{item.day}</span>
                </div>
            ))}
        </div>
    );
};

// Simple Pie Chart (CSS-based)
const BookingPieChart: React.FC<{ confirmed: number; pending: number; cancelled: number }> = ({ confirmed, pending, cancelled }) => {
    const total = confirmed + pending + cancelled;
    const confirmedPercent = Math.round((confirmed / total) * 100);
    const pendingPercent = Math.round((pending / total) * 100);
    const cancelledPercent = 100 - confirmedPercent - pendingPercent;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                    {/* Simple circular progress */}
                    <svg className="transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="20"/>
                        <circle
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="20"
                            strokeDasharray={`${confirmedPercent * 2.51} 251`}
                        />
                        <circle
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="20"
                            strokeDasharray={`${pendingPercent * 2.51} 251`}
                            strokeDashoffset={-confirmedPercent * 2.51}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <p className="text-3xl font-bold text-gray-900">{total}</p>
                        <p className="text-sm text-gray-600">Tổng</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-700">Đã xác nhận</span>
                    </div>
                    <span className="font-bold text-gray-900">{confirmed} ({confirmedPercent}%)</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span className="text-gray-700">Chờ duyệt</span>
                    </div>
                    <span className="font-bold text-gray-900">{pending} ({pendingPercent}%)</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-gray-700">Đã hủy</span>
                    </div>
                    <span className="font-bold text-gray-900">{cancelled} ({cancelledPercent}%)</span>
                </div>
            </div>
        </div>
    );
};

// Driver Schedule Component
const DriverSchedule: React.FC<{ drivers: Driver[] }> = ({ drivers }) => {
    if (drivers.length === 0) {
        return <p className="text-gray-500 text-center py-8">Chưa có tài xế nào</p>;
    }

    return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
            {drivers.map(driver => (
                <div key={driver.id} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${driver.status === 'busy' ? 'bg-red-500' : 'bg-green-500'}`} />
                    <div className="flex-1">
                        <p className="font-bold text-gray-900">{driver.name}</p>
                        <p className="text-sm text-gray-600">{driver.phone}</p>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        driver.status === 'busy'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                    }`}>
                        {driver.status === 'busy' ? 'Đang bận' : 'Rảnh'}
                    </span>
                </div>
            ))}
        </div>
    );
};

// Recent Bookings List
const RecentBookingsList: React.FC<{ bookings: AdminBooking[] }> = ({ bookings }) => {
    if (bookings.length === 0) {
        return <p className="text-gray-500 text-center py-8">Chưa có booking nào</p>;
    }

    return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
            {bookings.map(booking => (
                <div key={booking.id} className="p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="font-bold text-gray-900">{booking.customerName}</p>
                            <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                        }`}>
                            {booking.status}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{booking.bookingDate}</span>
                        <span className="font-bold text-primary">{formatCurrency(booking.totalPrice)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardPage;