// src/pages/admin/UserManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import type { User } from '../../types/user';
import Modal from '../../components/Modal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ConfirmModal } from '../../components/Modal-Enhanced';

const UserManagementPage: React.FC = () => {
    const { companyId } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Popup xác nhận xóa user
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const fetchData = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            // Sửa lỗi API: Gọi đúng apiService.auth.getAllUsers
            const data = await apiService.auth.getAllUsers(companyId);
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [companyId]);

    const handleEdit = (user: User) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    // Mở popup xác nhận xóa
    const handleDelete = (userId: string) => {
        setConfirmDeleteId(userId);
        setIsConfirmOpen(true);
    };

    // Thực hiện xóa sau khi xác nhận (CALL API THẬT)
    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            await apiService.users.delete(Number(confirmDeleteId));
            setUsers(prev => prev.filter(u => u.id !== confirmDeleteId));
        } catch (err) {
            console.error('Lỗi: Không thể xóa người dùng.', err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    // === Gọi API PUT thật để cập nhật user (Admin) ===
    const handleSaveUser = async (updatedUser: User) => {
        try {
            const saved = await apiService.users.updateAdmin(updatedUser.id, updatedUser);
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? saved : u));
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi: Không thể lưu thông tin người dùng.', err);
        }
    };


    if (loading) return <div>Đang tải danh sách người dùng...</div>;

    const filteredUsers = users.filter((user: User) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Người dùng</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, SĐT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left">Tên đăng nhập</th>
                        <th className="px-6 py-3 text-left">Email</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-left">Ngày tạo</th>
                        <th className="px-6 py-3 text-right">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4">{user.fullName}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : user.role === 'DRIVER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                    {user.role === 'DRIVER' ? 'Tài xế' : user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>

                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleEdit(user)} className="text-primary hover:text-blue-900 mr-4" title="Sửa">
                                    <PencilIcon className="h-5 w-5 inline-block" />
                                </button>
                                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" title="Xóa">
                                    <TrashIcon className="h-5 w-5 inline-block" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Chỉnh sửa Người dùng">
                {currentUser && (
                    <EditUserForm
                        user={currentUser}
                        onSave={handleSaveUser}
                        onCancel={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>

            {/* Popup xác nhận xóa user */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa người dùng?"
                message="Bạn có chắc chắn muốn xóa người dùng này?"
                confirmText="Đồng ý"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
};

// --- Form Sửa User (Form con) ---
interface EditUserFormProps {
    user: User;
    onSave: (user: User) => void;
    onCancel: () => void;
}
const EditUserForm: React.FC<EditUserFormProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<User>(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value } as User);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="label">Họ và Tên</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input" />
            </div>
            <div>
                <label className="label">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" />
            </div>
            <div>
                <label className="label">Số điện thoại</label>
                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="input" />
            </div>
            <div>
                <label className="label">Vai trò</label>
                <select name="role" value={formData.role} onChange={handleChange} className="input">
                    <option value="USER">Người dùng</option>
                    <option value="DRIVER">Tài xế</option>
                    <option value="ADMIN">Quản trị viên</option>
                </select>
            </div>

            {/* Driver-specific fields */}
            {formData.role === 'DRIVER' && (
                <div className="border-t pt-4 mt-4 space-y-4">
                    <h3 className="font-semibold text-gray-700">Thông tin tài xế</h3>
                    <div>
                        <label className="label">Biển số xe</label>
                        <input type="text" name="licensePlate" value={formData.licensePlate || ''} onChange={handleChange} className="input" placeholder="VD: 51A-123.45" />
                    </div>
                    <div>
                        <label className="label">Thông tin xe</label>
                        <input type="text" name="vehicleInfo" value={formData.vehicleInfo || ''} onChange={handleChange} className="input" placeholder="VD: Toyota Innova 7 chỗ" />
                    </div>
                    <div>
                        <label className="label">Trạng thái</label>
                        <select name="driverStatus" value={formData.driverStatus || 'available'} onChange={handleChange} className="input">
                            <option value="available">Sẵn sàng</option>
                            <option value="busy">Đang bận</option>
                        </select>
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onCancel} className="btn-secondary">Hủy</button>
                <button type="submit" className="btn-primary">Lưu thay đổi</button>
            </div>
        </form>
    );
};

export default UserManagementPage;