import React from 'react';
import { Link } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    ExclamationTriangleIcon,
    InboxIcon
} from '@heroicons/react/24/outline';

// ==================== BASE EMPTY STATE ====================
interface EmptyStateProps {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
                                                          icon: Icon = InboxIcon,
                                                          title,
                                                          description,
                                                          actionLabel,
                                                          actionHref,
                                                          onAction
                                                      }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Icon */}
            <div className="mb-6 relative">
                <div className="absolute inset-0 bg-primary opacity-10 blur-2xl rounded-full" />
                <Icon className="h-24 w-24 text-gray-400 relative z-10" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>

            {/* Description */}
            <p className="text-gray-600 max-w-md mb-8">{description}</p>

            {/* Action Button */}
            {actionLabel && (
                <>
                    {actionHref ? (
                        <Link to={actionHref} className="btn-primary">
                            {actionLabel}
                        </Link>
                    ) : onAction ? (
                        <button onClick={onAction} className="btn-primary">
                            {actionLabel}
                        </button>
                    ) : null}
                </>
            )}
        </div>
    );
};

// ==================== SPECIFIC EMPTY STATES ====================

// No Tours Found
export const NoToursFound: React.FC<{ onReset?: () => void }> = ({ onReset }) => (
    <EmptyState
        icon={MagnifyingGlassIcon}
        title="Không tìm thấy tour nào"
        description="Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác nhé!"
        actionLabel={onReset ? "Xóa bộ lọc" : undefined}
        onAction={onReset}
    />
);

// No Bookings
export const NoBookings: React.FC = () => (
    <EmptyState
        icon={ShoppingBagIcon}
        title="Bạn chưa có booking nào"
        description="Hãy khám phá các tour du lịch tuyệt vời và đặt chuyến đi đầu tiên của bạn!"
        actionLabel="Khám phá tour"
        actionHref="/tours"
    />
);

// No Results
export const NoResults: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => (
    <EmptyState
        icon={MagnifyingGlassIcon}
        title={searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : "Không tìm thấy kết quả"}
        description="Vui lòng thử lại với từ khóa khác hoặc kiểm tra lỗi chính tả."
    />
);

// Error State
export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
                                                                                     message = "Đã có lỗi xảy ra",
                                                                                     onRetry
                                                                                 }) => (
    <EmptyState
        icon={ExclamationTriangleIcon}
        title="Oops! Có lỗi xảy ra"
        description={message}
        actionLabel={onRetry ? "Thử lại" : undefined}
        onAction={onRetry}
    />
);

// Coming Soon
export const ComingSoon: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-6">
            <div className="text-8xl">🚀</div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Sắp ra mắt!</h3>
        <p className="text-gray-600 max-w-md mb-8">
            Tính năng này đang được phát triển. Hãy quay lại sau nhé!
        </p>
    </div>
);

// No Data (Generic)
export const NoData: React.FC<{
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
}> = ({
          title = "Chưa có dữ liệu",
          description = "Hiện tại chưa có dữ liệu để hiển thị.",
          actionLabel,
          actionHref
      }) => (
    <EmptyState
        icon={InboxIcon}
        title={title}
        description={description}
        actionLabel={actionLabel}
        actionHref={actionHref}
    />
);

// ==================== EXPORT ====================
export default {
    EmptyState,
    NoToursFound,
    NoBookings,
    NoResults,
    ErrorState,
    ComingSoon,
    NoData
};