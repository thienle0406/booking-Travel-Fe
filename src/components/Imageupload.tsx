import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useToast } from './Toast';

interface ImageUploadProps {
    onImageSelect: (file: File, preview: string) => void;
    currentImage?: string;
    maxSize?: number; // MB
    aspectRatio?: string; // e.g., "16/9", "1/1"
}

const ImageUpload: React.FC<ImageUploadProps> = ({
                                                     onImageSelect,
                                                     currentImage,
                                                     maxSize = 5, // 5MB default
                                                     // aspectRatio = '16/9'
                                                 }) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    const handleFileChange = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh hợp lệ');
            return;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`Kích thước ảnh phải nhỏ hơn ${maxSize}MB`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreview(result);
            onImageSelect(file, result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file);
                }}
                className="hidden"
            />

            {preview ? (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
                        <button
                            onClick={handleClick}
                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                            <ArrowUpTrayIcon className="h-5 w-5" />
                            Thay đổi
                        </button>
                        <button
                            onClick={handleRemove}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                            <XMarkIcon className="h-5 w-5" />
                            Xóa
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragging
                            ? 'border-primary bg-pink-50'
                            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                    }`}
                >
                    <PhotoIcon className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-700 font-semibold mb-1">
                        Kéo thả ảnh vào đây hoặc click để chọn
                    </p>
                    <p className="text-sm text-gray-500">
                        PNG, JPG, GIF tối đa {maxSize}MB
                    </p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;