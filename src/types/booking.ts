// src/types/booking.ts

/**
 * Booking Status Flow (chuẩn BA):
 *
 *  Pending (Chờ duyệt)
 *     ├── → Confirmed (Đã xác nhận) — Admin duyệt, kiểm tra chỗ trống
 *     │       ├── → Assigned (Đã gán tài xế) — Admin gán tài xế rảnh
 *     │       │       ├── → InProgress (Đang thực hiện) — Tour bắt đầu
 *     │       │       │       └── → Completed (Hoàn thành) — Tour kết thúc, tài xế → available
 *     │       │       └── → Cancelled (Đã hủy) — Hủy trước 24h, tài xế → available
 *     │       └── → Cancelled (Đã hủy)
 *     └── → Cancelled (Đã hủy) — User/Admin hủy khi chưa duyệt
 *
 * Logic hủy tour:
 *  - Hủy trước 24h so với ngày khởi hành: Hoàn tiền 100%
 *  - Hủy trong vòng 24h: Hoàn tiền 50%
 *  - Hủy khi tour đang chạy (InProgress): Không hoàn tiền
 *  - Khi hủy booking có tài xế: Tự động chuyển tài xế → 'available'
 */
export type BookingStatus = 'Pending' | 'Confirmed' | 'Assigned' | 'InProgress' | 'Completed' | 'Cancelled';

export interface AdminBooking {
    id: string;
    tourDepartureId: string;
    userId: string;
    companyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    numberOfGuests: number;
    totalPrice: number;
    bookingDate: string;
    status: BookingStatus;
    driverId?: string | null;
    // === AUDIT FIELDS ===
    createdAt: string;
    updatedAt: string;
}

// Map trạng thái sang tiếng Việt
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
    Pending: 'Chờ duyệt',
    Confirmed: 'Đã xác nhận',
    Assigned: 'Đã gán tài xế',
    InProgress: 'Đang thực hiện',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
};

// Map trạng thái sang màu sắc (Tailwind)
export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Assigned: 'bg-indigo-100 text-indigo-800',
    InProgress: 'bg-cyan-100 text-cyan-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
};

// Các trạng thái hợp lệ tiếp theo từ trạng thái hiện tại
export const BOOKING_NEXT_STATUSES: Record<BookingStatus, BookingStatus[]> = {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Assigned', 'Cancelled'],
    Assigned: ['InProgress', 'Cancelled'],
    InProgress: ['Completed'],
    Completed: [],
    Cancelled: [],
};