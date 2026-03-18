import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ButtonLoader } from '../components/Loading';

const LoginPage = () => {
    const { login, user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const fromPage = location.state?.from?.pathname || null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.warning('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        setLoading(true);
        try {
            await login(username, password);
            toast.success('Đăng nhập thành công!');
        } catch (err: any) {
            toast.error(err.message || 'Sai tên đăng nhập hoặc mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            if (fromPage) {
                navigate(fromPage, { replace: true });
            } else if (isAdmin) {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [user, navigate, fromPage, isAdmin]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-8 py-8 text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                                <SparklesIcon className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại!</h2>
                            <p className="text-white/90">Đăng nhập để tiếp tục khám phá</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Username Field - NO ICON */}
                            <div className="animate-fadeInUp animation-delay-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input"
                                    placeholder="user hoặc admin"
                                    disabled={loading}
                                    autoComplete="username"
                                />
                            </div>

                            {/* Password Field - ONLY eye icon */}
                            <div className="animate-fadeInUp animation-delay-400">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input pr-11"
                                        placeholder="••••••••"
                                        disabled={loading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between animate-fadeInUp animation-delay-600">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Ghi nhớ đăng nhập</span>
                                </label>
                                <a href="#" className="text-sm font-medium text-primary hover:text-pink-700 transition-colors">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn-primary w-full text-lg animate-fadeInUp animation-delay-600"
                                disabled={loading}
                            >
                                {loading ? <ButtonLoader /> : 'Đăng Nhập'}
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

                        {/* Register Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Chưa có tài khoản?{' '}
                                <Link
                                    to="/register"
                                    className="font-semibold text-primary hover:text-pink-700 hover:underline transition-all"
                                >
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                            <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Demo credentials
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">User:</span>
                                    <code className="bg-white px-3 py-1 rounded text-xs font-mono text-gray-800 shadow-sm">
                                        user / user
                                    </code>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Admin:</span>
                                    <code className="bg-white px-3 py-1 rounded text-xs font-mono text-gray-800 shadow-sm">
                                        admin / admin
                                    </code>
                                </div>
                            </div>
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

export default LoginPage;