import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { formatCurrency, formatDate, formatPhoneVN } from '../../utils/format';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { ConfirmModal } from '../../components/Modal-Enhanced';
import StatusBadge from '../../components/StatusBadge';
import SearchableComboBox from '../../components/SearchableComboBox';
import type { ComboBoxOption } from '../../components/SearchableComboBox';

import type { AdminBooking, BookingStatus } from '../../types/booking';
import { BOOKING_STATUS_LABELS, BOOKING_NEXT_STATUSES } from '../../types/booking';
import type { Driver } from '../../types/driver';
import type { TourDeparture, TourTemplate } from '../../types/tour';
import { PencilIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';

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

    // Filter theo trạng thái
    const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');

    // Popup xác nhận dùng chung (Yes/No)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const fetchData = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
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

    useEffect(() => { fetchData(); }, [companyId]);

    // === Hàm Helpers ===
    const getTourNameByDepartureId = (departureId: string) => {
        const dep = departures.find(d => d.id === departureId);
        return templates.find(t => t.id === dep?.tourTemplateId)?.name || '...';
    };
    const getDepartureByBooking = (booking: AdminBooking) => {
        return departures.find(d => d.id === booking.tourDepartureId);
    };
    const getDriverName = (driverId: string | null | undefined) => {
        if (!driverId) return 'Chua gan';
        return drivers.find(d => String(d.id) === driverId)?.fullName || '...';
    };
    const availableDrivers = drivers.filter(d => d.driverStatus === 'available');

    // Filtered bookings
    const filteredBookings = filterStatus === 'all'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    // Thống kê nhanh
    const statusCounts = bookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleOpenModal = (booking: AdminBooking) => {
        setCurrentBooking(booking);
        setIsModalOpen(true);
    };

    const handleSaveBooking = async (updatedData: { status: BookingStatus, driverId: string | null }) => {
        if (!currentBooking) return;

        try {
            // 1. Cập nhật trạng thái nếu thay đổi
            if (updatedData.status !== currentBooking.status && updatedData.status !== 'Pending') {
                await apiService.bookings.updateStatus(currentBooking.id, updatedData.status as any);
            }

            // 2. Gán tài xế nếu thay đổi
            if (updatedData.driverId !== currentBooking.driverId) {
                await apiService.bookings.assignDriver(currentBooking.id, updatedData.driverId);
            }

            // 3. Tải lại data
            await fetchData();
        } catch (err) {
            console.error('Loi cap nhat booking', err);
        }
        setIsModalOpen(false);
    };

    const handleDeleteBooking = (bookingId: string) => {
        setConfirmDeleteId(bookingId);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            await apiService.bookings.delete(confirmDeleteId);
            await fetchData();
        } catch (err) {
            console.error('Khong the xoa booking', err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Dang tai danh sach booking...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quan ly Booking</h1>
                <span className="text-sm text-gray-500">{bookings.length} booking</span>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterStatus === 'all'
                            ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border'
                    }`}
                >
                    <FunnelIcon className="h-4 w-4 inline mr-1" />
                    Tat ca ({bookings.length})
                </button>
                {(['Pending', 'Confirmed', 'Assigned', 'InProgress', 'Completed', 'Cancelled'] as BookingStatus[]).map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            filterStatus === s
                                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border'
                        }`}
                    >
                        {BOOKING_STATUS_LABELS[s]} ({statusCounts[s] || 0})
                    </button>
                ))}
            </div>

            {/* Booking Table */}
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ma</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ten Tour</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khach hang</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SDT</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngay dat</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tong tien</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trang thai</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tai xe</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hanh dong</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 text-sm font-mono text-gray-500">#{booking.id}</td>
                            <td className="px-4 py-4 text-sm font-medium">{getTourNameByDepartureId(booking.tourDepartureId)}</td>
                            <td className="px-4 py-4 text-sm">{booking.customerName}</td>
                            <td className="px-4 py-4 text-sm text-gray-500">{formatPhoneVN(booking.customerPhone)}</td>
                            <td className="px-4 py-4 text-sm text-gray-500">{formatDate(booking.bookingDate)}</td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(booking.totalPrice)}</td>
                            <td className="px-4 py-4">
                                <StatusBadge status={booking.status} />
                            </td>
                            <td className="px-4 py-4 text-sm">{getDriverName(booking.driverId)}</td>
                            <td className="px-4 py-4 text-right whitespace-nowrap">
                                <button onClick={() => handleOpenModal(booking)} className="text-primary hover:text-blue-900 mr-3" title="Xem / Sua">
                                    <PencilIcon className="h-5 w-5 inline-block" />
                                </button>
                                <button onClick={() => handleDeleteBooking(booking.id)} className="text-red-600 hover:text-red-900" title="Xoa">
                                    <TrashIcon className="h-5 w-5 inline-block" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                        <tr>
                            <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                                Khong co booking nao{filterStatus !== 'all' ? ` o trang thai "${BOOKING_STATUS_LABELS[filterStatus]}"` : ''}.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal chi tiet Booking */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Chi tiet Booking" size="lg">
                {currentBooking && (
                    <EditBookingForm
                        booking={currentBooking}
                        departure={getDepartureByBooking(currentBooking)}
                        availableDrivers={availableDrivers}
                        allDrivers={drivers}
                        onSave={handleSaveBooking}
                        onCancel={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>

            {/* Popup xac nhan xoa */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xoa booking?"
                message="Viec xoa booking co the khong hoan lai so cho. Ban co chac chan muon xoa?"
                confirmText="Dong y"
                cancelText="Huy"
                type="warning"
            />
        </div>
    );
};

// --- Component Form Sua Booking (nang cap voi SearchableComboBox + Status Flow) ---
interface EditBookingFormProps {
    booking: AdminBooking;
    departure?: TourDeparture;
    availableDrivers: Driver[];
    allDrivers: Driver[];
    onSave: (updatedData: { status: BookingStatus, driverId: string | null }) => void;
    onCancel: () => void;
}

const EditBookingForm: React.FC<EditBookingFormProps> = ({
    booking, departure, availableDrivers, allDrivers, onSave, onCancel
}) => {
    const [status, setStatus] = useState<BookingStatus>(booking.status);
    const [driverId, setDriverId] = useState<string | null>(booking.driverId || null);

    // Lấy các trạng thái hợp lệ tiếp theo + trạng thái hiện tại
    const allowedStatuses: BookingStatus[] = [
        booking.status,
        ...BOOKING_NEXT_STATUSES[booking.status]
    ];

    // Logic kiểm tra: Chỉ cho gán tài xế khi status là Confirmed hoặc Assigned
    const canAssignDriver = status === 'Confirmed' || status === 'Assigned';

    // Tạo options cho SearchableComboBox tài xế
    const driverOptions: ComboBoxOption[] = availableDrivers.map(d => ({
        value: String(d.id),
        label: d.fullName,
        sublabel: `${d.phone || ''}${d.licensePlate ? ' | ' + d.licensePlate : ''} - Sẵn sàng`,
    }));
    // Nếu booking đã gán tài xế nhưng tài xế đã bận, vẫn hiển thị
    if (booking.driverId && !availableDrivers.find(d => String(d.id) === booking.driverId)) {
        const assignedDriver = allDrivers.find(d => String(d.id) === booking.driverId);
        if (assignedDriver) {
            driverOptions.unshift({
                value: String(assignedDriver.id),
                label: assignedDriver.fullName,
                sublabel: `${assignedDriver.phone || ''} - Đã gán (đang bận)`,
            });
        }
    }

    // Logic hủy tour: Cảnh báo nếu hủy gần ngày khởi hành
    const getCancelWarning = (): string | null => {
        if (status !== 'Cancelled') return null;
        if (!departure) return null;

        const hoursUntil = (new Date(departure.startDate).getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntil < 0) return 'Tour da bat dau. Khong hoan tien.';
        if (hoursUntil < 24) return 'Huy trong vong 24h truoc khoi hanh. Chi hoan 50% tien.';
        return 'Huy truoc 24h. Hoan tien 100%.';
    };

    const cancelWarning = getCancelWarning();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Khi chuyển sang Assigned, bắt buộc phải có tài xế
        if (status === 'Assigned' && !driverId) {
            alert('Vui long gan tai xe truoc khi chuyen sang trang thai "Da gan tai xe".');
            return;
        }
        onSave({ status, driverId });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin khách hàng */}
            <div className="p-4 border rounded-xl bg-gray-50 space-y-1">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Khach hang:</strong> {booking.customerName}</p>
                    <p><strong>Email:</strong> {booking.customerEmail}</p>
                    <p><strong>SDT:</strong> {formatPhoneVN(booking.customerPhone)}</p>
                    <p><strong>So khach:</strong> {booking.numberOfGuests} nguoi</p>
                    <p><strong>Ngay dat:</strong> {formatDate(booking.bookingDate)}</p>
                    <p><strong>Tong tien:</strong> <span className="text-red-600 font-bold">{formatCurrency(booking.totalPrice)}</span></p>
                </div>
            </div>

            {/* Trạng thái hiện tại */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Trang thai hien tai:</span>
                <StatusBadge status={booking.status} size="md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cập nhật trạng thái (chỉ hiện các trạng thái hợp lệ) */}
                <div>
                    <label className="label">Chuyen trang thai</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as BookingStatus)}
                        className="input"
                    >
                        {allowedStatuses.map(s => (
                            <option key={s} value={s}>
                                {BOOKING_STATUS_LABELS[s]}
                            </option>
                        ))}
                    </select>

                    {/* Cảnh báo khi hủy */}
                    {cancelWarning && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                            {cancelWarning}
                        </div>
                    )}
                </div>

                {/* Gán tài xế bằng SearchableComboBox */}
                <div>
                    <SearchableComboBox
                        label="Gan tai xe"
                        options={driverOptions}
                        value={driverId}
                        onChange={setDriverId}
                        placeholder="Chon tai xe..."
                        disabled={!canAssignDriver}
                        emptyText="Khong co tai xe ranh"
                    />
                    {!canAssignDriver && (
                        <p className="text-xs text-gray-500 mt-1">
                            Phai "Xac nhan" booking truoc khi gan tai xe.
                        </p>
                    )}
                </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={onCancel} className="btn-secondary">Dong</button>
                <button type="submit" className="btn-primary">Luu thay doi</button>
            </div>
        </form>
    );
};

export default BookingManagementPage;