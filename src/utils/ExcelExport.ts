// src/utils/ExcelExport.ts
import * as XLSX from 'xlsx';
import type { AdminBooking } from '../types/booking';

export const exportRevenueToExcel = (data: AdminBooking[], year: number, month: number, revenue: number) => {
    // 1. Chuẩn bị header
    const header = ["Mã Booking", "Ngày đặt", "Tên Khách Hàng", "Email", "SĐT", "Số khách", "Tổng Tiền (VNĐ)"];

    // 2. Map data
    const rows = data.map(b => [
        b.id,
        b.bookingDate,
        b.customerName,
        b.customerEmail,
        b.customerPhone,
        b.numberOfGuests,
        b.totalPrice
    ]);

    // 3. Thêm dòng tổng kết
    rows.push([]); // Dòng trống
    rows.push(["", "", "", "", "", "TỔNG DOANH THU:", revenue]);

    // 4. Tạo worksheet và workbook
    const wsName = `DoanhThu_T${month + 1}_${year}`; // Sửa tên sheet
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, wsName);

    // 5. Tải file (Sửa tên file)
    XLSX.writeFile(wb, `BaoCao_DoanhThu_T${month + 1}_${year}.xlsx`);
};


// Hàm 2: Export Danh sách điểm danh
interface ManifestData {
    customerName: string;
    customerPhone: string;
    numberOfGuests: number;
}
export const exportManifestToExcel = (data: ManifestData[], tourName: string, startDate: string) => {
    // 1. Header
    const header = ["STT", "Tên Khách Hàng", "Số Điện Thoại", "Số Lượng", "Ghi Chú (Điểm danh)"];

    // 2. Map data
    const rows = data.map((b, index) => [
        index + 1,
        b.customerName,
        b.customerPhone,
        b.numberOfGuests,
        "" // Cột trống để tài xế tick
    ]);

    // 3. Tạo worksheet và workbook
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `DiemDanh`);

    // 4. Tải file
    XLSX.writeFile(wb, `DiemDanh_${tourName}_${startDate}.xlsx`);
};