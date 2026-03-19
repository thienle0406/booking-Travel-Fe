import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { DriverStatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import type { Driver } from '../../types/driver';
import type { AdminBooking } from '../../types/booking';
import { formatCurrency, formatPhoneVN, formatLicensePlate } from '../../utils/format';

const DriverManagementPage: React.FC = () => {
    const { companyId } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [revenueDriver, setRevenueDriver] = useState<Driver | null>(null);
    const [driverBookings, setDriverBookings] = useState<AdminBooking[]>([]);
    const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);

    useEffect(() => {
        if (!companyId) return;
        const fetchDrivers = async () => {
            try {
                const data = await apiService.drivers.getAll(companyId);
                setDrivers(data);
            } catch (err) {
                console.error('Khong the tai danh sach tai xe', err);
            }
        };
        fetchDrivers();
    }, [companyId]);

    const handleViewRevenue = async (driver: Driver) => {
        try {
            const bookings = await apiService.bookings.getByDriver(driver.id);
            setDriverBookings(bookings.filter(b => b.status === 'Confirmed'));
            setRevenueDriver(driver);
            setIsRevenueModalOpen(true);
        } catch (err) {
            console.error('Khong the tai doanh thu theo tai xe', err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý Tài xế</h1>
            <p className="text-gray-500 mb-6 text-sm">
                Để thêm tài xế, vào <strong>Quản lý Người dùng</strong> và đổi vai trò thành "Tài xế".
            </p>

            {drivers.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                    Chưa có tài xế nào. Hãy phân quyền người dùng thành Tài xế trong mục Quản lý Người dùng.
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên tài xế</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biển số xe</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {drivers.map((driver) => (
                            <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{driver.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.phone ? formatPhoneVN(driver.phone) : '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                    {driver.licensePlate ? formatLicensePlate(driver.licensePlate) : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.vehicleInfo || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <DriverStatusBadge status={driver.driverStatus || 'available'} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleViewRevenue(driver)}
                                        className="text-emerald-600 hover:text-emerald-800"
                                    >
                                        Xem doanh thu
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isRevenueModalOpen}
                onClose={() => setIsRevenueModalOpen(false)}
                title={revenueDriver ? `Doanh thu của ${revenueDriver.fullName}` : 'Doanh thu theo tài xế'}
                size="lg"
            >
                <DriverRevenueContent driver={revenueDriver} bookings={driverBookings} />
            </Modal>
        </div>
    );
};

export default DriverManagementPage;

const DriverRevenueContent: React.FC<{ driver: Driver | null; bookings: AdminBooking[] }> = ({ driver, bookings }) => {
    if (!driver) return null;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-lg">{driver.fullName}</p>
                    <p className="text-sm text-gray-600">{driver.phone}</p>
                    {driver.licensePlate && <p className="text-sm text-gray-500">Biển số: {driver.licensePlate}</p>}
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Tổng doanh thu (đã xác nhận)</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
                </div>
            </div>
            <div className="border-t pt-4">
                {bookings.length === 0 ? (
                    <p className="text-gray-500 text-sm">Chưa có booking nào đã xác nhận cho tài xế này.</p>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã Booking</th>
                                <th className="px-4 py-2 text-left">Khách hàng</th>
                                <th className="px-4 py-2 text-left">Ngày đặt</th>
                                <th className="px-4 py-2 text-right">Số tiền</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(b => (
                                <tr key={b.id}>
                                    <td className="px-4 py-2">{b.id}</td>
                                    <td className="px-4 py-2">{b.customerName}</td>
                                    <td className="px-4 py-2">{b.bookingDate}</td>
                                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(b.totalPrice)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
