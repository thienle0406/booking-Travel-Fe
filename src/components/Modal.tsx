// src/components/Modal.tsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    // THÊM '80%' VÀO DANH SÁCH SIZE
    size?: 'sm' | 'md' | 'lg' | 'xl' | '3xl' | '4xl' | '5xl' | '80%';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    // === SỬA LOGIC SIZE ===
    let widthClass = 'w-full max-w-md'; // Default
    if (size === 'sm') widthClass = 'w-full max-w-sm';
    else if (size === 'md') widthClass = 'w-full max-w-md';
    else if (size === 'lg') widthClass = 'w-full max-w-lg';
    else if (size === 'xl') widthClass = 'w-full max-w-xl';
    else if (size === '3xl') widthClass = 'w-full max-w-3xl';
    else if (size === '4xl') widthClass = 'w-full max-w-4xl';
    else if (size === '5xl') widthClass = 'w-full max-w-5xl';
    else if (size === '80%') widthClass = 'w-[80%]'; // <-- THÊM LOGIC 80%
    // ======================

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[9999]">
            {/* Sử dụng widthClass mới */}
            <div className={`bg-white rounded-lg shadow-xl relative mx-4 max-h-[90vh] flex flex-col ${widthClass}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content (cho phép cuộn) */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;