// src/components/admin/UserModal.js

import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';

// Định nghĩa trạng thái form ban đầu
const getInitialFormData = (user) => ({
    username: user?.username || '',
    password: '',
    confirmPassword: '',
    fullName: user?.userDetail?.fullName || '',
    email: user?.userDetail?.email || '',
    phone: user?.userDetail?.phone || '',
    address: user?.userDetail?.address || '',
    dob: user?.userDetail?.dob || '',
    gender: user?.userDetail?.gender || 'Nam',
    role: user?.role || 'READER',
});


const UserModal = ({ isOpen, onClose, onSave, user, isEdit }) => {
    const [formData, setFormData] = useState(getInitialFormData(user));
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    // Reset form khi modal được mở hoặc user thay đổi
    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialFormData(isEdit ? user : null));
            setErrors({});
        }
    }, [isOpen, isEdit, user]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    // Kiểm tra tính hợp lệ của form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'Tên đăng nhập không được để trống';
        if (!isEdit && !formData.password) newErrors.password = 'Mật khẩu không được để trống';
        if (!isEdit && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';
        if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống';
        else if (!/^[0-9]{10,11}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Chỉ gửi những dữ liệu cần thiết
            const dataToSave = {
                username: formData.username,
                role: formData.role,
                userDetail: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    dob: formData.dob,
                    gender: formData.gender,
                }
            };
            if (!isEdit) {
                dataToSave.password = formData.password;
            }
            await onSave(dataToSave);
        } catch (error) {
            // Lỗi đã được xử lý ở component cha
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 admin-z-50 admin-overflow-y-auto">
            <div className="admin-flex admin-items-center admin-justify-center admin-min-h-screen">
                {/* Overlay */}
                <div className="fixed inset-0 admin-bg-gray-500 admin-bg-opacity-75" onClick={onClose}></div>

                {/* Modal Content */}
                <div className="admin-bg-white admin-rounded-lg admin-text-left admin-overflow-hidden admin-shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="admin-p-6">
                            <div className="admin-flex admin-items-center admin-justify-between admin-mb-4">
                                <h3 className="admin-text-lg admin-font-medium admin-text-gray-900">
                                    {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                                </h3>
                                <button type="button" onClick={onClose} className="admin-p-1"><FiX size={20} /></button>
                            </div>

                            {/* Form fields */}
                            <div className="admin-space-y-4">
                                {/* Username */}
                                <div>
                                    <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-1">Tên đăng nhập *</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} disabled={isEdit} className={`admin-input ${errors.username ? 'admin-border-red-500' : ''}`} />
                                    {errors.username && <p className="admin-text-red-500 admin-text-xs mt-1">{errors.username}</p>}
                                </div>

                                {/* Password fields */}
                                {!isEdit && (
                                    <div className="admin-grid admin-grid-cols-2 admin-gap-4">
                                        <div>
                                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-1">Mật khẩu *</label>
                                            <input type="password" name="password" value={formData.password} onChange={handleChange} className={`admin-input ${errors.password ? 'admin-border-red-500' : ''}`} />
                                            {errors.password && <p className="admin-text-red-500 admin-text-xs mt-1">{errors.password}</p>}
                                        </div>
                                        <div>
                                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-1">Xác nhận mật khẩu *</label>
                                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`admin-input ${errors.confirmPassword ? 'admin-border-red-500' : ''}`} />
                                            {errors.confirmPassword && <p className="admin-text-red-500 admin-text-xs mt-1">{errors.confirmPassword}</p>}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Other fields... */}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="admin-bg-gray-50 admin-px-6 admin-py-3 admin-flex admin-justify-end admin-space-x-3">
                            <button type="button" onClick={onClose} className="admin-button admin-button-secondary">Hủy</button>
                            <button type="submit" disabled={isLoading} className="admin-button admin-button-primary disabled:opacity-50">
                                {isLoading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserModal;