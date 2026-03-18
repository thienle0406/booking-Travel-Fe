import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '80%' | 'full';
    showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         size = 'md',
                                         showCloseButton = true
                                     }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Size mappings
    const sizeClasses = {
        'sm': 'w-full max-w-sm',
        'md': 'w-full max-w-md',
        'lg': 'w-full max-w-lg',
        'xl': 'w-full max-w-xl',
        '2xl': 'w-full max-w-2xl',
        '3xl': 'w-full max-w-3xl',
        '4xl': 'w-full max-w-4xl',
        '5xl': 'w-full max-w-5xl',
        '80%': 'w-[80%]',
        'full': 'w-full h-full m-0 rounded-none'
    };

    const widthClass = sizeClasses[size] || sizeClasses.md;

    return (
        <>
            {/* Backdrop with blur */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`bg-white rounded-2xl shadow-2xl relative mx-4 max-h-[90vh] flex flex-col pointer-events-auto animate-slideInUp ${widthClass}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all hover:rotate-90 duration-300"
                                aria-label="Close modal"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

// Confirmation Modal Component
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    /**
     * Kiểu hiển thị: warning / info / success / danger (error)
     */
    type?: 'danger' | 'warning' | 'info' | 'success';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Đồng ý',
    cancelText = 'Hủy',
    type = 'warning'
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const typeColors: Record<NonNullable<ConfirmModalProps['type']>, string> = {
        danger: 'bg-red-500 hover:bg-red-600',
        warning: 'bg-yellow-500 hover:bg-yellow-600',
        info: 'bg-blue-500 hover:bg-blue-600',
        success: 'bg-green-500 hover:bg-green-600'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" showCloseButton={false}>
            <div className="text-center">
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-2.5 text-white rounded-xl font-semibold transition-colors ${typeColors[type]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// Custom animation styles for slideInUp
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .animate-slideInUp {
        animation: slideInUp 0.3s ease-out;
    }
`;
if (typeof document !== 'undefined') {
    document.head.appendChild(style);
}

export default Modal;