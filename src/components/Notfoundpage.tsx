import { Link, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    MapIcon
} from '@heroicons/react/24/outline';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Animated 404 */}
                <div className="mb-8 relative">
                    <h1 className="text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 leading-none animate-bounce">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
                    </div>
                </div>

                {/* Message */}
                <div className="mb-8 space-y-4">
                    <h2 className="text-4xl font-bold text-gray-900">
                        Oops! Trang không tồn tại
                    </h2>
                    <p className="text-xl text-gray-600">
                        Có vẻ như bạn đã đi lạc đường. Đừng lo, chúng tôi sẽ giúp bạn quay về!
                    </p>
                </div>

                {/* Illustration */}
                <div className="mb-12">
                    <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="80" fill="url(#grad1)" opacity="0.2"/>
                        <path d="M60 90 Q70 70, 80 90" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round"/>
                        <path d="M120 90 Q130 70, 140 90" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round"/>
                        <path d="M70 120 Q100 140, 130 120" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round"/>
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ec4899"/>
                                <stop offset="100%" stopColor="#f97316"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <HomeIcon className="h-5 w-5" />
                        Về Trang Chủ
                    </Link>

                    <Link
                        to="/tours"
                        className="bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <MapIcon className="h-5 w-5" />
                        Xem Tour
                    </Link>

                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Quay Lại
                    </button>
                </div>

                {/* Search Suggestion */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <MagnifyingGlassIcon className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-bold text-gray-900">
                            Hoặc thử tìm kiếm tour mơ ước của bạn
                        </h3>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Bạn muốn đi đâu?"
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-pink-200 transition-all"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/tours?search=${e.currentTarget.value}`);
                                }
                            }}
                        />
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Fun Fact */}
                <div className="mt-12 text-sm text-gray-500">
                    <p>💡 <strong>Fun fact:</strong> 404 không có nghĩa là "lỗi" - đó chỉ là mã HTTP cho "không tìm thấy"!</p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;