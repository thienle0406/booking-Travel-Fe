// src/utils/format.ts
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

// Hàm tính số ngày (để hiển thị)
export const getDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 vì tính cả ngày đi

    if (diffDays === 1) return 'Trong ngày';
    return `${diffDays} ngày ${diffDays - 1} đêm`;
};