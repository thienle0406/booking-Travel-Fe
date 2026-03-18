// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
// Thêm thư viện icon (nếu cần) hoặc dùng SVG
// Ví dụ: npm install react-icons
// import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-20">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

                    {/* Cột 1: Giới thiệu */}
                    <div className="md:col-span-2">
                        <Link to="/" className="text-3xl font-bold text-primary mb-4 block">MyTour</Link>
                        <p className="text-gray-600 max-w-sm mb-4">
                            Hệ thống đặt tour du lịch trực tuyến hàng đầu Việt Nam. Khám phá mọi miền đất nước với giá cả phải chăng và dịch vụ chuyên nghiệp.
                        </p>
                        <p className="text-gray-800 font-medium">E. hello@mytour.com</p>
                        <p className="text-gray-800 font-medium">P. (028) 38 123 456</p>
                    </div>

                    {/* Cột 2: Công ty */}
                    <div>
                        <h4 className="font-bold text-lg text-secondary mb-4">Công ty</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-gray-600 hover:text-primary">Về chúng tôi</Link></li>
                            <li><Link to="/policy" className="text-gray-600 hover:text-primary">Chính sách</Link></li>
                            <li><Link to="/blog" className="text-gray-600 hover:text-primary">Blog</Link></li>
                            <li><Link to="/contact" className="text-gray-600 hover:text-primary">Liên hệ</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Dịch vụ */}
                    <div>
                        <h4 className="font-bold text-lg text-secondary mb-4">Dịch vụ</h4>
                        <ul className="space-y-3">
                            <li><Link to="/tours" className="text-gray-600 hover:text-primary">Đặt tour</Link></li>
                            <li><Link to="#" className="text-gray-600 hover:text-primary">Visa</Link></li>
                            <li><Link to="#" className="text-gray-600 hover:text-primary">Hướng dẫn du lịch</Link></li>
                            <li><Link to="#" className="text-gray-600 hover:text-primary">Vé máy bay</Link></li>
                        </ul>
                    </div>

                    {/* Cột 4: Hỗ trợ */}
                    <div>
                        <h4 className="font-bold text-lg text-secondary mb-4">Hỗ trợ</h4>
                        <ul className="space-y-3">
                            <li><Link to="#" className="text-gray-600 hover:text-primary">FAQs</Link></li>
                            <li><Link to="#" className="text-gray-600 hover:text-primary">Điều khoản</Link></li>
                            <li><Link to="/policy" className="text-gray-600 hover:text-primary">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>

                    {/* Cột 5: Mạng xã hội (Bạn có thể thêm icon) */}
                    {/* <div>
            <h4 className="font-bold text-lg text-secondary mb-4">Kết nối</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-500 hover:text-primary"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-500 hover:text-primary"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-500 hover:text-primary"><FaYoutube size={24} /></a>
            </div>
          </div> */}

                </div>
            </div>

            {/* Dòng Copyright */}
            <div className="bg-lightgray py-6">
                <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                    © {new Date().getFullYear()} MyTour. All right reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;