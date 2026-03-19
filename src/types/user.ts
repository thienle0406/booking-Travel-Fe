export type UserRole = 'ADMIN' | 'USER' | 'DRIVER';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface User {
    id: string;
    userId: string;      // Tên đăng nhập
    fullName: string;     // Họ và tên
    email: string;
    role: UserRole;
    companyId: string;

    avatar?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: Gender;

    // Driver-specific fields (only when role = DRIVER)
    licensePlate?: string;
    vehicleInfo?: string;
    driverStatus?: 'available' | 'busy';

    createdAt: string;
    updatedAt: string;
}
