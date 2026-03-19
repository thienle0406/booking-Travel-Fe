// src/components/StatusBadge.tsx
// Component hiển thị trạng thái với màu sắc phân biệt
import type { BookingStatus } from '../types/booking';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '../types/booking';

interface StatusBadgeProps {
    status: BookingStatus;
    size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
    const colorClass = BOOKING_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
    const label = BOOKING_STATUS_LABELS[status] || status;
    const sizeClass = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

    return (
        <span className={`inline-flex items-center leading-5 font-semibold rounded-full ${colorClass} ${sizeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${colorClass.replace('bg-', 'bg-').replace('-100', '-500')}`} />
            {label}
        </span>
    );
};

// Badge cho trạng thái tài xế
interface DriverStatusBadgeProps {
    status: 'available' | 'busy';
}

export const DriverStatusBadge: React.FC<DriverStatusBadgeProps> = ({ status }) => {
    const isAvailable = status === 'available';
    return (
        <span className={`px-2 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
            isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
            {isAvailable ? 'Ranh' : 'Dang ban'}
        </span>
    );
};

export default StatusBadge;
