/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // === MÀU MỚI (Theo style "Travo") ===
                'primary': '#FF4F13',   // Màu Cam chủ đạo
                'secondary': '#111827', // Màu Text chính (Xám đen)
                'lightgray': '#F9FAFB', // Màu nền (Xám rất nhạt)
            }
        },
    },
    // THÊM PLUGIN TYPOGRAPHY (Cho trang Chi tiết Tour)
    plugins: [
        require('@tailwindcss/typography'),
    ],
}