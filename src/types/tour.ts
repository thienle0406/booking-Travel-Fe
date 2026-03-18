export interface TourTemplate {
    id: string;
    name: string;
    destination: string;
    description: string; // Keep for backward compatibility
    descriptionHtml?: string; // Add this - matches Java backend field name
    imageUrl: string;
    defaultPrice: number;
    categoryId: string;
    companyId: string;
    discountPercent: number;
    // === AUDIT FIELDS ===
    createdAt: string;
    updatedAt: string;
    createdBy: string; // Tên/ID người tạo
}

// 2. TourDeparture (Lịch khởi hành)
export interface TourDeparture {
    id: string;
    tourTemplateId: string;
    startDate: string;
    endDate: string;
    originalPrice: number;
    discountPercent: number;
    price: number;
    totalSlots: number;
    bookedSlots: number;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    companyId: string;
    // === AUDIT FIELDS ===
    createdAt: string;
    updatedAt: string;
}

// 3. Tour (Data đã join)
export interface Tour {
    id: string;
    name: string;
    destination: string;
    duration: string;
    price: number;
    originalPrice: number;
    discountPercent: number;
    rating: number;
    description: string;
    imageUrl: string;
    isFeatured?: boolean;
    category: string;
}