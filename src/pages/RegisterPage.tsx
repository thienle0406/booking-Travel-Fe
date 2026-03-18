import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useToast } from '../components/Toast';
import { EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ButtonLoader } from '../components/Loading';

const RegisterPage = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            toast.warning('Vui lòng nhập tên người dùng!');
            return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            toast.warning('Vui lòng nhập email hợp lệ!');
            return false;
        }
        if (formData.password.length < 6) {
            toast.warning('Mật khẩu phải có ít nhất 6 ký tự!');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu nhập lại không khớp!');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await apiService.auth.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                companyId: 'company_1'
            });
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.message || 'Đã xảy ra lỗi khi đăng ký.');
        } finally {
            setLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 1, label: 'Yếu', color: 'bg-red-500' };
        if (password.length < 10) return { strength: 2, label: 'Trung bình', color: 'bg-yellow-500' };
        return { strength: 3, label: 'Mạnh', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-8 py-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                                <SparklesIcon className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Tạo Tài Khoản</h2>
                            <p className="text-white/90">Bắt đầu hành trình khám phá của bạn</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username - NO ICON */}
                            <div className="animate-fadeInUp animation-delay-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và Tên
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Nguyễn Văn A"
                                    disabled={loading}
                                    autoComplete="name"
                                />
                            </div>

                            {/* Email - NO ICON */}
                            <div className="animate-fadeInUp animation-delay-300">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="email@example.com"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password - ONLY eye icon */}
                            <div className="animate-fadeInUp animation-delay-400">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input pr-11"
                                        placeholder="••••••••"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3].map(level => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                        level <= passwordStrength.strength
                                                            ? passwordStrength.color
                                                            : 'bg-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${
                                            passwordStrength.strength === 1 ? 'text-red-600' :
                                                passwordStrength.strength === 2 ? 'text-yellow-600' :
                                                    'text-green-600'
                                        }`}>
                                            Độ mạnh: {passwordStrength.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password - ONLY eye icon */}
                            <div className="animate-fadeInUp animation-delay-500">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="input pr-11"
                                        placeholder="••••••••"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Password Match Indicator */}
                                {formData.confirmPassword && (
                                    <p className={`text-xs mt-1 ${
                                        formData.password === formData.confirmPassword
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                        {formData.password === formData.confirmPassword
                                            ? 'Mật khẩu khớp'
                                            : 'Mật khẩu không khớp'}
                                    </p>
                                )}
                            </div>

                            {/* Terms */}
                            <div className="flex items-start animate-fadeInUp animation-delay-600">
                                <input
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label className="ml-2 text-sm text-gray-700">
                                    Tôi đồng ý với{' '}
                                    <Link to="/policy" className="text-primary hover:underline font-medium">
                                        Điều khoản dịch vụ
                                    </Link>
                                    {' '}và{' '}
                                    <Link to="/policy" className="text-primary hover:underline font-medium">
                                        Chính sách bảo mật
                                    </Link>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn-primary w-full text-lg animate-fadeInUp animation-delay-600"
                                disabled={loading}
                            >
                                {loading ? <ButtonLoader /> : 'Tạo Tài Khoản'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Hoặc</span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Đã có tài khoản?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-primary hover:text-pink-700 hover:underline transition-all"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    &copy; 2025 MyTour. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;