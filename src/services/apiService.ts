import apiClient from './apiClient';
import type { TourTemplate, TourDeparture, Tour } from '../types/tour';
import type { AdminBooking } from '../types/booking';
import type { User } from '../types/user';

export const apiService = {

    // --- Authentication & User Management ---
    auth: {
        login: async (username: string, password: string): Promise<{ token: string, user: User }> => {
            console.log('API CALL: POST /auth/login');
            const response = await apiClient.post('/auth/login', { username, password });
            return response.data;
        },

        register: async (data: { username: string, email: string, password: string, companyId: string }) => {
            console.log("API CALL: POST /auth/register");
            const response = await apiClient.post('/auth/register', data);
            return response.data;
        },

        updateProfile: async (userId: string, data: { username: string, email: string }): Promise<User> => {
            console.log("API CALL: PUT /users/" + userId + "/profile");
            const response = await apiClient.put(`/users/${userId}/profile`, data);
            return response.data;
        },

        changePassword: async (userId: string, data: { oldPassword: string, newPassword: string }) => {
            console.log("API CALL: PUT /users/" + userId + "/change-password");
            const response = await apiClient.put(`/users/${userId}/change-password`, data);
            return response.data;
        },

        getAllUsers: async (companyId: string): Promise<User[]> => {
            console.log("API CALL: POST /users/list");
            const response = await apiClient.post('/users/list', { companyId });
            return response.data;
        }
    },

    // --- Users (Admin) ---
    users: {
        updateAdmin: async (id: number, data: Partial<User>) => {
            const response = await apiClient.put(`/users/${id}/admin`, data);
            return response.data;
        },
        delete: async (id: number) => {
            await apiClient.delete(`/users/${id}`);
        }
    },


    // --- Tour Templates (Sản phẩm Tour) ---
    tourTemplates: {
        getAll: async (companyId: string): Promise<TourTemplate[]> => {
            const response = await apiClient.post('/tour-templates/list', { companyId });
            return response.data;
        },
        getOne: async (id: string): Promise<TourTemplate> => {
            const response = await apiClient.post('/tour-templates/detail', { id });
            return response.data;
        },
        create: async (data: Omit<TourTemplate, 'id'>) => {
            const response = await apiClient.post('/tour-templates', data);
            return response.data;
        },
        update: async (id: string, data: TourTemplate) => {
            const response = await apiClient.put(`/tour-templates/${id}`, data);
            return response.data;
        },
        delete: async (id: string) => {
            await apiClient.delete(`/tour-templates/${id}`);
        },
    },

    // --- Tour Departures (Lịch Khởi Hành) ---
    tourDepartures: {
        getAll: async (companyId: string): Promise<TourDeparture[]> => {
            const response = await apiClient.post('/tour-departures/list', { companyId });
            return response.data;
        },
        getOne: async (id: string): Promise<TourDeparture> => {
            const response = await apiClient.post('/tour-departures/detail', { id });
            return response.data;
        },
        create: async (data: Omit<TourDeparture, 'id' | 'bookedSlots' | 'companyId'>, companyId: string) => {
            const response = await apiClient.post('/tour-departures', { ...data, companyId });
            return response.data;
        },
        update: async (id: string, data: Partial<TourDeparture>) => {
            const response = await apiClient.put(`/tour-departures/${id}`, data);
            return response.data;
        },
        delete: async (id: string) => {
            await apiClient.delete(`/tour-departures/${id}`);
        },
        getDriverManifest: async (departureId: string) => {
            const response = await apiClient.post('/tour-departures/manifest', { departureId });
            return response.data;
        },
        getJoinedDepartures: async (companyId: string, categoryId?: string | null, destination?: string | null): Promise<Tour[]> => {
            const response = await apiClient.post('/tours/search', { companyId, categoryId, destination });
            return response.data;
        }
    },

    // --- Bookings ---
    bookings: {
        getAll: async (companyId: string): Promise<AdminBooking[]> => {
            const response = await apiClient.post('/bookings/list', { companyId });
            return response.data;
        },

        getByUserId: async (userId: string): Promise<AdminBooking[]> => {
            const response = await apiClient.post('/bookings/my-bookings', { userId });
            return response.data;
        },

        getConfirmedByMonth: async (companyId: string, year: number, month: number): Promise<AdminBooking[]> => {
            const response = await apiClient.post('/bookings/revenue-report', { companyId, year, month });
            return response.data;
        },

        // ✅ FIXED: Method name matches BookingPage usage
        create: async (companyId: string, bookingData: {
            tourDepartureId: string;
            customerId: string;
            customerName: string;
            customerEmail: string;
            customerPhone: string;
            numberOfPeople: number;
            totalPrice: number;
            specialRequests?: string;
            status: string;
            bookingDate: string;
            paymentMethod?: string;
            paymentStatus?: string;
        }) => {
            console.log('API CALL: POST /bookings');

            // Map frontend fields to backend fields
            const backendData = {
                tourDepartureId: bookingData.tourDepartureId,
                userId: bookingData.customerId,
                companyId: companyId,
                customerName: bookingData.customerName,
                customerEmail: bookingData.customerEmail,
                customerPhone: bookingData.customerPhone,
                numberOfGuests: bookingData.numberOfPeople, // ✅ Map to backend field name
                totalPrice: bookingData.totalPrice,
                // Backend might not have these fields, but we send them anyway
                specialRequests: bookingData.specialRequests,
                status: bookingData.status,
                bookingDate: bookingData.bookingDate,
                paymentMethod: bookingData.paymentMethod,
                paymentStatus: bookingData.paymentStatus
            };

            const response = await apiClient.post('/bookings', backendData);
            return response.data;
        },

        updateStatus: async (id: string, status: 'Confirmed' | 'Assigned' | 'InProgress' | 'Completed' | 'Cancelled' | 'InProcess') => {
            const response = await apiClient.put(`/bookings/${id}/status`, { status });
            return response.data;
        },

        assignDriver: async (bookingId: string, driverId: string | null) => {
            const response = await apiClient.put(`/bookings/${bookingId}/assign-driver`, { driverId });
            return response.data;
        },

        // Xóa booking (Admin)
        delete: async (bookingId: string) => {
            await apiClient.delete(`/bookings/${bookingId}`);
        },

        // Lấy booking theo tài xế (để xem doanh thu tour do tài xế chạy)
        getByDriver: async (driverId: string): Promise<AdminBooking[]> => {
            const response = await apiClient.get(`/bookings/by-driver/${driverId}`);
            return response.data;
        }
    },

    // --- Drivers ---
    drivers: {
        getAll: async (companyId: string) => {
            const response = await apiClient.post('/drivers/list', { companyId });
            return response.data;
        },
        create: async (data: { name: string; phone: string; licensePlate?: string; vehicleInfo?: string; status: 'available' | 'busy'; companyId: string }) => {
            const response = await apiClient.post('/drivers', data);
            return response.data;
        },
        update: async (id: string, data: { name: string; phone: string; licensePlate?: string; vehicleInfo?: string; status: 'available' | 'busy'; companyId: string }) => {
            const response = await apiClient.put(`/drivers/${id}`, data);
            return response.data;
        },
        delete: async (id: string) => {
            await apiClient.delete(`/drivers/${id}`);
        }
    },

    // --- Categories ---
    categories: {
        getAll: async (companyId: string) => {
            const response = await apiClient.post('/categories/list', { companyId });
            return response.data;
        },
        getOne: async (id: string) => {
            const response = await apiClient.get(`/categories/${id}`);
            return response.data;
        },
        create: async (data: { name: string; companyId: string; imageUrl?: string }) => {
            const response = await apiClient.post('/categories', data);
            return response.data;
        },
        update: async (id: string, data: { name: string; imageUrl?: string }) => {
            const response = await apiClient.put(`/categories/${id}`, data);
            return response.data;
        },
        delete: async (id: string) => {
            await apiClient.delete(`/categories/${id}`);
        }
    },

    // --- File Upload ---
    files: {
        /**
         * Upload file ảnh lên server.
         * Nếu truyền thêm folder, BE sẽ lưu vào subfolder tương ứng, ví dụ:
         *  - folder = "Biển đảo" -> thư mục "biendao" trong ./uploads/images/biendao
         *  - URL trả về: /uploads/images/biendao/xxx.jpg
         */
        upload: async (file: File, folder?: string): Promise<string> => {
            const formData = new FormData();
            formData.append('file', file);
            if (folder) {
                formData.append('folder', folder);
            }
            // Interceptor sẽ tự động xóa Content-Type header khi detect FormData
            const response = await apiClient.post('/files/upload', formData);
            return response.data;
        }
    },
};