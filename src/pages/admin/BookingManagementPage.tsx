import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { formatCurrency } from '../../utils/format';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { ConfirmModal } from '../../components/Modal-Enhanced';

import type { AdminBooking } from '../../types/booking';
import type { Driver } from '../../types/driver';
import type { TourDeparture } from '../../types/tour';
import type { TourTemplate } from '../../types/tour';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Thêm Icon Xóa

const BookingManagementPage: React.FC = () => {
    const { companyId } = useAuth();

    // States cho data
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [departures, setDepartures] = useState<TourDeparture[]>([]);
    const [templates, setTemplates] = useState<TourTemplate[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    // States cho UI
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState<AdminBooking | null>(null);

    // Popup xác nhận dùng chung (Yes/No)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const fetchData = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            // Gọi song song 4 API
            // API Thật: POST /api/v1/bookings/list
            const [bookingData, departureData, templateData, driverData] = await Promise.all([
                apiService.bookings.getAll(companyId),
                apiService.tourDepartures.getAll(companyId),
                apiService.tourTemplates.getAll(companyId),
                apiService.drivers.getAll(companyId)
            ]);
            setBookings(bookingData);
            setDepartures(departureData);
            setTemplates(templateData);
            setDrivers(driverData);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchData();
    }, [companyId]);

    // === Hàm Helpers (giữ nguyên) ===
    const getTourNameByDepartureId = (departureId: string) => {
        const dep = departures.find(d => d.id === departureId);
        return templates.find(t => t.id === dep?.tourTemplateId)?.name || '...';
    };
    const getDriverName = (driverId: string | null | undefined) => {
        if (!driverId) return 'Chưa gán';
        return drivers.find(d => d.id === driverId)?.name || '...';
    };
    const availableDrivers = drivers.filter(d => d.status === 'available');
    // ===================================

    const handleOpenModal = (booking: AdminBooking) => {
        setCurrentBooking(booking);
        setIsModalOpen(true);
    };

    const handleSaveBooking = async (updatedData: { status: AdminBooking['status'], driverId: string | null }) => {
        if (!currentBooking) return;

        if (updatedData.status !== currentBooking.status) {

            // Trạng thái 'Pending' chỉ là chờ duyệt, BE chỉ xử lý khi khác Pending
            if (updatedData.status !== 'Pending') {
                try {
                    // Tới đây, updatedData.status có thể là 'Confirmed' | 'Cancelled' | 'InProcess'
                    await apiService.bookings.updateStatus(currentBooking.id, updatedData.status);
                } catch (err) { alert('Lỗi khi cập nhật trạng thái'); }
            }
            // GHI CHÚ: Nếu Admin chọn lại 'Pending', ta bỏ qua vì BE không xử lý
        }

        // 2. Gán tài xế
        if (updatedData.driverId !== currentBooking.driverId) {
            try {
                // API Thật: PUT /api/v1/bookings/:id/assign-driver
                await apiService.bookings.assignDriver(currentBooking.id, updatedData.driverId);
            } catch (err) { alert('Lỗi khi gán tài xế'); }
        }

        // 3. Tải lại data
        await fetchData();
        setIsModalOpen(false);
    };

    // Mở popup xác nhận xóa
    const handleDeleteBooking = (bookingId: string) => {
        setConfirmDeleteId(bookingId);
        setIsConfirmOpen(true);
    };

    // Thực hiện xóa sau khi user chọn "Đồng ý"
    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            await apiService.bookings.delete(confirmDeleteId);
            await fetchData();
        } catch (err) {
            // Có thể dùng Toast ở đây nếu muốn
            console.error('Không thể xóa booking', err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    if (loading) return <div>Đang tải danh sách booking...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Booking</h1>
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left">Mã Booking</th>
                        <th className="px-6 py-3 text-left">Tên Tour</th>
                        <th className="px-6 py-3 text-left">Khách hàng</th>
                        <th className="px-6 py-3 text-left">Trạng thái</th>
                        <th className="px-6 py-3 text-left">Tài xế</th>
                        <th className="px-6 py-3 text-right">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td className="px-6 py-4">{booking.id}</td>
                            <td className="px-6 py-4">{getTourNameByDepartureId(booking.tourDepartureId)}</td>
                            <td className="px-6 py-4">{booking.customerName}</td>
                            <td className="px-6 py-4">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        booking.status === 'Confirmed'
                                            ? 'bg-green-100 text-green-800'
                                            : booking.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : booking.status === 'InProcess'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {booking.status === 'Pending'
                                        ? 'Chờ duyệt'
                                        : booking.status === 'Confirmed'
                                            ? 'Đã duyệt'
                                            : booking.status === 'InProcess'
                                                ? 'Đang thực hiện'
                                                : 'Đã hủy'}
                                </span>
                            </td>
                            <td className="px-6 py-4">{getDriverName(booking.driverId)}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">

                                <button onClick={() => handleOpenModal(booking)} className="text-primary hover:text-blue-900 mr-4" title="Xem / Sửa">
                                    <PencilIcon className="h-5 w-5 inline-block" />
                                </button>

                                {/* === NÚT XÓA ĐÃ ĐƯỢC BỔ SUNG === */}
                                <button onClick={() => handleDeleteBooking(booking.id)} className="text-red-600 hover:text-red-900" title="Xóa">
                                    <TrashIcon className="h-5 w-5 inline-block" />
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Chi tiết Booking" size="lg">
                {currentBooking && (
                    <EditBookingForm
                        booking={currentBooking}
                        availableDrivers={availableDrivers}
                        onSave={handleSaveBooking}
                        onCancel={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>

            {/* Popup xác nhận dùng chung (warning Yes/No) */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa booking?"
                message="Việc xóa booking có thể không hoàn lại số chỗ. Bạn có chắc chắn muốn xóa?"
                confirmText="Đồng ý"
                cancelText="Hủy"
                type="warning"
            />
        </div>
    );
};

// --- Component Form Sửa Booking (Giữ nguyên) ---
interface EditBookingFormProps {
    booking: AdminBooking;
    availableDrivers: Driver[];
    onSave: (updatedData: { status: AdminBooking['status'], driverId: string | null }) => void;
    onCancel: () => void;
}
const EditBookingForm: React.FC<EditBookingFormProps> = ({ booking, availableDrivers, onSave, onCancel }) => {
    const [status, setStatus] = useState(booking.status);
    const [driverId, setDriverId] = useState(booking.driverId || null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ status, driverId });
    };

    const getDriverName = (driverId: string | null | undefined) => {
        if (!driverId) return 'Chưa gán';
        return availableDrivers.find(d => d.id === driverId)?.name || 'Đã gán';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-md bg-gray-50">
                <p><strong>Khách hàng:</strong> {booking.customerName}</p>
                <p><strong>Email:</strong> {booking.customerEmail}</p>
                <p><strong>SĐT:</strong> {booking.customerPhone}</p>
                <p><strong>Số khách:</strong> {booking.numberOfGuests}</p>
                <p><strong>Tổng tiền:</strong> {formatCurrency(booking.totalPrice)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="label">Cập nhật Trạng thái</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as AdminBooking['status'])}
                        className="input"
                    >
                        <option value="Pending">Chờ duyệt</option>
                        <option value="Confirmed">Đã xác nhận</option>
                        <option value="InProcess">Đang thực hiện</option>
                        <option value="Cancelled">Đã hủy</option>
                    </select>
                </div>

                <div>
                    <label className="label">Gán Tài xế (Chỉ tài xế rảnh)</label>
                    <select value={driverId || ''} onChange={(e) => setDriverId(e.target.value || null)} className="input" disabled={status !== 'Confirmed'}>
                        <option value="">Chưa gán</option>
                        {/* Lựa chọn tài xế đã gán (kể cả khi đã bận) */}
                        {booking.driverId && !availableDrivers.find(d => d.id === booking.driverId) && (
                            <option value={booking.driverId} disabled>
                                {getDriverName(booking.driverId)} (Đã gán)
                            </option>
                        )}
                        {availableDrivers.map(driver => (
                            <option key={driver.id} value={driver.id}>
                                {driver.name} (Rảnh)
                            </option>
                        ))}
                    </select>
                    {status !== 'Confirmed' && (
                        <p className="text-xs text-gray-500 mt-1">Phải "Xác nhận" booking trước khi gán tài xế.</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
                <button type="button" onClick={onCancel} className="btn-secondary">Đóng</button>
                <button type="submit" className="btn-primary">Lưu thay đổi</button>
            </div>
        </form>
    );
}

export default BookingManagementPage;