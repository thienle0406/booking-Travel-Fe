import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    MapPinIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    UserGroupIcon,
    GlobeAltIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import Slider from "react-slick";
import { apiService } from '../services/apiService';
import type { Tour } from '../types/tour';
import type { TourCategory } from '../types/category';
import TourCard from '../components/TourCard';
import { TourListSkeleton } from '../components/Loading';

// ==================== HERO SECTION ====================
const Hero = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (destination.trim()) {
            navigate(`/tours?destination=${encodeURIComponent(destination)}`);
        } else {
            navigate('/tours');
        }
    };

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')"
                }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-pink-900/80" />

                {/* Animated Shapes */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 animate-fadeInDown">
                    <SparklesIcon className="h-5 w-5 text-yellow-300" />
                    <span className="text-white font-medium">Khám phá Việt Nam cùng chúng tôi</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeInUp leading-tight">
                    Hành Trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">Khám Phá</span>
                    <br />
                    Bắt Đầu Từ Đây
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
                    Trải nghiệm những địa điểm tuyệt vời nhất Việt Nam với giá cả hợp lý và dịch vụ tận tâm
                </p>

                {/* Search Bar with Glassmorphism */}
                <form onSubmit={handleSearch} className="max-w-3xl mx-auto animate-fadeInUp animation-delay-400">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 flex items-center bg-white rounded-xl px-6 py-4 shadow-lg">
                                <MapPinIcon className="h-6 w-6 text-gray-400 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Bạn muốn đi đâu? (VD: Hạ Long, Đà Nẵng, Phú Quốc...)"
                                    className="w-full text-lg border-none focus:outline-none focus:ring-0 p-0"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                <MagnifyingGlassIcon className="h-6 w-6" />
                                Tìm Kiếm
                            </button>
                        </div>
                    </div>
                </form>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fadeInUp animation-delay-600">
                    <StatCard icon={GlobeAltIcon} value="50+" label="Điểm đến" />
                    <StatCard icon={UserGroupIcon} value="10K+" label="Khách hàng" />
                    <StatCard icon={HeartIcon} value="4.9/5" label="Đánh giá" />
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
};

// Stats Card Component
const StatCard = ({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
        <Icon className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-white/80">{label}</div>
    </div>
);

// ==================== CATEGORIES SECTION ====================
const Categories = () => {
    const [categories, setCategories] = useState<TourCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Tạm thời dùng company_1; sau này có thể lấy từ AuthContext
                const data = await apiService.categories.getAll('company_1');
                setCategories(data);
            } catch (err) {
                console.error('Không thể tải danh mục', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Mảng màu để tạo gradient đẹp cho từng category
    const gradientColors = [
        'from-blue-400 to-cyan-400',
        'from-green-400 to-emerald-400',
        'from-purple-400 to-pink-400',
        'from-orange-400 to-red-400',
        'from-yellow-400 to-orange-400',
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fadeIn">
                    <h3 className="text-primary font-semibold text-lg mb-2">Khám Phá Theo Sở Thích</h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Danh Mục Tour
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto rounded-full" />
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {loading && categories.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            Đang tải danh mục...
                        </p>
                    )}
                    {!loading && categories.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            Chưa có danh mục nào. Vui lòng tạo trong trang Admin.
                        </p>
                    )}
                    {categories.map((cat, index) => {
                        const color =
                            gradientColors[index % gradientColors.length];
                        const imgSrc = cat.imageUrl
                            ? (cat.imageUrl.startsWith('http')
                                ? cat.imageUrl
                                : `http://localhost:8081${cat.imageUrl}`)
                            : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop';

                        return (
                        <Link
                            key={cat.id}
                                to={`/tours?categoryId=${encodeURIComponent(cat.id)}`}
                            className="group animate-fadeInUp"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                                {/* Image */}
                                <img
                                    src={imgSrc}
                                    alt={cat.name}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />

                                {/* Text */}
                                <div className="absolute inset-0 flex items-end p-6">
                                    <div>
                                        <h4 className="text-white text-2xl font-bold mb-1">{cat.name}</h4>
                                        <span className="text-white/90 text-sm flex items-center gap-1">
                                            Khám phá ngay
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// ==================== FEATURED TOURS SECTION ====================
const FeaturedTours = () => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await apiService.tourDepartures.getJoinedDepartures('company_1');
                setTours(data.slice(0, 8)); // Top 8 tours
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: tours.length > 3,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } }
        ]
    };

    if (loading) {
        return (
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <TourListSkeleton />
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h3 className="text-primary font-semibold text-lg mb-2">Điểm Đến Hàng Đầu</h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Tour Nổi Bật
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto rounded-full" />
                </div>

                {/* Slider */}
                <div className="px-4">
                    <Slider {...sliderSettings}>
                        {tours.map((tour) => (
                            <div key={tour.id} className="px-3">
                                <TourCard tour={tour} />
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/tours"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                        Xem Tất Cả Tour
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

// ==================== WHY CHOOSE US SECTION ====================
const WhyChooseUs = () => {
    const features = [
        {
            icon: '🏆',
            title: 'Chất Lượng Hàng Đầu',
            desc: 'Cam kết mang đến dịch vụ tour chất lượng cao nhất'
        },
        {
            icon: '💰',
            title: 'Giá Cả Hợp Lý',
            desc: 'Giá tốt nhất thị trường với nhiều ưu đãi hấp dẫn'
        },
        {
            icon: '🎯',
            title: 'Đa Dạng Lựa Chọn',
            desc: 'Hơn 50+ điểm đến khắp Việt Nam cho bạn khám phá'
        },
        {
            icon: '⚡',
            title: 'Đặt Tour Nhanh Chóng',
            desc: 'Đặt tour online dễ dàng, xác nhận tức thì'
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-primary font-semibold text-lg mb-2">Tại Sao Chọn Chúng Tôi</h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Ưu Điểm Vượt Trội
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ==================== MAIN HOMEPAGE ====================
const HomePage = () => {
    return (
        <div className="bg-white">
            <Hero />
            <Categories />
            <FeaturedTours />
            <WhyChooseUs />
        </div>
    );
};

export default HomePage;