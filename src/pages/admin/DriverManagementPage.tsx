import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ConfirmModal } from '../../components/Modal-Enhanced';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import type { Driver } from '../../types/driver';
import type { AdminBooking } from '../../types/booking';
import { formatCurrency } from '../../utils/format';

const DriverManagementPage: React.FC = () => {
    const { companyId } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);

    // Popup xác nhận xóa tài xế
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Modal xem doanh thu theo tài xế
    const [revenueDriver, setRevenueDriver] = useState<Driver | null>(null);
    const [driverBookings, setDriverBookings] = useState<AdminBooking[]>([]);
    const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);

    useEffect(() => {
        if (!companyId) return;
        const fetchDrivers = async () => {
            try {
                const data = await apiService.drivers.getAll(companyId);
                setDrivers(data);
            } catch (err) {
                console.error('Không thể tải danh sách tài xế', err);
            }
        };
        fetchDrivers();
    }, [companyId]);

    const handleAddDriver = () => {
        setCurrentDriver(null); // Để trống form cho driver mới
        setIsModalOpen(true);
    };

    const handleEditDriver = (driver: Driver) => {
        setCurrentDriver(driver);
        setIsModalOpen(true);
    };

    const handleSaveDriver = async (driverData: Driver) => {
        if (!companyId) return;
        try {
            if (driverData.id) {
                const updated = await apiService.drivers.update(driverData.id, {
                    name: driverData.name,
                    phone: driverData.phone,
                    status: driverData.status,
                    companyId
                });
                setDrivers(prev => prev.map(d => d.id === updated.id ? updated : d));
            } else {
                const created = await apiService.drivers.create({
                    name: driverData.name,
                    phone: driverData.phone,
                    status: driverData.status,
                    companyId
                });
                setDrivers(prev => [...prev, created]);
            }
        } catch (err) {
            console.error('Không thể lưu tài xế', err);
        } finally {
            setIsModalOpen(false);
            setCurrentDriver(null);
        }
    };

    const handleDeleteDriver = (driverId: string) => {
        setConfirmDeleteId(driverId);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            await apiService.drivers.delete(confirmDeleteId);
            setDrivers(prev => prev.filter(d => d.id !== confirmDeleteId));
        } catch (err) {
            console.error('Không thể xóa tài xế', err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    const handleViewRevenue = async (driver: Driver) => {
        try {
            const bookings = await apiService.bookings.getByDriver(driver.id);
            setDriverBookings(bookings.filter(b => b.status === 'Confirmed'));
            setRevenueDriver(driver);
            setIsRevenueModalOpen(true);
        } catch (err) {
            console.error('Không thể tải doanh thu theo tài xế', err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Tài xế</h1>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAddDriver}
                    className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
                >
                    <PlusIcon className="h-5 w-5 mr-2" /> Thêm Tài xế mới
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên tài xế</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver) => (
                        <tr key={driver.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{driver.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {driver.status === 'available' ? 'Rảnh' : 'Đang bận'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button
                                    onClick={() => handleViewRevenue(driver)}
                                    className="text-emerald-600 hover:text-emerald-800"
                                >
                                    Xem doanh thu
                                </button>
                                <button onClick={() => handleEditDriver(driver)} className="text-primary hover:text-blue-900">
                                    Sửa
                                </button>
                                <button onClick={() => handleDeleteDriver(driver.id)} className="text-red-600 hover:text-red-900">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal thêm/chỉnh sửa Tài xế */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentDriver ? "Chỉnh sửa Tài xế" : "Thêm Tài xế mới"}>
                <EditDriverForm
                    driver={currentDriver}
                    onSave={handleSaveDriver}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* Popup xác nhận xóa tài xế */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa tài xế?"
                message="Bạn có chắc chắn muốn xóa tài xế này?"
                confirmText="Đồng ý"
                cancelText="Hủy"
                type="danger"
            />

            {/* Modal xem doanh thu theo tài xế */}
            <Modal
                isOpen={isRevenueModalOpen}
                onClose={() => setIsRevenueModalOpen(false)}
                title={revenueDriver ? `Doanh thu từ tour của ${revenueDriver.name}` : 'Doanh thu theo tài xế'}
                size="lg"
            >
                <DriverRevenueContent driver={revenueDriver} bookings={driverBookings} />
            </Modal>
        </div>
    );
};

export default DriverManagementPage;

// Component Form chỉnh sửa/thêm Tài xế
interface EditDriverFormProps {
    driver: Driver | null;
    onSave: (driver: Driver) => void;
    onCancel: () => void;
}

const EditDriverForm: React.FC<EditDriverFormProps> = ({ driver, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Driver, 'id'>>(driver || {
        name: '', phone: '', status: 'available', companyId: ''
    } as Omit<Driver, 'id'>);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Tên không được trống.';
        if (!formData.phone.trim() || !/^\d{10,11}$/.test(formData.phone)) newErrors.phone = 'SĐT không hợp lệ.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave({ ...formData, id: driver?.id || '' } as Driver); // Cast về Driver
        } else {
            alert('Vui lòng kiểm tra lại thông tin tài xế.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Tên tài xế</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                    <option value="available">Rảnh</option>
                    <option value="busy">Bận</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                    Hủy
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700">
                    Lưu thay đổi
                </button>
            </div>
        </form>
    );
};

// Hiển thị doanh thu theo tài xế
const DriverRevenueContent: React.FC<{ driver: Driver | null; bookings: AdminBooking[] }> = ({ driver, bookings }) => {
    if (!driver) return null;

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-lg">{driver.name}</p>
                    <p className="text-sm text-gray-600">{driver.phone}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Tổng doanh thu (đã xác nhận)</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
                </div>
            </div>

            <div className="border-t pt-4">
                {bookings.length === 0 ? (
                    <p className="text-gray-500 text-sm">Chưa có booking nào đã xác nhận cho tài xế này.</p>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã Booking</th>
                                <th className="px-4 py-2 text-left">Khách hàng</th>
                                <th className="px-4 py-2 text-left">Ngày đặt</th>
                                <th className="px-4 py-2 text-right">Số tiền</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(b => (
                                <tr key={b.id}>
                                    <td className="px-4 py-2">{b.id}</td>
                                    <td className="px-4 py-2">{b.customerName}</td>
                                    <td className="px-4 py-2">{b.bookingDate}</td>
                                    <td className="px-4 py-2 text-right font-medium">
                                        {formatCurrency(b.totalPrice)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}