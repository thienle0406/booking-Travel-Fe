import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import {Component, type ErrorInfo, type ReactNode} from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo:  ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // You can log to error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                    <div className="max-w-2xl w-full">
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                                <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Oops! Có lỗi xảy ra
                            </h1>

                            {/* Message */}
                            <p className="text-gray-600 mb-6">
                                Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
                            </p>

                            {/* Error Details (Development only) */}
                            {import.meta.env.DEV && this.state.error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                                    <h3 className="font-bold text-red-900 mb-2">Chi tiết lỗi:</h3>
                                    <pre className="text-sm text-red-800 overflow-auto max-h-40">
                                        {this.state.error.toString()}
                                    </pre>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={this.handleReset}
                                    className="btn-primary justify-center"
                                >
                                    <ArrowPathIcon className="h-5 w-5" />
                                    Tải lại trang
                                </button>
                                <a
                                    href="/"
                                    className="btn-secondary justify-center"
                                >
                                    Về trang chủ
                                </a>
                            </div>

                            {/* Support */}
                            <div className="mt-8 pt-6 border-t">
                                <p className="text-sm text-gray-600">
                                    Cần hỗ trợ? Liên hệ:{' '}
                                    <a href="tel:+00232677" className="text-primary font-semibold hover:underline">
                                        +00 232 677
                                    </a>
                                    {' '}hoặc{' '}
                                    <a href="mailto:support@mytour.com" className="text-primary font-semibold hover:underline">
                                        support@mytour.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;