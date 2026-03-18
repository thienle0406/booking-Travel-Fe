// src/router/index.tsx
import { Routes, Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// === User Pages ===
import HomePage from '../pages/HomePage';
import TourListPage from '../pages/TourListPage';
import TourDetailPage from '../pages/TourDetailPage';
import BookingPage from '../pages/BookingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MyBookingsPage from '../pages/MyBookingsPage';
import ProfilePage from '../pages/ProfilePage';
import ContactPage from '../pages/ContactPage';
import PolicyPage from '../pages/PolicyPage';
import NotFoundPage from '../pages/NotFoundPage';

// === Admin Pages ===
import DashboardPage from '../pages/admin/DashboardPage';
import TourTemplatePage from '../pages/admin/TourTemplatePage';
import TourDeparturePage from '../pages/admin/TourDeparturePage';
import BookingManagementPage from '../pages/admin/BookingManagementPage';
import AccountingPage from '../pages/admin/AccountingPage';
import DriverManagementPage from '../pages/admin/DriverManagementPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import CategoryManagementPage from '../pages/admin/CategoryManagementPage';


const AppRoutes = () => {
    return (
        <Routes>
            {/* ===== SỬA Ở ĐÂY: TẤT CẢ USER ROUTES ĐỀU NẰM TRONG NÀY ===== */}
            <Route element={<UserLayout />}>
                {/* Routes công khai */}
                <Route path="/" element={<HomePage />} />
                <Route path="/tours" element={<TourListPage />} />
                <Route path="/tour/:departureId" element={<TourDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/policy" element={<PolicyPage />} />

                {/* Routes Đăng nhập / Đăng ký (đã chuyển vào đây) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Routes cần login */}
                <Route
                    path="/booking/:departureId"
                    element={ <ProtectedRoute allowedRoles={['USER']}> <BookingPage /> </ProtectedRoute> }
                />
                <Route
                    path="/my-bookings"
                    element={ <ProtectedRoute allowedRoles={['USER']}> <MyBookingsPage /> </ProtectedRoute> }
                />
                <Route
                    path="/profile"
                    element={ <ProtectedRoute allowedRoles={['USER', 'ADMIN']}> <ProfilePage /> </ProtectedRoute> }
                />
            </Route>

            {/* ===== Routes cho Admin (Giữ nguyên) ===== */}
            <Route
                path="/admin"
                element={ <ProtectedRoute allowedRoles={['ADMIN']}> <AdminLayout /> </ProtectedRoute> }
            >
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="tours" element={<TourTemplatePage />} />
                <Route path="departures" element={<TourDeparturePage />} />
                <Route path="bookings" element={<BookingManagementPage />} />
                <Route path="accounting" element={<AccountingPage />} />
                <Route path="drivers" element={<DriverManagementPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="categories" element={<CategoryManagementPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;