// src/utils/format.ts

// === TIỀN TỆ: 1.200.000 VNĐ ===
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

// === NGÀY THÁNG: DD/MM/YYYY ===
export const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
};

// === NGÀY GIỜ: DD/MM/YYYY HH:mm ===
export const formatDateTime = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

// === BIỂN SỐ XE VIỆT NAM: "51G12345" -> "51G - 123.45" ===
export const formatLicensePlate = (plate: string): string => {
    if (!plate) return '';
    // Xóa khoảng trắng, dấu gạch, dấu chấm
    const clean = plate.replace(/[\s\-\.]/g, '').toUpperCase();
    // Pattern: 2 số + 1 chữ + 5 số (ví dụ: 51G12345)
    const match = clean.match(/^(\d{2})([A-Z])(\d{3})(\d{2})$/);
    if (match) {
        return `${match[1]}${match[2]} - ${match[3]}.${match[4]}`;
    }
    // Pattern: 2 số + 2 chữ + 5 số (ví dụ: 51LD12345)
    const match2 = clean.match(/^(\d{2})([A-Z]{2})(\d{3})(\d{2})$/);
    if (match2) {
        return `${match2[1]}${match2[2]} - ${match2[3]}.${match2[4]}`;
    }
    return plate; // Trả về nguyên bản nếu không khớp
};

// === SỐ ĐIỆN THOẠI VN: "0912345678" -> "0912 345 678" ===
export const formatPhoneVN = (phone: string): string => {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
        return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
    }
    return phone;
};

// === TÍNH SỐ NGÀY (để hiển thị) ===
export const getDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 vì tính cả ngày đi

    if (diffDays === 1) return 'Trong ngày';
    return `${diffDays} ngày ${diffDays - 1} đêm`;
};

// === TÍNH SỐ GIỜ TRƯỚC NGÀY KHỞI HÀNH (cho logic hủy tour) ===
export const getHoursUntilDate = (targetDate: string): number => {
    const target = new Date(targetDate);
    const now = new Date();
    return (target.getTime() - now.getTime()) / (1000 * 60 * 60);
};