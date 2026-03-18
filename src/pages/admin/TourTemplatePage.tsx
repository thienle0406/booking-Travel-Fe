// src/pages/admin/TourTemplatePage.tsx
import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/format';
import ReactQuill from 'react-quill';

import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { ConfirmModal } from '../../components/Modal-Enhanced';
import { useToast } from '../../components/Toast';
import type { TourTemplate } from '../../types/tour';
import type { TourCategory } from '../../types/category';

// Cấu hình Toolbar cho ReactQuill (nhiều công cụ hơn nhưng vẫn gọn)
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }, { size: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
    ]
};

const quillFormats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'indent',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image'
];

const TourTemplatePage: React.FC = () => {
    const { companyId } = useAuth();
    const [templates, setTemplates] = useState<TourTemplate[]>([]);
    const [categories, setCategories] = useState<TourCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<TourTemplate | null>(null);

    // Popup xác nhận xóa template
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const fetchData = async () => {
        if (!companyId) return;
        setLoading(true);
        setError(null);
        try {
            const [templateData, categoryData] = await Promise.all([
                apiService.tourTemplates.getAll(companyId),
                apiService.categories.getAll(companyId)
            ]);
            setTemplates(templateData);
            setCategories(categoryData);
        } catch (err) {
            console.error(err);
            setError('Không thể tải dữ liệu tour. Vui lòng kiểm tra kết nối API.');
        }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [companyId]);
    const handleOpenModal = (template: TourTemplate | null) => {
        setCurrentTemplate(template);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveTemplate = async (templateData: Omit<TourTemplate, 'id'> | TourTemplate) => {
        if (!companyId) return;
        try {
            if ('id' in templateData) {
                const updatedTemplate = await apiService.tourTemplates.update(templateData.id, templateData);
                setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
            } else {
                const newTemplate = await apiService.tourTemplates.create(templateData);
                setTemplates(prev => [newTemplate, ...prev]);
            }
            handleCloseModal();
        } catch (err) { alert('Lỗi: Không thể lưu tour.'); }
    };

    const handleDeleteTemplate = (templateId: string) => {
        setConfirmDeleteId(templateId);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            await apiService.tourTemplates.delete(confirmDeleteId);
            setTemplates(prev => prev.filter(t => t.id !== confirmDeleteId));
        } catch (err) {
            console.error('Lỗi: Không thể xóa tour.', err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu tour...</div>;

    return (
        <div>
            {/* HIỂN THỊ THÔNG BÁO LỖI NẾU CÓ */}
            {error && (
                <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Tour (Template)</h1>
                <button onClick={() => handleOpenModal(null)} className="btn-primary">
                    <PlusIcon className="h-5 w-5 mr-2" /> Thêm Tour Mới
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left">Tên Tour</th>
                        <th className="px-6 py-3 text-left">Danh mục</th>
                        <th className="px-6 py-3 text-left">Giá Gốc</th>
                        <th className="px-6 py-3 text-left">Giảm giá</th>
                        <th className="px-6 py-3 text-right">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {templates.map((template) => (
                        <tr key={template.id}>
                            <td className="px-6 py-4 font-medium">{template.name}</td>
                            <td className="px-6 py-4">{categories.find(c => c.id === template.categoryId)?.name || 'N/A'}</td>
                            <td className="px-6 py-4 text-gray-600">{formatCurrency(template.defaultPrice)}</td>
                            <td className="px-6 py-4 font-bold text-red-600">{template.discountPercent > 0 ? `${template.discountPercent}%` : 'Không'}</td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleOpenModal(template)} className="text-primary hover:text-blue-900 mr-4"><PencilIcon className="h-5 w-5 inline-block" /></button>
                                <button onClick={() => handleDeleteTemplate(template.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5 inline-block" /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {templates.length === 0 && !loading && (
                    <div className="text-center py-4 text-gray-500">Chưa có template tour nào được tạo.</div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentTemplate ? "Chỉnh sửa Tour" : "Thêm Tour mới"}
                size="80%"
            >
                <EditTourTemplateForm
                    template={currentTemplate}
                    categories={categories}
                    onSave={handleSaveTemplate}
                    onCancel={handleCloseModal}
                />
            </Modal>

            {/* Popup xác nhận xóa tour template */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa tour template?"
                message="Bạn có chắc chắn muốn xóa tour template này? Hành động này không thể hoàn tác."
                confirmText="Đồng ý"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
};

// --- Component Form Thêm/Sửa ---
interface EditTourTemplateFormProps {
    template: TourTemplate | null;
    categories: TourCategory[];
    onSave: (template: Omit<TourTemplate, 'id'> | TourTemplate) => void;
    onCancel: () => void;
}

const EditTourTemplateForm: React.FC<EditTourTemplateFormProps> = ({ template, categories, onSave, onCancel }) => {
    const { companyId } = useAuth();
    const toast = useToast();
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: template?.name || '',
        destination: template?.destination || '',
        defaultPrice: template?.defaultPrice || 0,
        discountPercent: template?.discountPercent || 0,
        imageUrl: template?.imageUrl || '',
        categoryId: template?.categoryId || (categories[0]?.id || ''),
    });

    // Ưu tiên dùng descriptionHtml (đúng với BE), fallback về description cũ hoặc placeholder
    const [descriptionHtml, setDescriptionHtml] = useState(
        template?.descriptionHtml || template?.description || '<p>Nhập mô tả chi tiết, lịch trình, chính sách...</p>'
    );
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (html: string) => {
        setDescriptionHtml(html);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileToUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            // Tìm tên category hiện tại để đặt folder, ví dụ "Biển đảo" -> "biendao" (BE slugify)
            const currentCategory = categories.find(c => c.id === formData.categoryId);
            const folderName = currentCategory?.name || 'tours';

            const uploadedUrl = await apiService.files.upload(file, folderName);
            setUploading(false);
            setFileToUpload(null);
            return uploadedUrl;
        } catch (error) {
            setUploading(false);
            alert('Lỗi upload ảnh.');
            console.error(error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) return;

        let finalImageUrl = formData.imageUrl;

        if (fileToUpload) {
            const uploadedUrl = await handleUpload(fileToUpload);
            if (!uploadedUrl) return;
            finalImageUrl = uploadedUrl;
        }

        const finalData = {
            ...formData,
            defaultPrice: Number(formData.defaultPrice),
            discountPercent: Number(formData.discountPercent),
            // Gửi cả 2 field để BE/JPA nhận đúng:
            // - description: dùng cho FE cũ
            // - descriptionHtml: map trực tiếp vào field Java 'descriptionHtml'
            description: descriptionHtml,
            descriptionHtml: descriptionHtml,
            companyId: companyId,
            imageUrl: finalImageUrl,
        };

        onSave(template ? ({ ...template, ...finalData } as TourTemplate) : (finalData as Omit<TourTemplate, 'id'>));
    };

    // Tính số ký tự & số từ để kiểm soát nội dung
    const plainText = descriptionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const charCount = plainText.length;
    const wordCount = plainText ? plainText.split(' ').length : 0;

    return (
        // ĐÃ SỬA: Sử dụng flex-col h-full để Modal quản lý chiều cao và loại bỏ cuộn thừa
        <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-4">

            {/* KHỐI NỘI DUNG CUỘN (Scrollable Content Block) */}
            <div className="flex-grow overflow-y-auto space-y-6 pr-2">

                {/* GRID: Căn chỉnh lại các trường */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* === CỘT 1 (4 fields) === */}
                    <div className="space-y-6">
                        <div>
                            <label className="label">Tên Tour</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
                        </div>
                        <div>
                            <label className="label">Điểm đến</label>
                            <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="input" required />
                        </div>
                        <div>
                            <label className="label">Giá Gốc (VNĐ)</label>
                            <input type="number" name="defaultPrice" value={formData.defaultPrice} onChange={handleChange} className="input" required />
                        </div>
                    </div>

                    {/* === CỘT 2 (4 fields) === */}
                    <div className="space-y-6">
                        {/* TRƯỜNG PHỨC TẠP: LINK/UPLOAD FILE (Căn chỉnh với Tên Tour) */}
                        <div>
                            <label className="label">Link Ảnh Bìa / Tải lên File</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="input flex-1"
                                    placeholder="Hoặc dán URL ảnh trực tiếp..."
                                />
                                <label className="btn-secondary whitespace-nowrap cursor-pointer">
                                    {uploading ? 'Đang tải...' : (fileToUpload ? 'Đã chọn file' : 'Chọn File')}
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            {fileToUpload && (
                                <p className="text-xs text-gray-500 mt-1">File đã chọn: {fileToUpload.name}</p>
                            )}
                            {formData.imageUrl && !fileToUpload && (
                                <p className="text-xs text-blue-600 mt-1">Đang dùng URL: {formData.imageUrl.substring(0, 50)}...</p>
                            )}
                        </div>

                        {/* TRƯỜNG ĐƠN GIẢN: DANH MỤC (Căn chỉnh với Điểm đến) */}
                        <div>
                            <label className="label">Danh mục Tour</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="input" required>
                                <option value="" disabled>-- Chọn danh mục --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Giảm giá (%)</label>
                            <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} className="input" />
                        </div>
                        {/* 2 DIV RỖNG để cân bằng với Giá Gốc và Giảm giá */}
                        <div/>
                        <div/>
                    </div>
                </div>

                {/* MÔ TẢ CHI TIẾT (ReactQuill + Preview + Stats) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="label mb-1">Mô tả chi tiết</label>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{wordCount} từ</span>
                            <span>•</span>
                            <span>{charCount} ký tự</span>
                            <span>•</span>
                            <button
                                type="button"
                                onClick={() => setShowPreview(prev => !prev)}
                                className="underline text-primary"
                            >
                                {showPreview ? 'Quay lại soạn thảo' : 'Xem trước'}
                            </button>
                        </div>
                    </div>

                    {!showPreview && (
                        <ReactQuill
                            theme="snow"
                            value={descriptionHtml}
                            onChange={handleEditorChange}
                            modules={quillModules}
                            formats={quillFormats}
                            className="h-64"
                        />
                    )}

                    {showPreview && (
                        <div className="border rounded-md p-4 bg-gray-50 max-h-64 overflow-y-auto text-sm prose prose-sm max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                        </div>
                    )}

                    <div className="text-xs text-gray-500">
                        Gợi ý: chia nội dung thành các phần như <strong>Lịch trình</strong>,{' '}
                        <strong>Giá bao gồm</strong>, <strong>Giá không bao gồm</strong>, <strong>Chính sách hủy</strong>{' '}
                        để khách dễ đọc hơn.
                    </div>
                </div>
            </div>

            {/* KHỐI NÚT CỐ ĐỊNH (Fixed Button Block) */}
            {/* Sử dụng flex-shrink-0 để cố định khối này ở dưới cùng và không bị cuộn */}
            <div className="flex justify-end space-x-3 pt-4 border-t mt-4 bg-white/90 flex-shrink-0">
                <button type="button" onClick={onCancel} className="btn-secondary">Hủy</button>
                <button type="submit" className="btn-primary">Lưu Tour</button>
            </div>
        </form>
    );
};

export default TourTemplatePage;