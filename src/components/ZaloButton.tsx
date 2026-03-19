// src/components/ZaloButton.tsx
// Nút bong bóng Zalo + Hotline nổi ở góc màn hình (dành cho mobile-first)
import { useState } from 'react';
import { PhoneIcon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

interface ZaloButtonProps {
    zaloUrl?: string;       // VD: "https://zalo.me/0912345678"
    hotline?: string;        // VD: "0912345678"
}

const ZaloButton: React.FC<ZaloButtonProps> = ({
    zaloUrl = 'https://zalo.me/0338739493',
    hotline = '0338739493',
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Expanded Actions */}
            {isExpanded && (
                <div className="flex flex-col gap-3 animate-fadeInUp">
                    {/* Zalo */}
                    <a
                        href={zaloUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        <span className="font-semibold text-sm whitespace-nowrap">Chat Zalo</span>
                    </a>

                    {/* Hotline */}
                    <a
                        href={`tel:${hotline}`}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <PhoneIcon className="h-5 w-5" />
                        <span className="font-semibold text-sm whitespace-nowrap">{hotline}</span>
                    </a>
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                    isExpanded
                        ? 'bg-gray-700 hover:bg-gray-800 rotate-0'
                        : 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 animate-bounce-slow'
                }`}
            >
                {isExpanded ? (
                    <XMarkIcon className="h-6 w-6 text-white" />
                ) : (
                    <PhoneIcon className="h-6 w-6 text-white" />
                )}
            </button>
        </div>
    );
};

export default ZaloButton;
