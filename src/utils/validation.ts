// src/utils/validation.ts
// Validation helpers cho thị truong Viet Nam

// SĐT Việt Nam: 10 số, bắt đầu bằng 0
export const isValidPhoneVN = (phone: string): boolean => {
    return /^0\d{9}$/.test(phone.replace(/\s/g, ''));
};

// Email hợp lệ
export const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Tên không rỗng, ít nhất 2 ký tự
export const isValidName = (name: string): boolean => {
    return name.trim().length >= 2;
};

// Biển số xe Việt Nam: 7-9 ký tự (số + chữ)
export const isValidLicensePlate = (plate: string): boolean => {
    const clean = plate.replace(/[\s\-\.]/g, '').toUpperCase();
    return /^\d{2}[A-Z]{1,2}\d{4,5}$/.test(clean);
};

// Mật khẩu: ít nhất 6 ký tự
export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

// Validate form booking
export interface BookingValidation {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    numberOfPeople: number;
}

export const validateBookingForm = (data: BookingValidation): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!isValidName(data.customerName)) {
        errors.customerName = 'Họ tên phải có ít nhất 2 ký tự';
    }
    if (!isValidEmail(data.customerEmail)) {
        errors.customerEmail = 'Email không hợp lệ';
    }
    if (!isValidPhoneVN(data.customerPhone)) {
        errors.customerPhone = 'Số điện thoại phải là 10 số, bắt đầu bằng 0';
    }
    if (data.numberOfPeople < 1 || data.numberOfPeople > 50) {
        errors.numberOfPeople = 'Số người phải từ 1 đến 50';
    }

    return errors;
};

// Validate form đăng ký
export interface RegisterValidation {
    userId: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const validateRegisterForm = (data: RegisterValidation): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.userId || data.userId.trim().length < 3) {
        errors.userId = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!isValidName(data.fullName)) {
        errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }
    if (!isValidEmail(data.email)) {
        errors.email = 'Email không hợp lệ';
    }
    if (!isValidPassword(data.password)) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }

    return errors;
};
