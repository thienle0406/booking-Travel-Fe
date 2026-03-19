import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { useToast } from '../components/Toast';
import type { TourDeparture, TourTemplate } from '../types/tour';
import { formatCurrency, formatDate } from '../utils/format';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CreditCardIcon,
    CheckCircleIcon,
    MapPinIcon,
    CalendarDaysIcon,
    UsersIcon,
    ShieldCheckIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import { ButtonLoader, PageLoader } from '../components/Loading';

type JoinedTourDetails = TourDeparture & { template: TourTemplate };

const BookingPage = () => {
    const { departureId } = useParams<{ departureId: string }>();
    const { user, companyId } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [tourDetails, setTourDetails] = useState<JoinedTourDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        customerName: user?.fullName || '',
        customerEmail: user?.email || '',
        customerPhone: '',
        numberOfPeople: 1,
        specialRequests: '',
        paymentMethod: 'credit_card'
    });

    // const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Payment, 3: Confirm - Not used in current version

    useEffect(() => {
        const fetchTourDetails = async () => {
            if (!departureId) return;
            setLoading(true);
            try {
                const departure = await apiService.tourDepartures.getOne(departureId);
                const template = await apiService.tourTemplates.getOne(departure.tourTemplateId);
                setTourDetails({ ...departure, template });
            } catch (err) {
                console.error(err);
                toast.error('Không thể tải thông tin tour');
                navigate('/tours');
            } finally {
                setLoading(false);
            }
        };
        fetchTourDetails();
    }, [departureId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tourDetails || !companyId) return;

        // Validation (dung helper)
        const { isValidName, isValidEmail, isValidPhoneVN } = await import('../utils/validation');
        if (!isValidName(formData.customerName)) {
            toast.warning('Ho ten phai co it nhat 2 ky tu');
            return;
        }
        if (!isValidEmail(formData.customerEmail)) {
            toast.warning('Email khong hop le');
            return;
        }
        if (!isValidPhoneVN(formData.customerPhone)) {
            toast.warning('So dien thoai phai la 10 so, bat dau bang 0');
            return;
        }

        const totalPrice = tourDetails.price * formData.numberOfPeople;

        setSubmitting(true);
        try {
            await apiService.bookings.create(companyId, {
                tourDepartureId: departureId!,
                customerId: user?.id || 'guest',
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                numberOfPeople: formData.numberOfPeople,
                totalPrice,
                specialRequests: formData.specialRequests,
                status: 'Pending',
                bookingDate: new Date().toISOString().split('T')[0],
                paymentMethod: formData.paymentMethod,
                paymentStatus: 'Pending'
            });

            toast.success('Đặt tour thành công! Chúng tôi sẽ liên hệ bạn sớm.');
            navigate('/my-bookings');
        } catch (err: any) {
            toast.error(err.message || 'Đã xảy ra lỗi khi đặt tour');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <PageLoader />;
    if (!tourDetails) return null;

    const { template, ...departure } = tourDetails;
    const totalPrice = departure.price * formData.numberOfPeople;
    const discount = (departure.originalPrice - departure.price) * formData.numberOfPeople;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                {/* Progress Steps - Currently showing step 1 only */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((step) => (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                                        step === 1
                                            ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {step === 1 ? <CheckCircleIcon className="h-6 w-6" /> : step}
                                    </div>
                                    <span className={`text-sm mt-2 font-medium ${
                                        step === 1 ? 'text-primary' : 'text-gray-500'
                                    }`}>
                                        {step === 1 ? 'Thông tin' : step === 2 ? 'Thanh toán' : 'Xác nhận'}
                                    </span>
                                </div>
                                {step < 3 && (
                                    <div className={`flex-1 h-1 mx-4 transition-all ${
                                        step === 1 ? 'bg-gray-200' : 'bg-gray-200'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Left: Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Thông tin đặt tour</h2>

                            {/* Customer Info */}
                            <div className="space-y-5 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            className="input pl-10"
                                            placeholder="Nguyễn Văn A"
                                            required
                                        />
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            className="input pl-10"
                                            placeholder="email@example.com"
                                            required
                                        />
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="customerPhone"
                                            value={formData.customerPhone}
                                            onChange={handleInputChange}
                                            className="input pl-10"
                                            placeholder="0912345678"
                                            required
                                        />
                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số người tham gia *
                                    </label>
                                    <select
                                        name="numberOfPeople"
                                        value={formData.numberOfPeople}
                                        onChange={handleInputChange}
                                        className="input"
                                    >
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>{num} người</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Yêu cầu đặc biệt (tùy chọn)
                                    </label>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleInputChange}
                                        className="input min-h-[100px]"
                                        placeholder="Ví dụ: Chế độ ăn đặc biệt, phòng gần thang máy..."
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Phương thức thanh toán</h3>
                                <div className="space-y-3">
                                    {[
                                        { value: 'credit_card', label: 'Thẻ tín dụng/Ghi nợ', icon: CreditCardIcon },
                                        { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: BanknotesIcon },
                                        { value: 'cash', label: 'Tiền mặt', icon: BanknotesIcon }
                                    ].map(method => (
                                        <label
                                            key={method.value}
                                            className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                formData.paymentMethod === method.value
                                                    ? 'border-primary bg-pink-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.value}
                                                checked={formData.paymentMethod === method.value}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 text-primary"
                                            />
                                            <method.icon className="h-6 w-6 text-gray-600" />
                                            <span className="font-medium text-gray-900">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-blue-900 mb-1">Thanh toán an toàn</h4>
                                    <p className="text-sm text-blue-800">
                                        Thông tin của bạn được mã hóa và bảo mật tuyệt đối. Chúng tôi không lưu trữ thông tin thẻ.
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary w-full text-lg py-4 justify-center"
                            >
                                {submitting ? <ButtonLoader /> : 'Xác nhận đặt tour'}
                            </button>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>

                            {/* Tour Image */}
                            <img
                                src={template.imageUrl}
                                alt={template.name}
                                className="w-full h-48 object-cover rounded-xl mb-4"
                            />

                            {/* Tour Info */}
                            <h4 className="font-bold text-lg text-gray-900 mb-3">{template.name}</h4>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <MapPinIcon className="h-4 w-4 text-primary" />
                                    <span>{template.destination}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <CalendarDaysIcon className="h-4 w-4 text-primary" />
                                    <span>Khoi hanh: {formatDate(departure.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <UsersIcon className="h-4 w-4 text-primary" />
                                    <span>{formData.numberOfPeople} người</span>
                                </div>
                            </div>

                            <hr className="my-4" />

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Giá tour × {formData.numberOfPeople}</span>
                                    <span>{formatCurrency(departure.originalPrice * formData.numberOfPeople)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá ({departure.discountPercent}%)</span>
                                        <span>-{formatCurrency(discount)}</span>
                                    </div>
                                )}
                            </div>

                            <hr className="my-4" />

                            {/* Total */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                                <span className="text-2xl font-bold text-red-600">{formatCurrency(totalPrice)}</span>
                            </div>

                            {/* Features */}
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    <span>Hoàn tiền 100% nếu hủy trước 7 ngày</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    <span>Xác nhận ngay lập tức</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    <span>Hỗ trợ 24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;