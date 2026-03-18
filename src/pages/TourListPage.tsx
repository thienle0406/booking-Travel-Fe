import { useState, useEffect } from 'react';
import TourCard from '../components/TourCard';
import type { Tour } from '../types/tour';
import { useSearchParams } from 'react-router-dom';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    FunnelIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../services/apiService';
import type { TourCategory } from '../types/category';
import { TourListSkeleton } from '../components/Loading';
import { NoToursFound } from '../components/EmptyState';

const TOURS_PER_PAGE = 12;

const TourListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters state
    const [searchTerm, setSearchTerm] = useState(searchParams.get('destination') || '');
    // Lưu categoryId (khớp với Category.id), không dùng tên nữa
    const [selectedCategoryId, setSelectedCategoryId] = useState(searchParams.get('categoryId') || '');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
    const [sortBy, setSortBy] = useState('popular');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Data state
    const [allTours, setAllTours] = useState<Tour[]>([]);
    const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState<TourCategory[]>([]);

    // Fetch dữ liệu tours + categories từ BE, dùng API search đúng chuẩn
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [tours, categoryData] = await Promise.all([
                    // Gọi API search: backend lọc theo companyId + categoryId + destination
                    apiService.tourDepartures.getJoinedDepartures(
                        'company_1',
                        selectedCategoryId || null,
                        searchTerm || null
                    ),
                    apiService.categories.getAll('company_1')
                ]);
                setAllTours(tours);
                setCategories(categoryData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // Mỗi khi searchTerm hoặc selectedCategoryId đổi thì gọi lại API search
    }, [searchTerm, selectedCategoryId]);

    // Apply filters còn lại (giá + sort) trên kết quả từ BE
    useEffect(() => {
        let result = [...allTours];

        // Price filter
        result = result.filter(tour =>
            tour.price >= priceRange[0] && tour.price <= priceRange[1]
        );

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default: // popular
                break;
        }

        setFilteredTours(result);
        setCurrentPage(1);
    }, [priceRange, sortBy, allTours]);

    // Update URL params
    useEffect(() => {
        const params: any = {};
        if (searchTerm) params.destination = searchTerm;
        if (selectedCategoryId) params.categoryId = selectedCategoryId;
        setSearchParams(params);
    }, [searchTerm, selectedCategoryId]);

    // Pagination
    const totalPages = Math.ceil(filteredTours.length / TOURS_PER_PAGE);
    const startIndex = (currentPage - 1) * TOURS_PER_PAGE;
    const toursToShow = filteredTours.slice(startIndex, startIndex + TOURS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setPriceRange([0, 10000000]);
        setSortBy('popular');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Khám Phá Tour Du Lịch</h1>
                    <p className="text-gray-600">Tìm thấy {filteredTours.length} tour phù hợp</p>
                </div>

                {/* Mobile Filter Button */}
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-pink-500 to-orange-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2"
                >
                    <FunnelIcon className="h-6 w-6" />
                    <span className="font-semibold">Bộ lọc</span>
                </button>

                <div className="flex gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <FilterSidebar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedCategoryId={selectedCategoryId}
                            setSelectedCategoryId={setSelectedCategoryId}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            categories={categories}
                            onReset={resetFilters}
                        />
                    </aside>

                    {/* Mobile Sidebar */}
                    {isMobileFilterOpen && (
                        <>
                            <div
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                                onClick={() => setIsMobileFilterOpen(false)}
                            />
                            <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl lg:hidden overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold">Bộ lọc</h2>
                                        <button onClick={() => setIsMobileFilterOpen(false)}>
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <FilterSidebar
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        selectedCategoryId={selectedCategoryId}
                                        setSelectedCategoryId={setSelectedCategoryId}
                                        priceRange={priceRange}
                                        setPriceRange={setPriceRange}
                                        categories={categories}
                                        onReset={resetFilters}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Sort Bar */}
                        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Sắp xếp theo:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input w-auto"
                            >
                                <option value="popular">Phổ biến</option>
                                <option value="price-low">Giá: Thấp → Cao</option>
                                <option value="price-high">Giá: Cao → Thấp</option>
                                <option value="rating">Đánh giá cao nhất</option>
                            </select>
                        </div>

                        {/* Tours Grid */}
                        {loading ? (
                            <TourListSkeleton />
                        ) : toursToShow.length === 0 ? (
                            <NoToursFound onReset={resetFilters} />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                                    {toursToShow.map(tour => (
                                        <TourCard key={tour.id} tour={tour} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Filter Sidebar Component
interface FilterSidebarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedCategoryId: string;
    setSelectedCategoryId: (value: string) => void;
    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;
    categories: TourCategory[];
    onReset: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
                                                         searchTerm,
                                                         setSearchTerm,
                                                         selectedCategoryId,
                                                         setSelectedCategoryId,
                                                         priceRange,
                                                         setPriceRange,
                                                         categories,
                                                         onReset
                                                     }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24 space-y-6">
            {/* Search */}
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Tìm kiếm</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Điểm đến, tên tour..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Danh mục</label>
                <div className="space-y-2">
                    <button
                        onClick={() => setSelectedCategoryId('')}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                            selectedCategoryId === ''
                                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Tất cả
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                                selectedCategoryId === cat.id
                                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Khoảng giá</label>
                <div className="space-y-3">
                    <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="500000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-primary"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>0đ</span>
                        <span className="font-bold text-primary">
                            {(priceRange[1] / 1000000).toFixed(1)}M
                        </span>
                    </div>
                </div>
            </div>

            {/* Reset Button */}
            <button
                onClick={onReset}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
            >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                Đặt lại bộ lọc
            </button>
        </div>
    );
};

// Pagination Component
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const handlePrev = () => { if (currentPage > 1) onPageChange(currentPage - 1); };
    const handleNext = () => { if (currentPage < totalPages) onPageChange(currentPage + 1); };

    // Show max 7 page buttons
    let visiblePages = pageNumbers;
    if (totalPages > 7) {
        if (currentPage <= 4) {
            visiblePages = [...pageNumbers.slice(0, 5), -1, totalPages];
        } else if (currentPage >= totalPages - 3) {
            visiblePages = [1, -1, ...pageNumbers.slice(totalPages - 5)];
        } else {
            visiblePages = [1, -1, currentPage - 1, currentPage, currentPage + 1, -2, totalPages];
        }
    }

    return (
        <nav className="flex items-center justify-center gap-2">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {visiblePages.map((page, idx) =>
                page === -1 || page === -2 ? (
                    <span key={`ellipsis-${idx}`} className="px-2">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            currentPage === page
                                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRightIcon className="h-5 w-5" />
            </button>
        </nav>
    );
};

export default TourListPage;