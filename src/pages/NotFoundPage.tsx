import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-semibold mt-4 mb-2">Trang không tồn tại</h2>
            <p className="text-gray-600 mb-8">Rất tiếc, chúng tôi không thể tìm thấy trang bạn yêu cầu.</p>
            <Link
                to="/"
                className="bg-primary text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
                Về Trang Chủ
            </Link>
        </div>
    );
};

export default NotFoundPage;