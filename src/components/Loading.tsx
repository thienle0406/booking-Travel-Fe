import React from 'react';

// ==================== SKELETON BASE ====================
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ==================== TOUR CARD SKELETON ====================
export const TourCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        {/* Image skeleton */}
        <Skeleton className="h-56 w-full" />

        <div className="p-5 space-y-3">
            {/* Destination */}
            <Skeleton className="h-4 w-32" />

            {/* Title */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />

            {/* Duration */}
            <Skeleton className="h-4 w-24" />

            {/* Price & Button */}
            <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    </div>
);

// ==================== TOUR LIST SKELETON ====================
export const TourListSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <TourCardSkeleton key={i} />
        ))}
    </div>
);

// ==================== BOOKING TABLE SKELETON ====================
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>

        {/* Table */}
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                </div>
            ))}
        </div>
    </div>
);

// ==================== STATS CARD SKELETON ====================
export const StatsCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-40" />
    </div>
);

// ==================== DASHBOARD SKELETON ====================
export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-8">
        {/* Title */}
        <Skeleton className="h-10 w-64" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
        </div>

        {/* Table */}
        <TableSkeleton rows={3} />
    </div>
);

// ==================== PAGE LOADING SPINNER ====================
export const PageLoader: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
            {/* Spinning circle */}
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />

            {/* Inner circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
            </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Đang tải...</p>
    </div>
);

// ==================== BUTTON LOADING ====================
export const ButtonLoader: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>Đang xử lý...</span>
    </div>
);

// ==================== FULL PAGE OVERLAY LOADING ====================
export const FullPageLoader: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                <p className="text-lg font-semibold text-gray-700">Đang tải dữ liệu...</p>
            </div>
        </div>
    </div>
);

// ==================== EXPORT ====================
export default {
    Skeleton,
    TourCardSkeleton,
    TourListSkeleton,
    TableSkeleton,
    StatsCardSkeleton,
    DashboardSkeleton,
    PageLoader,
    ButtonLoader,
    FullPageLoader
};