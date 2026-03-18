export type UserRole = 'ADMIN' | 'USER';

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    companyId: string;

    avatar?: string;
    phone?: string;
    address?: string;

    createdAt: string;
    updatedAt: string;
}