// src/pages/admin/TourDeparturePage.tsx
import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { ConfirmModal } from '../../components/Modal-Enhanced';
import { formatCurrency } from '../../utils/format';

import type { TourDeparture, TourTemplate } from '../../types/tour';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const TourDeparturePage: React.FC = () => {
    const { companyId } = useAuth();

    const [departures, setDepartures] = useState<TourDeparture[]>([]);
    const [templates, setTemplates] = useState<TourTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDeparture, setCurrentDeparture] = useState<TourDeparture | null>(null);

    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const fetchData = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            const [depData, tplData] = await Promise.all([
                apiService.tourDepartures.getAll(companyId),
                apiService.tourTemplates.getAll(companyId)
            ]);
            setDepartures(depData);
            setTemplates(tplData);
        } catch (err) {
            console.error('Lỗi tải lịch khởi hành', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [companyId]);

    const handleOpenModal = (departure: TourDeparture | null) => {
        setCurrentDeparture(departure);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentDeparture(null);
    };

    const handleSaveDeparture = async (data: Partial<TourDeparture> & { tourTemplateId: string; startDate: string; endDate: string; totalSlots: number; status: TourDeparture['status']; }) => {
        if (!companyId) return;
        try {
            // Lấy giá gốc từ template
            const tpl = templates.find(t => t.id === data.tourTemplateId);
            const originalPrice = tpl?.defaultPrice || 0;
            const discountPercent = data.discountPercent ?? 0;
            const price = originalPrice * (1 - discountPercent / 100);

            if (currentDeparture) {
                const updated = await apiService.tourDepartures.update(currentDeparture.id, {
                    ...currentDeparture,
                    ...data,
                    originalPrice,
                    discountPercent,
                    price
                });
                setDepartures(prev => prev.map(d => d.id === updated.id ? updated : d));
            } else {
                const created = await apiService.tourDepartures.create({
                    ...data,
                    originalPrice,
                    discountPercent,
                    price,
                    bookedSlots: 0,
                    companyId: companyId,
                    id: '' // BE sẽ generate
                } as TourDeparture, companyId);
                setDepartures(prev => [created, ...prev]);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Lỗi lưu lịch khởi hành', err);
        }
    };

    const handleDelete = (id: string) => {
        setConfirmDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            await apiService.tourDepartures.delete(confirmDeleteId);
            setDepartures(prev => prev.filter(d => d.id !== confirmDeleteId));
        } catch (err) {
            console.error('Lỗi xóa lịch khởi hành', err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    const getTemplateName = (templateId: string) =>
        templates.find(t => t.id === templateId)?.name || 'N/A';

    if (loading) return <div className="p-8 text-center">Đang tải lịch khởi hành...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Quản lý Lịch Khởi Hành</h1>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Thêm lịch mới
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số chỗ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {departures.map(dep => (
                        <tr key={dep.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                                {getTemplateName(dep.tourTemplateId)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {dep.startDate} → {dep.endDate}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                                <div className="flex flex-col">
                                    <span>{formatCurrency(dep.price)}</span>
                                    {dep.discountPercent > 0 && (
                                        <span className="text-xs text-gray-500">
                                            Gốc {formatCurrency(dep.originalPrice)} (-{dep.discountPercent}%)
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {dep.bookedSlots}/{dep.totalSlots}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${dep.status === 'Confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : dep.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : dep.status === 'Completed'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-red-100 text-red-800'}`}>
                                    {dep.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right text-sm">
                                <button
                                    onClick={() => handleOpenModal(dep)}
                                    className="text-primary hover:text-blue-900 mr-3"
                                    title="Sửa"
                                >
                                    <PencilIcon className="h-5 w-5 inline-block" />
                                </button>
                                <button
                                    onClick={() => handleDelete(dep.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Xóa"
                                >
                                    <TrashIcon className="h-5 w-5 inline-block" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentDeparture ? 'Chỉnh sửa lịch khởi hành' : 'Thêm lịch khởi hành mới'}
                size="lg"
            >
                <EditDepartureForm
                    departure={currentDeparture}
                    templates={templates}
                    onSave={handleSaveDeparture}
                    onCancel={handleCloseModal}
                />
            </Modal>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa lịch khởi hành?"
                message="Bạn chắc chắn muốn xóa lịch khởi hành này?"
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
};

interface EditDepartureFormProps {
    departure: TourDeparture | null;
    templates: TourTemplate[];
    onSave: (data: Partial<TourDeparture> & { tourTemplateId: string; startDate: string; endDate: string; totalSlots: number; status: TourDeparture['status']; }) => void;
    onCancel: () => void;
}

const EditDepartureForm: React.FC<EditDepartureFormProps> = ({ departure, templates, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        tourTemplateId: departure?.tourTemplateId || (templates[0]?.id || ''),
        startDate: departure?.startDate || '',
        endDate: departure?.endDate || '',
        totalSlots: departure?.totalSlots || 20,
        discountPercent: departure?.discountPercent || 0,
        status: departure?.status || 'Pending' as TourDeparture['status'],
    });

    const tpl = templates.find(t => t.id === formData.tourTemplateId);
    const originalPrice = tpl?.defaultPrice || 0;
    const price = originalPrice * (1 - formData.discountPercent / 100);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'totalSlots' || name === 'discountPercent' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.tourTemplateId || !formData.startDate || !formData.endDate) return;
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Tour Template</label>
                    <select
                        name="tourTemplateId"
                        value={formData.tourTemplateId}
                        onChange={handleChange}
                        className="input"
                    >
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="label">Số chỗ</label>
                    <input
                        type="number"
                        name="totalSlots"
                        value={formData.totalSlots}
                        min={1}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Ngày bắt đầu</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
                <div>
                    <label className="label">Ngày kết thúc</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Giảm giá (%)</label>
                    <input
                        type="number"
                        name="discountPercent"
                        value={formData.discountPercent}
                        min={0}
                        max={100}
                        onChange={handleChange}
                        className="input"
                    />
                </div>
                <div>
                    <label className="label">Giá áp dụng</label>
                    <div className="p-2 border rounded-md bg-gray-50">
                        <div className="text-sm text-gray-700">Gốc: {formatCurrency(originalPrice)}</div>
                        <div className="text-sm font-semibold text-primary">Giá bán: {formatCurrency(price)}</div>
                    </div>
                </div>
            </div>

            <div>
                <label className="label">Trạng thái</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input"
                >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="btn-secondary">
                    Hủy
                </button>
                <button type="submit" className="btn-primary">
                    Lưu
                </button>
            </div>
        </form>
    );
};

export default TourDeparturePage;