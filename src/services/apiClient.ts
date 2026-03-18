// src/services/apiClient.ts
import axios from 'axios';

// Đặt Base URL cho API Java của bạn
const API_BASE_URL = 'http://localhost:8081/api/v1'; // Hoặc /api/v1 nếu dùng proxy

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// === RẤT QUAN TRỌNG: Interceptor ===
// Tự động thêm Token (JWT) vào header của MỌI request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Nếu data là FormData, xóa Content-Type để browser tự set boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;