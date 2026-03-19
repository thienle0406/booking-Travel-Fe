// src/types/poster.ts
// Bảng Posters: Quản lý Banner/Poster trên trang chủ

export interface Poster {
    id: string;
    imageUrl: string;         // URL ảnh poster
    title: string;            // Tiêu đề hiển thị trên poster
    subtitle?: string;        // Mô tả ngắn (tùy chọn)
    linkTo: string;           // Đường dẫn khi click (VD: "/tours?categoryId=xxx")
    displayOrder: number;     // Thứ tự hiển thị (1, 2, 3...)
    isActive: boolean;        // Đang hiển thị hay không
    companyId: string;
    // === AUDIT FIELDS ===
    createdAt?: string;
    updatedAt?: string;
}
