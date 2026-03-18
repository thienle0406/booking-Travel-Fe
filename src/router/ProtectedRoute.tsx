import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: ('USER' | 'ADMIN')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated || !user) {
        // 1. Dòng này ĐÃ BAO GỒM "GUEST" (vì user là null)
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // === KHỐI CODE GÂY LỖI ĐÃ BỊ XÓA ===
    // (Không cần check 'GUEST' nữa, vì 'user' ở đây chắc chắn là ADMIN hoặc USER)
    // ===================================

    // 2. Kiểm tra quyền (Role)
    // Tới đây, user.role chắc chắn là 'ADMIN' | 'USER'
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Lỗi (nếu có) ở đây cũng sẽ tự động hết
        return <Navigate to="/" replace />;
    }

    // Nếu đủ điều kiện
    return <>{children}</>;
};

export default ProtectedRoute;