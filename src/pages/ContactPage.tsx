import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ClockIcon,
    PaperAirplaneIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { ButtonLoader } from '../components/Loading';

const ContactPage = () => {
    const toast = useToast();
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.warning('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setSending(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm.');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (err) {
            toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">Liên hệ với chúng tôi</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Có câu hỏi hoặc cần hỗ trợ? Chúng tôi luôn sẵn sàng giúp đỡ bạn!
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Contact Cards */}
                    {[
                        {
                            icon: PhoneIcon,
                            title: 'Điện thoại',
                            content: '+00 232 677',
                            subContent: 'Thứ 2 - Chủ nhật, 8:00 - 22:00',
                            color: 'blue'
                        },
                        {
                            icon: EnvelopeIcon,
                            title: 'Email',
                            content: 'support@mytour.com',
                            subContent: 'Phản hồi trong 24 giờ',
                            color: 'pink'
                        },
                        {
                            icon: MapPinIcon,
                            title: 'Địa chỉ',
                            content: '123 Đường ABC, Quận 1',
                            subContent: 'TP. Hồ Chí Minh, Việt Nam',
                            color: 'orange'
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${
                                item.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                                    item.color === 'pink' ? 'from-pink-500 to-rose-500' :
                                        'from-orange-500 to-amber-500'
                            } mb-4`}>
                                <item.icon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-900 font-semibold mb-1">{item.content}</p>
                            <p className="text-sm text-gray-600">{item.subContent}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input pl-10"
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input pl-10"
                                            placeholder="email@example.com"
                                            required
                                        />
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input pl-10"
                                            placeholder="0912345678"
                                        />
                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chủ đề
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">Chọn chủ đề</option>
                                    <option value="general">Thắc mắc chung</option>
                                    <option value="booking">Hỗ trợ booking</option>
                                    <option value="payment">Thanh toán</option>
                                    <option value="feedback">Góp ý</option>
                                    <option value="partnership">Hợp tác</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tin nhắn *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="input min-h-[150px]"
                                    placeholder="Nhập nội dung tin nhắn của bạn..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="btn-primary w-full justify-center text-lg"
                            >
                                {sending ? (
                                    <ButtonLoader />
                                ) : (
                                    <>
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                        Gửi tin nhắn
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Map + Office Hours */}
                    <div className="space-y-6">
                        {/* Map */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193500642314!2d106.69746931533434!3d10.78631446215927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc1%3A0xb3ff69197b10ec4f!2sHCMC!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                            />
                        </div>

                        {/* Office Hours */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-3 rounded-xl">
                                    <ClockIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Giờ làm việc</h3>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { day: 'Thứ Hai - Thứ Sáu', hours: '8:00 - 22:00' },
                                    { day: 'Thứ Bảy - Chủ Nhật', hours: '9:00 - 21:00' },
                                    { day: 'Ngày lễ', hours: '10:00 - 18:00' }
                                ].map((schedule, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                        <span className="font-medium text-gray-700">{schedule.day}</span>
                                        <span className="font-bold text-primary">{schedule.hours}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <p className="text-sm text-blue-900">
                                    <strong>Lưu ý:</strong> Hỗ trợ khẩn cấp 24/7 qua hotline{' '}
                                    <a href="tel:+00232677" className="font-bold hover:underline">
                                        +00 232 677
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Kết nối với chúng tôi</h3>
                            <div className="flex gap-3">
                                {[
                                    { name: 'Facebook', color: 'bg-blue-600', icon: 'f' },
                                    { name: 'Instagram', color: 'bg-pink-600', icon: 'i' },
                                    { name: 'Twitter', color: 'bg-sky-500', icon: 't' },
                                    { name: 'YouTube', color: 'bg-red-600', icon: 'y' }
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href="#"
                                        className={`${social.color} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl hover:scale-110 transition-transform shadow-lg`}
                                    >
                                        {social.icon.toUpperCase()}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;