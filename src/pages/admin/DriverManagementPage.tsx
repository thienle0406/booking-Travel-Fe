import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ConfirmModal } from '../../components/Modal-Enhanced';
import { DriverStatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import type { Driver } from '../../types/driver';
import type { AdminBooking } from '../../types/booking';
import { formatCurrency, formatPhoneVN, formatLicensePlate } from '../../utils/format';
import { isValidPhoneVN, isValidLicensePlate } from '../../utils/validation';

const DriverManagementPage: React.FC = () => {
    const { companyId } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);

    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
                console.error('Khong the tai danh sach tai xe', err);
            }
        };
        fetchDrivers();
    }, [companyId]);

    const handleAddDriver = () => {
        setCurrentDriver(null);
        setIsModalOpen(true);
    };

    const handleEditDriver = (driver: Driver) => {
        setCurrentDriver(driver);
        setIsModalOpen(true);
    };

    const handleSaveDriver = async (driverData: Driver) => {
        if (!companyId) return;
        try {
            const body = {
                name: driverData.name,
                phone: driverData.phone,
                licensePlate: driverData.licensePlate || '',
                vehicleInfo: driverData.vehicleInfo || '',
                status: driverData.status,
                companyId,
            };
            if (driverData.id) {
                const updated = await apiService.drivers.update(driverData.id, body);
                setDrivers(prev => prev.map(d => d.id === updated.id ? updated : d));
            } else {
                const created = await apiService.drivers.create(body);
                setDrivers(prev => [...prev, created]);
            }
        } catch (err) {
            console.error('Khong the luu tai xe', err);
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
            console.error('Khong the xoa tai xe', err);
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
            console.error('Khong the tai doanh thu theo tai xe', err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quan ly Tai xe</h1>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAddDriver}
                    className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
                >
                    <PlusIcon className="h-5 w-5 mr-2" /> Them Tai xe moi
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ten tai xe</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">So dien thoai</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bien so xe</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trang thai</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hanh dong</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver) => (
                        <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{driver.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPhoneVN(driver.phone)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                {driver.licensePlate ? formatLicensePlate(driver.licensePlate) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <DriverStatusBadge status={driver.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button
                                    onClick={() => handleViewRevenue(driver)}
                                    className="text-emerald-600 hover:text-emerald-800"
                                >
                                    Xem doanh thu
                                </button>
                                <button onClick={() => handleEditDriver(driver)} className="text-primary hover:text-blue-900">
                                    Sua
                                </button>
                                <button onClick={() => handleDeleteDriver(driver.id)} className="text-red-600 hover:text-red-900">
                                    Xoa
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentDriver ? "Chinh sua Tai xe" : "Them Tai xe moi"}>
                <EditDriverForm
                    driver={currentDriver}
                    onSave={handleSaveDriver}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xoa tai xe?"
                message="Ban co chac chan muon xoa tai xe nay?"
                confirmText="Dong y"
                cancelText="Huy"
                type="danger"
            />

            <Modal
                isOpen={isRevenueModalOpen}
                onClose={() => setIsRevenueModalOpen(false)}
                title={revenueDriver ? `Doanh thu tu tour cua ${revenueDriver.name}` : 'Doanh thu theo tai xe'}
                size="lg"
            >
                <DriverRevenueContent driver={revenueDriver} bookings={driverBookings} />
            </Modal>
        </div>
    );
};

export default DriverManagementPage;

// Form them/sua Tai xe
interface EditDriverFormProps {
    driver: Driver | null;
    onSave: (driver: Driver) => void;
    onCancel: () => void;
}

const EditDriverForm: React.FC<EditDriverFormProps> = ({ driver, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: driver?.name || '',
        phone: driver?.phone || '',
        licensePlate: driver?.licensePlate || '',
        vehicleInfo: driver?.vehicleInfo || '',
        status: driver?.status || 'available' as const,
        companyId: driver?.companyId || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Ten khong duoc trong.';
        if (!isValidPhoneVN(formData.phone)) newErrors.phone = 'SDT phai la 10 so, bat dau bang 0.';
        if (formData.licensePlate && !isValidLicensePlate(formData.licensePlate)) {
            newErrors.licensePlate = 'Bien so khong hop le (VD: 51G12345).';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave({ ...formData, id: driver?.id || '', status: formData.status as 'available' | 'busy' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="label">Ten tai xe *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className={`input ${errors.name ? 'border-red-500' : ''}`} placeholder="Nguyen Van A" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
                <label className="label">So dien thoai *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className={`input ${errors.phone ? 'border-red-500' : ''}`} placeholder="0912345678" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Bien so xe</label>
                    <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange}
                        className={`input font-mono ${errors.licensePlate ? 'border-red-500' : ''}`} placeholder="51G12345" />
                    {errors.licensePlate && <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>}
                </div>
                <div>
                    <label className="label">Thong tin xe</label>
                    <input type="text" name="vehicleInfo" value={formData.vehicleInfo} onChange={handleChange}
                        className="input" placeholder="Toyota Innova 7 cho" />
                </div>
            </div>
            <div>
                <label className="label">Trang thai</label>
                <select name="status" value={formData.status} onChange={handleChange} className="input">
                    <option value="available">Ranh</option>
                    <option value="busy">Ban</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="btn-secondary">Huy</button>
                <button type="submit" className="btn-primary">Luu thay doi</button>
            </div>
        </form>
    );
};

// Doanh thu theo tai xe
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
                    <p className="text-sm text-gray-500">Tong doanh thu (da xac nhan)</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
                </div>
            </div>
            <div className="border-t pt-4">
                {bookings.length === 0 ? (
                    <p className="text-gray-500 text-sm">Chua co booking nao da xac nhan cho tai xe nay.</p>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Ma Booking</th>
                                <th className="px-4 py-2 text-left">Khach hang</th>
                                <th className="px-4 py-2 text-left">Ngay dat</th>
                                <th className="px-4 py-2 text-right">So tien</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(b => (
                                <tr key={b.id}>
                                    <td className="px-4 py-2">{b.id}</td>
                                    <td className="px-4 py-2">{b.customerName}</td>
                                    <td className="px-4 py-2">{b.bookingDate}</td>
                                    <td className="px-4 py-2 text-right font-medium">{formatCurrency(b.totalPrice)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};