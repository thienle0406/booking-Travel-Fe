import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CameraIcon,
    KeyIcon,
    BellIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { ButtonLoader } from '../components/Loading';

const ProfilePage = () => {
    const { user } = useAuth();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
    const [saving, setSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&size=200&background=ec4899&color=fff`
    );

    // Profile form
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        bio: ''
    });

    // Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailBooking: true,
        emailPromotion: false,
        smsBooking: true,
        pushNotification: true
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Kích thước ảnh phải nhỏ hơn 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Cập nhật thông tin thành công!');
        } catch (err) {
            toast.error('Đã xảy ra lỗi');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Đổi mật khẩu thành công!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error('Mật khẩu hiện tại không đúng');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Thông tin cá nhân', icon: UserCircleIcon },
        { id: 'security', label: 'Bảo mật', icon: ShieldCheckIcon },
        { id: 'notifications', label: 'Thông báo', icon: BellIcon }
    ] as const;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl p-8 text-white mb-8">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <img
                                    src={avatarPreview}
                                    alt={user?.username}
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                                />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <CameraIcon className="h-8 w-8 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-1">{user?.username}</h1>
                                <p className="text-white/90">{user?.email}</p>
                                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mt-2">
                                    {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="border-b">
                            <div className="flex">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                                            activeTab === tab.id
                                                ? 'text-primary border-b-2 border-primary bg-pink-50'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <tab.icon className="h-5 w-5" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Họ và tên
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={profileData.username}
                                                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                                                    className="input pl-10"
                                                />
                                                <UserCircleIcon className="icon-input" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                                    className="input pl-10"
                                                    disabled
                                                />
                                                <EnvelopeIcon className="icon-input" />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                                    className="input pl-10"
                                                    placeholder="0912345678"
                                                />
                                                <PhoneIcon className="icon-input" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Địa chỉ
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={profileData.address}
                                                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                                    className="input pl-10"
                                                    placeholder="Thành phố, quốc gia"
                                                />
                                                <MapPinIcon className="icon-input" />                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giới thiệu về bạn
                                        </label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                            className="input min-h-[120px]"
                                            placeholder="Chia sẻ một chút về bản thân..."
                                        />
                                    </div>

                                    <button type="submit" disabled={saving} className="btn-primary">
                                        {saving ? <ButtonLoader /> : 'Lưu thay đổi'}
                                    </button>
                                </form>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>

                                    <div className="max-w-md space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mật khẩu hiện tại
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                    className="input pl-10"
                                                    placeholder="••••••••"
                                                />
                                                <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                    className="input pl-10"
                                                    placeholder="••••••••"
                                                />
                                                <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                    className="input pl-10"
                                                    placeholder="••••••••"
                                                />
                                                <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={saving} className="btn-primary">
                                        {saving ? <ButtonLoader /> : 'Đổi mật khẩu'}
                                    </button>
                                </form>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt thông báo</h2>

                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailBooking', label: 'Email xác nhận booking', desc: 'Nhận email khi đặt tour thành công' },
                                            { key: 'emailPromotion', label: 'Email khuyến mãi', desc: 'Nhận thông tin về các tour mới và ưu đãi' },
                                            { key: 'smsBooking', label: 'SMS xác nhận', desc: 'Nhận tin nhắn khi booking được xác nhận' },
                                            { key: 'pushNotification', label: 'Thông báo đẩy', desc: 'Thông báo trên trình duyệt' }
                                        ].map(item => (
                                            <label key={item.key} className="flex items-start gap-4 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications[item.key as keyof typeof notifications]}
                                                    onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                                                    className="mt-1 w-5 h-5 text-primary rounded"
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{item.label}</h4>
                                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <button className="btn-primary">Lưu cài đặt</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;