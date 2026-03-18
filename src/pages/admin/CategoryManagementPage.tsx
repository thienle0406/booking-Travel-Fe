import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ConfirmModal } from '../../components/Modal-Enhanced';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { useToast } from '../../components/Toast';
import type { TourCategory } from '../../types/category';
import ImageUpload from '../../components/Imageupload';

const CategoryManagementPage: React.FC = () => {
    const { companyId } = useAuth();
    const toast = useToast();
    const [categories, setCategories] = useState<TourCategory[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<TourCategory | null>(null);
    const [loading, setLoading] = useState(false);

    // Popup xác nhận xóa category
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (!companyId) return;
        fetchCategories();
    }, [companyId]);

    const fetchCategories = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            const data = await apiService.categories.getAll(companyId);
            setCategories(data);
        } catch (err: any) {
            console.error('Không thể tải danh sách danh mục', err);
            toast.error(err.message || 'Không thể tải danh sách danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = () => {
        setCurrentCategory(null);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category: TourCategory) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const handleSaveCategory = async (categoryData: { name: string; imageUrl?: string }) => {
        if (!companyId) return;
        try {
            if (currentCategory?.id) {
                // Update
                const updated = await apiService.categories.update(currentCategory.id, {
                    name: categoryData.name,
                    imageUrl: categoryData.imageUrl
                });
                setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
                toast.success('Cập nhật danh mục thành công!');
            } else {
                // Create
                const created = await apiService.categories.create({
                    name: categoryData.name,
                    companyId,
                    imageUrl: categoryData.imageUrl
                });
                setCategories(prev => [...prev, created]);
                toast.success('Tạo danh mục thành công!');
            }
        } catch (err: any) {
            console.error('Không thể lưu danh mục', err);
            toast.error(err.message || 'Không thể lưu danh mục');
        } finally {
            setIsModalOpen(false);
            setCurrentCategory(null);
        }
    };

    const handleDeleteCategory = (categoryId: string) => {
        setConfirmDeleteId(categoryId);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            await apiService.categories.delete(confirmDeleteId);
            setCategories(prev => prev.filter(c => c.id !== confirmDeleteId));
            toast.success('Xóa danh mục thành công!');
        } catch (err: any) {
            console.error('Không thể xóa danh mục', err);
            toast.error(err.message || 'Không thể xóa danh mục');
        } finally {
            setConfirmDeleteId(null);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Danh mục Du lịch</h1>
                <button onClick={handleAddCategory} className="btn-primary flex items-center gap-2">
                    <PlusIcon className="h-5 w-5" />
                    Thêm danh mục mới
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <p className="text-gray-500 text-lg">Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            {/* Hình ảnh danh mục */}
                            <div className="relative h-48 bg-gradient-to-br from-pink-500 to-orange-500">
                                {category.imageUrl ? (
                                    <img
                                        src={category.imageUrl.startsWith('http') ? category.imageUrl : `http://localhost:8081${category.imageUrl}`}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback nếu ảnh lỗi
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                                        {category.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Thông tin danh mục */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleEditCategory(category)}
                                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal thêm/chỉnh sửa Category */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentCategory(null);
                }}
                title={currentCategory ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
                size="md"
            >
                <EditCategoryForm
                    category={currentCategory}
                    onSave={handleSaveCategory}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setCurrentCategory(null);
                    }}
                />
            </Modal>

            {/* Popup xác nhận xóa category */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa danh mục?"
                message="Bạn có chắc chắn muốn xóa danh mục này? Nếu có tour đang sử dụng danh mục này, bạn sẽ không thể xóa."
                confirmText="Đồng ý"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
};

// --- Component Form Sửa Category ---
interface EditCategoryFormProps {
    category: TourCategory | null;
    onSave: (data: { name: string; imageUrl?: string }) => void;
    onCancel: () => void;
}

const EditCategoryForm: React.FC<EditCategoryFormProps> = ({ category, onSave, onCancel }) => {
    const [name, setName] = useState(category?.name || '');
    const [imageUrl, setImageUrl] = useState<string | undefined>(category?.imageUrl);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(
        category?.imageUrl ? (category.imageUrl.startsWith('http') ? category.imageUrl : `http://localhost:8081${category.imageUrl}`) : null
    );
    const toast = useToast();

    useEffect(() => {
        setName(category?.name || '');
        setImageUrl(category?.imageUrl);
        setPreview(
            category?.imageUrl
                ? category.imageUrl.startsWith('http')
                    ? category.imageUrl
                    : `http://localhost:8081${category.imageUrl}`
                : null
        );
    }, [category]);

    const handleImageSelect = async (file: File, previewUrl: string) => {
        setSelectedFile(file);
        setPreview(previewUrl);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.warning('Vui lòng nhập tên danh mục');
            return;
        }

        setUploading(true);
        try {
            let finalImageUrl = imageUrl;

            // Upload ảnh mới nếu có
            if (selectedFile) {
                // Lưu ảnh danh mục vào folder "categories"
                const uploadedUrl = await apiService.files.upload(selectedFile, 'categories');
                finalImageUrl = uploadedUrl;
            }

            onSave({ name: name.trim(), imageUrl: finalImageUrl });
        } catch (err: any) {
            console.error('Lỗi khi upload ảnh', err);
            toast.error(err.message || 'Lỗi khi upload ảnh');
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="label">Tên danh mục *</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    placeholder="Ví dụ: Biển đảo, Dã ngoại, Du thuyền..."
                    required
                />
            </div>

            <div>
                <label className="label">Hình ảnh danh mục</label>
                <ImageUpload
                    onImageSelect={handleImageSelect}
                    currentImage={preview || undefined}
                    maxSize={5}
                />
                {preview && (
                    <p className="text-xs text-gray-500 mt-2">
                        Ảnh hiện tại sẽ được thay thế khi bạn chọn ảnh mới
                    </p>
                )}
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 btn-secondary"
                    disabled={uploading}
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={uploading}
                >
                    {uploading ? 'Đang lưu...' : category ? 'Cập nhật' : 'Tạo mới'}
                </button>
            </div>
        </form>
    );
};

export default CategoryManagementPage;
