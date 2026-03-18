// src/data/mockData.ts
import type {TourCategory} from "../types/category.ts";
import type {TourDeparture, TourTemplate} from "../types/tour.ts";
import type {AdminBooking} from "../types/booking.ts";
import type {Driver} from "../types/driver.ts";

const COMPANY_ID = 'company_1';

// === CATEGORIES (Giữ nguyên) ===
export const mockCategories: TourCategory[] = [
    { id: 'cat_1', name: 'Du thuyền', companyId: COMPANY_ID },
    { id: 'cat_2', name: 'Văn hóa', companyId: COMPANY_ID },
    { id: 'cat_3', name: 'Leo núi', companyId: COMPANY_ID },
    { id: 'cat_4', name: 'Biển đảo', companyId: COMPANY_ID },
    { id: 'cat_5', name: 'Dã ngoại', companyId: COMPANY_ID },
];

// === TOUR TEMPLATES (Đã thêm discountPercent) ===
export const mockTourTemplates: TourTemplate[] = [
    {
        id: 'tpl_1',
        name: 'Tour Du Lịch Hạ Long 5 Sao',
        destination: 'Hạ Long',
        categoryId: 'cat_1',
        companyId: COMPANY_ID,
        description: '<h1>Tour Hạ Long</h1><p>Khám phá di sản...</p>',
        imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        defaultPrice: 3500000,
        discountPercent: 10, // <-- GIẢM 10%
    },
    {
        id: 'tpl_2',
        name: 'Khám Phá Đà Nẵng - Hội An',
        destination: 'Đà Nẵng',
        categoryId: 'cat_2',
        companyId: COMPANY_ID,
        description: '<h1>Đà Nẵng - Hội An</h1><p>Trải nghiệm...</p>',
        imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        defaultPrice: 5000000,
        discountPercent: 0, // <-- Không giảm
    },
    {
        id: 'tpl_3',
        name: 'Chinh Phục Sapa - Fansipan',
        destination: 'Sapa',
        categoryId: 'cat_3',
        companyId: COMPANY_ID,
        description: '<h1>Sapa</h1><p>Chinh phục...</p>',
        imageUrl: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800',
        defaultPrice: 3800000,
        discountPercent: 15, // <-- GIẢM 15%
    },
];

// === TOUR DEPARTURES (Giá đã tự động giảm) ===
export const mockTourDepartures: TourDeparture[] = [
    {
        id: 'dep_1',
        tourTemplateId: 'tpl_1',
        companyId: COMPANY_ID,
        startDate: '2025-11-20',
        endDate: '2025-11-21',
        originalPrice: 3500000,
        discountPercent: 10,
        price: 3150000, // <-- Giá đã giảm 10%
        totalSlots: 20,
        bookedSlots: 5,
        status: 'Confirmed',
    },
    {
        id: 'dep_2',
        tourTemplateId: 'tpl_2',
        companyId: COMPANY_ID,
        startDate: '2025-11-25',
        endDate: '2025-11-28',
        originalPrice: 5200000,
        discountPercent: 0,
        price: 5200000, // <-- Giá không giảm
        totalSlots: 30,
        bookedSlots: 10,
        status: 'Confirmed',
    },
    {
        id: 'dep_3',
        tourTemplateId: 'tpl_3',
        companyId: COMPANY_ID,
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        originalPrice: 3800000,
        discountPercent: 15,
        price: 3230000, // <-- Giá đã giảm 15%
        totalSlots: 25,
        bookedSlots: 25,
        status: 'Confirmed',
    },
];

// === BOOKINGS ===
export const mockBookings: AdminBooking[] = [
    {
        id: 'bkg_1',
        tourDepartureId: 'dep_1', // Đặt tour Hạ Long (đã giảm giá)
        userId: 'user_1',
        companyId: COMPANY_ID,
        customerName: 'Nguyễn Văn A',
        customerEmail: 'a@example.com',
        customerPhone: '0901234567',
        numberOfGuests: 2,
        totalPrice: 6300000, // 3.150.000 * 2
        bookingDate: '2025-11-01',
        status: 'Confirmed',
        driverId: 'dr_1',
    },
    {
        id: 'bkg_2',
        tourDepartureId: 'dep_2',
        userId: 'user_2',
        companyId: COMPANY_ID,
        customerName: 'Trần Thị B',
        customerEmail: 'b@example.com',
        customerPhone: '0907654321',
        numberOfGuests: 3,
        totalPrice: 15600000,
        bookingDate: '2025-11-02',
        status: 'Confirmed',
        driverId: null,
    },
    {
        id: 'bkg_3',
        tourDepartureId: 'dep_3',
        userId: 'user_1',
        companyId: COMPANY_ID,
        customerName: 'Lê Văn C',
        customerEmail: 'c@example.com',
        customerPhone: '0905555555',
        numberOfGuests: 1,
        totalPrice: 3230000, // 3.230.000 * 1
        bookingDate: '2025-11-05',
        status: 'Pending',
        driverId: null,
    },
];

// === DRIVERS ===
export const mockDrivers: Driver[] = [
    { id: 'dr_1', name: 'Nguyễn Văn Tài', phone: '0901112233', status: 'busy', companyId: COMPANY_ID },
    { id: 'dr_2', name: 'Trần Thị Lái', phone: '0904445566', status: 'available', companyId: COMPANY_ID },
];