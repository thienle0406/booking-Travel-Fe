import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type { TourDeparture, TourTemplate } from '../types/tour';
import { formatCurrency, getDuration } from '../utils/format';
import {
    MapPinIcon,
    ClockIcon,
    CheckCircleIcon,
    UsersIcon,
    CalendarDaysIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { PageLoader } from '../components/Loading';
import { ErrorState } from '../components/EmptyState';

type JoinedTourDetails = TourDeparture & { template: TourTemplate };

const TourDetailPage = () => {
    const { departureId } = useParams<{ departureId: string }>();
    const [tourDetails, setTourDetails] = useState<JoinedTourDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Gallery state
    const [selectedImage, setSelectedImage] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!departureId) {
            setError('Không tìm thấy mã tour.');
            setLoading(false);
            return;
        }

        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const departure = await apiService.tourDepartures.getOne(departureId);
                const template = await apiService.tourTemplates.getOne(departure.tourTemplateId);
                setTourDetails({ ...departure, template });
            } catch (err) {
                console.error(err);
                setError('Không thể tải chi tiết tour. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [departureId]);

    if (loading) return <PageLoader />;
    if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
    if (!tourDetails) return <ErrorState message="Không tìm thấy tour." />;

    const { template, ...departure } = tourDetails;
    const duration = getDuration(departure.startDate, departure.endDate);
    const slotsLeft = departure.totalSlots - departure.bookedSlots;
    const hasDiscount = departure.discountPercent > 0;

    // Mock images for gallery (in real app, these would come from API)
    const images = [
        template.imageUrl,
        'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link to="/" className="hover:text-primary">Trang chủ</Link>
                    <ChevronRightIcon className="h-4 w-4" />
                    <Link to="/tours" className="hover:text-primary">Danh sách tour</Link>
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-gray-900 font-medium truncate">{template.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Images + Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                            {/* Main Image */}
                            <div className="relative h-[500px] overflow-hidden group cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
                                <img
                                    src={images[selectedImage]}
                                    alt={template.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {hasDiscount && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                                        -{departure.discountPercent}% OFF
                                    </div>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsFavorite(!isFavorite);
                                    }}
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
                                >
                                    {isFavorite ? (
                                        <HeartSolidIcon className="h-6 w-6 text-red-500" />
                                    ) : (
                                        <HeartIcon className="h-6 w-6 text-gray-600" />
                                    )}
                                </button>
                                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                                    {selectedImage + 1} / {images.length}
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            <div className="grid grid-cols-4 gap-2 p-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative h-24 rounded-lg overflow-hidden transition-all ${
                                            selectedImage === idx
                                                ? 'ring-4 ring-primary scale-95'
                                                : 'hover:ring-2 ring-gray-300'
                                        }`}
                                    >
                                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tour Info */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{template.name}</h1>

                            <div className="flex flex-wrap items-center gap-6 text-gray-700 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5 text-primary" />
                                    <span className="font-medium">{template.destination}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="h-5 w-5 text-primary" />
                                    <span>{duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDaysIcon className="h-5 w-5 text-primary" />
                                    <span>Khởi hành: {departure.startDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                                    <span className="font-bold">4.8</span>
                                    <span className="text-gray-500">(124 đánh giá)</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="border-t pt-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả hành trình</h2>
                                <div
                                    className="prose max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: template.descriptionHtml || template.description }}
                                />
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <ReviewsSection />
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-24">
                            {/* Price */}
                            <div className="mb-6">
                                {hasDiscount && (
                                    <span className="text-lg line-through text-gray-500 block">
                                        {formatCurrency(departure.originalPrice)}
                                    </span>
                                )}
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-red-600">
                                        {formatCurrency(departure.price)}
                                    </span>
                                    <span className="text-gray-600">/ khách</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircleIcon className="h-5 w-5" />
                                    <span className="font-medium">Xác nhận tức thì</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <UsersIcon className="h-5 w-5 text-primary" />
                                    <span>
                                        {slotsLeft > 0
                                            ? `Còn ${slotsLeft} chỗ trống`
                                            : 'Đã hết chỗ'}
                                    </span>
                                </div>
                            </div>

                            {/* Booking Button */}
                            {slotsLeft > 0 ? (
                                <Link
                                    to={`/booking/${departure.id}`}
                                    className="btn-primary w-full text-lg justify-center mb-4"
                                >
                                    Đặt Tour Ngay
                                </Link>
                            ) : (
                                <button
                                    className="w-full bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed mb-4"
                                    disabled
                                >
                                    Đã Hết Chỗ
                                </button>
                            )}

                            {/* Contact */}
                            <div className="text-center pt-4 border-t">
                                <p className="text-sm text-gray-600 mb-2">Cần hỗ trợ?</p>
                                <a href="tel:+00232677" className="text-primary font-bold text-lg hover:underline">
                                    📞 +00 232 677
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Gallery */}
            {isGalleryOpen && (
                <Lightbox
                    images={images}
                    selectedIndex={selectedImage}
                    onClose={() => setIsGalleryOpen(false)}
                    onSelect={setSelectedImage}
                />
            )}
        </div>
    );
};

// Reviews Section Component
const ReviewsSection = () => {
    const reviews = [
        { id: 1, name: 'Nguyễn Văn A', rating: 5, date: '2025-01-15', comment: 'Tour tuyệt vời! Hướng dẫn viên nhiệt tình, lịch trình hợp lý.', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=ec4899&color=fff' },
        { id: 2, name: 'Trần Thị B', rating: 4, date: '2025-01-10', comment: 'Rất hài lòng với chuyến đi. Sẽ quay lại lần sau!', avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=f97316&color=fff' },
        { id: 3, name: 'Lê Văn C', rating: 5, date: '2025-01-05', comment: 'Chuyến đi đáng nhớ, khung cảnh đẹp tuyệt vời!', avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=3b82f6&color=fff' },
    ];

    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Đánh giá từ khách hàng</h2>
                <div className="flex items-center gap-2">
                    <StarSolidIcon className="h-6 w-6 text-yellow-400" />
                    <span className="text-2xl font-bold">4.8</span>
                    <span className="text-gray-600">(124 đánh giá)</span>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <StarSolidIcon
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Lightbox Component
interface LightboxProps {
    images: string[];
    selectedIndex: number;
    onClose: () => void;
    onSelect: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, selectedIndex, onClose, onSelect }) => {
    const handlePrev = () => {
        onSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    };

    const handleNext = () => {
        onSelect(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    return (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 bg-white/10 backdrop-blur-sm p-2 rounded-full"
            >
                <XMarkIcon className="h-8 w-8" />
            </button>

            {/* Prev Button */}
            <button
                onClick={handlePrev}
                className="absolute left-4 text-white hover:text-gray-300 bg-white/10 backdrop-blur-sm p-3 rounded-full"
            >
                <ChevronLeftIcon className="h-8 w-8" />
            </button>

            {/* Image */}
            <img
                src={images[selectedIndex]}
                alt="Gallery"
                className="max-w-[90vw] max-h-[90vh] object-contain"
            />

            {/* Next Button */}
            <button
                onClick={handleNext}
                className="absolute right-4 text-white hover:text-gray-300 bg-white/10 backdrop-blur-sm p-3 rounded-full"
            >
                <ChevronRightIcon className="h-8 w-8" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                {selectedIndex + 1} / {images.length}
            </div>
        </div>
    );
};

export default TourDetailPage;