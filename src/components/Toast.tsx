import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

// ==================== TYPES ====================
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

// ==================== CONTEXT ====================
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

// ==================== PROVIDER ====================
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 4000);
    }, []);

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}

            {/* Toast Container - Fixed position */}
            <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// ==================== TOAST ITEM COMPONENT ====================
interface ToastItemProps {
    toast: Toast;
    onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
    const { type, message } = toast;

    // Config for each type
    const config = {
        success: {
            bg: 'bg-green-500',
            icon: CheckCircleIcon,
            text: 'text-white'
        },
        error: {
            bg: 'bg-red-500',
            icon: ExclamationCircleIcon,
            text: 'text-white'
        },
        warning: {
            bg: 'bg-yellow-500',
            icon: ExclamationCircleIcon,
            text: 'text-white'
        },
        info: {
            bg: 'bg-blue-500',
            icon: InformationCircleIcon,
            text: 'text-white'
        }
    };

    const { bg, icon: Icon, text } = config[type];

    return (
        <div
            className={`
                ${bg} ${text} 
                px-6 py-4 rounded-lg shadow-2xl 
                flex items-center gap-3 min-w-[320px] max-w-md
                pointer-events-auto
                animate-slideInRight
                backdrop-blur-sm bg-opacity-95
            `}
        >
            <Icon className="h-6 w-6 flex-shrink-0" />
            <p className="flex-1 font-medium">{message}</p>
            <button
                onClick={onClose}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default ToastProvider;