import { useState } from 'react';
import {
    ShieldCheckIcon,
    DocumentTextIcon,
    CreditCardIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const PolicyPage = () => {
    const [activeSection, setActiveSection] = useState('privacy');

    const sections = [
        { id: 'privacy', title: 'Chính sách bảo mật', icon: ShieldCheckIcon },
        { id: 'terms', title: 'Điều khoản dịch vụ', icon: DocumentTextIcon },
        { id: 'payment', title: 'Thanh toán', icon: CreditCardIcon },
        { id: 'cancellation', title: 'Hủy & Hoàn tiền', icon: ArrowPathIcon },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">Chính sách & Điều khoản</h1>
                    <p className="text-xl text-white/90">
                        Minh bạch, rõ ràng và bảo vệ quyền lợi của bạn
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-4 shadow-lg sticky top-24">
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                            activeSection === section.id
                                                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <section.icon className="h-5 w-5" />
                                        <span className="font-medium text-left">{section.title}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            {activeSection === 'privacy' && <PrivacyPolicy />}
                            {activeSection === 'terms' && <TermsOfService />}
                            {activeSection === 'payment' && <PaymentPolicy />}
                            {activeSection === 'cancellation' && <CancellationPolicy />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrivacyPolicy = () => (
    <div className="prose max-w-none">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Chính sách bảo mật</h2>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-900">
                <strong>Cập nhật lần cuối:</strong> 22/11/2025
            </p>
        </div>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">1. Thu thập thông tin</h3>
            <p className="text-gray-700 mb-4">
                Chúng tôi thu thập các thông tin sau khi bạn sử dụng dịch vụ:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ</li>
                <li>Thông tin thanh toán: Chi tiết thẻ tín dụng, lịch sử giao dịch</li>
                <li>Thông tin kỹ thuật: IP address, loại thiết bị, trình duyệt</li>
                <li>Thông tin sử dụng: Lịch sử đặt tour, sở thích, đánh giá</li>
            </ul>
        </section>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">2. Sử dụng thông tin</h3>
            <p className="text-gray-700 mb-4">
                Thông tin của bạn được sử dụng để:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    'Xử lý đặt tour và thanh toán',
                    'Gửi xác nhận và thông tin tour',
                    'Cải thiện dịch vụ khách hàng',
                    'Phân tích và nghiên cứu thị trường',
                    'Gửi thông tin khuyến mãi (nếu đồng ý)',
                    'Bảo vệ chống gian lận'
                ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                    </div>
                ))}
            </div>
        </section>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">3. Bảo mật thông tin</h3>
            <p className="text-gray-700 mb-4">
                Chúng tôi áp dụng các biện pháp bảo mật tiên tiến:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Mã hóa SSL/TLS cho tất cả dữ liệu truyền tải</li>
                <li>Lưu trữ mật khẩu với thuật toán bcrypt</li>
                <li>Firewall và hệ thống phát hiện xâm nhập</li>
                <li>Kiểm tra bảo mật định kỳ</li>
                <li>Tuân thủ chuẩn PCI DSS cho thanh toán</li>
            </ul>
        </section>
    </div>
);

const TermsOfService = () => (
    <div className="prose max-w-none">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Điều khoản sử dụng dịch vụ</h2>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">1. Chấp nhận điều khoản</h3>
            <p className="text-gray-700">
                Bằng việc sử dụng MyTour, bạn đồng ý tuân thủ các điều khoản này. Nếu không đồng ý,
                vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
        </section>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">2. Trách nhiệm người dùng</h3>
            <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-yellow-900 mb-2">Bạn cam kết:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-yellow-800">
                                <li>Cung cấp thông tin chính xác và đầy đủ</li>
                                <li>Bảo mật thông tin tài khoản</li>
                                <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                                <li>Tuân thủ quy định tại điểm đến</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">3. Quyền sở hữu trí tuệ</h3>
            <p className="text-gray-700">
                Tất cả nội dung trên website (văn bản, hình ảnh, logo, thiết kế) thuộc quyền sở hữu
                của MyTour và được bảo vệ bởi luật sở hữu trí tuệ.
            </p>
        </section>
    </div>
);

const PaymentPolicy = () => (
    <div className="prose max-w-none">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Chính sách thanh toán</h2>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Phương thức thanh toán</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { name: 'Thẻ tín dụng/Ghi nợ', desc: 'Visa, Mastercard, JCB' },
                    { name: 'Chuyển khoản', desc: 'Ngân hàng nội địa' },
                    { name: 'Ví điện tử', desc: 'Momo, ZaloPay, VNPay' }
                ].map((method, idx) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary transition-colors">
                        <h4 className="font-bold text-gray-900 mb-2">{method.name}</h4>
                        <p className="text-sm text-gray-600">{method.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quy trình thanh toán</h3>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>Chọn tour và điền thông tin</li>
                <li>Xác nhận đơn hàng và chọn phương thức thanh toán</li>
                <li>Thanh toán đặt cọc 30% (hoặc toàn bộ)</li>
                <li>Nhận xác nhận qua email/SMS</li>
                <li>Thanh toán phần còn lại trước 7 ngày khởi hành</li>
            </ol>
        </section>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-green-900 mb-2">Bảo đảm an toàn</h4>
                    <p className="text-green-800">
                        Tất cả giao dịch được mã hóa SSL 256-bit và tuân thủ chuẩn bảo mật PCI DSS.
                        Chúng tôi không lưu trữ thông tin thẻ của bạn.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const CancellationPolicy = () => (
    <div className="prose max-w-none">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Chính sách hủy & Hoàn tiền</h2>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quy định hủy tour</h3>
            <div className="space-y-4">
                {[
                    { time: 'Trên 30 ngày trước khởi hành', refund: '100%', color: 'green' },
                    { time: '15-30 ngày trước khởi hành', refund: '70%', color: 'blue' },
                    { time: '7-14 ngày trước khởi hành', refund: '50%', color: 'yellow' },
                    { time: 'Dưới 7 ngày trước khởi hành', refund: '0%', color: 'red' }
                ].map((item, idx) => (
                    <div key={idx} className={`border-l-4 border-${item.color}-500 bg-${item.color}-50 p-4 rounded-r-xl`}>
                        <div className="flex justify-between items-center">
                            <span className={`font-medium text-${item.color}-900`}>{item.time}</span>
                            <span className={`font-bold text-lg text-${item.color}-600`}>
                                Hoàn {item.refund} phí tour
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quy trình hoàn tiền</h3>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>Gửi yêu cầu hủy qua email/hotline</li>
                <li>Cung cấp mã booking và lý do hủy</li>
                <li>MyTour xác nhận và tính phí (nếu có)</li>
                <li>Hoàn tiền trong 5-7 ngày làm việc</li>
            </ol>
        </section>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-red-900 mb-2">Lưu ý quan trọng</h4>
                    <ul className="list-disc pl-5 space-y-1 text-red-800">
                        <li>Vé máy bay không hoàn trong mọi trường hợp</li>
                        <li>Visa đã làm không được hoàn tiền</li>
                        <li>Tour khuyến mãi có điều kiện hủy riêng</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default PolicyPage;