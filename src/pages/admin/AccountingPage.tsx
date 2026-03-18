// src/pages/admin/AccountingPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { exportRevenueToExcel } from '../../utils/ExcelExport';
import type { AdminBooking } from '../../types/booking';
import { formatCurrency } from '../../utils/format';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// Hàm helper để lấy tháng/năm hiện tại dưới dạng "YYYY-MM"
const getDefaultMonthInput = () => {
    return new Date().toISOString().slice(0, 7); // "2025-11"
};

const AccountingPage: React.FC = () => {
    const { companyId } = useAuth();

    // === SỬA STATE: Dùng string "YYYY-MM" ===
    const [selectedDate, setSelectedDate] = useState(getDefaultMonthInput());

    const [revenue, setRevenue] = useState(0);
    const [filteredBookings, setFilteredBookings] = useState<AdminBooking[]>([]);
    const [loading, setLoading] = useState(false);

    // === SỬA LOGIC: Lấy năm và tháng từ state ===
    useEffect(() => {
        if (!companyId || !selectedDate) return;

        // 1. Phân tích "YYYY-MM"
        const [year, month] = selectedDate.split('-').map(Number);
        const selectedYear = year;
        const selectedMonth = month - 1; // JS tháng 0-11, input trả về 1-12

        const fetchRevenue = async () => {
            setLoading(true);
            try {
                // 2. Gọi API với cả năm và tháng
                const bookings = await apiService.bookings.getConfirmedByMonth(
                    companyId,
                    selectedYear,
                    selectedMonth
                );

                const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

                setFilteredBookings(bookings);
                setRevenue(totalRevenue);

            } catch (err) {
                console.error(err);
                alert('Không thể tải báo cáo doanh thu.');
            } finally {
                setLoading(false);
            }
        };

        fetchRevenue();
    }, [selectedDate, companyId]); // Chạy lại khi đổi tháng/năm

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value); // Set "YYYY-MM"
    };

    const handleExport = () => {
        if (filteredBookings.length === 0) {
            alert('Không có dữ liệu để export.');
            return;
        }
        // Tách lại năm và tháng (0-11)
        const [year, month] = selectedDate.split('-').map(Number);
        exportRevenueToExcel(filteredBookings, year, month - 1, revenue);
    };

    // Lấy tháng và năm để hiển thị
    const [displayYear, displayMonth] = selectedDate.split('-');

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Kế toán & Doanh thu</h1>

            {/* === SỬA BỘ LỌC: Dùng input type="month" === */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <label htmlFor="month-year" className="font-medium">Xem doanh thu theo tháng:</label>
                    <input
                        type="month"
                        id="month-year"
                        value={selectedDate}
                        onChange={handleMonthChange}
                        className="border p-2 rounded-md"
                    />
                </div>

                <button
                    onClick={handleExport}
                    className="btn-primary bg-green-600 hover:bg-green-700"
                >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Export Excel
                </button>
            </div>

            {/* Thẻ tổng kết */}
            <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-lg uppercase">Tổng Doanh Thu (Tháng {displayMonth}/{displayYear})</h3>
                <p className="text-4xl font-bold mt-2">{formatCurrency(revenue)}</p>
            </div>

            {/* Bảng chi tiết doanh thu */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Chi tiết Booking (Đã xác nhận)</h2>
                {loading ? <p>Đang tải...</p> : (
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* ... (Phần <thead> giữ nguyên) ... */}
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Ngày đặt</th>
                            <th className="px-6 py-3 text-left">Mã Booking</th>
                            <th className="px-6 py-3 text-left">Khách hàng</th>
                            <th className="px-6 py-3 text-right">Doanh thu</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td className="px-6 py-4">{booking.bookingDate}</td>
                                <td className="px-6 py-4">{booking.id}</td>
                                <td className="px-6 py-4">{booking.customerName}</td>
                                <td className="px-6 py-4 text-right font-medium">{formatCurrency(booking.totalPrice)}</td>
                            </tr>
                        ))}
                        {filteredBookings.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    Không có doanh thu trong tháng {displayMonth}/{displayYear}.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AccountingPage;