import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import type { AdminBooking } from '../types/booking';
import { formatCurrency } from '../utils/format';
import { TruckIcon, BanknotesIcon, ClipboardDocumentCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const DriverDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await apiService.drivers.getMyBookings();
                setBookings(data);
            } catch (err) {
                console.error('Khong the tai booking', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Assigned');
    const completedBookings = bookings.filter(b => b.status === 'Completed');
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
                    <div className="flex items-center gap-4">
                        <TruckIcon className="h-12 w-12" />
                        <div>
                            <h1 className="text-3xl font-bold">Xin chào, {user?.fullName}!</h1>
                            <p className="text-white/80 mt-1">
                                {user?.licensePlate && `Biển số: ${user.licensePlate}`}
                                {user?.vehicleInfo && ` - ${user.vehicleInfo}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-500" />
                            <span className="text-gray-600">Tour đang gán</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{confirmedBookings.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircleIcon className="h-8 w-8 text-green-500" />
                            <span className="text-gray-600">Tour hoàn thành</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{completedBookings.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <BanknotesIcon className="h-8 w-8 text-emerald-500" />
                            <span className="text-gray-600">Tổng doanh thu</span>
                        </div>
                        <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</p>
                    </div>
                </div>

                {/* Current Bookings */}
                <div className="bg-white rounded-xl shadow mb-8">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">Tour được gán</h2>
                    </div>
                    {confirmedBookings.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Chưa có tour nào được gán cho bạn.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số khách</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Giá tour</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {confirmedBookings.map(b => (
                                    <tr key={b.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium">#{b.id}</td>
                                        <td className="px-6 py-4 text-sm">{b.customerName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{b.customerPhone}</td>
                                        <td className="px-6 py-4 text-sm">{b.numberOfGuests} người</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-medium">{formatCurrency(b.totalPrice)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Completed Bookings */}
                {completedBookings.length > 0 && (
                    <div className="bg-white rounded-xl shadow">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">Lịch sử tour đã hoàn thành</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Doanh thu</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {completedBookings.map(b => (
                                    <tr key={b.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium">#{b.id}</td>
                                        <td className="px-6 py-4 text-sm">{b.customerName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{b.bookingDate}</td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-emerald-600">{formatCurrency(b.totalPrice)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverDashboardPage;
