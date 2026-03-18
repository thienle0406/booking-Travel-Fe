// src/types/booking.ts
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
    // Thêm trạng thái 'InProcess' để hỗ trợ flow đang thực hiện (tài xế đang chạy)
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'InProcess';
    driverId?: string | null;
    // === AUDIT FIELDS ===
    createdAt: string;
    updatedAt: string;
}