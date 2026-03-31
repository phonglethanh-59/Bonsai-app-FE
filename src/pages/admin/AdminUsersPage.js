import React, { useState, useEffect, useCallback } from 'react';
import {
    FiUsers, FiUserCheck, FiRefreshCw, FiEdit, FiTrash2, FiPlus, FiUserX, FiSearch
} from 'react-icons/fi';
import adminApi from '../../services/adminApi';
import UserModal from '../../components/admin/UserModal';
import { useToast } from '../../components/shared/Toast';

const AdminUsersPage = () => {
    const [filters, setFilters] = useState({ searchTerm: '', role: 'all', status: 'all' });
    const [appliedFilters, setAppliedFilters] = useState({ searchTerm: '', role: 'all', status: 'all' });
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, usersPerPage: 8, totalPages: 0, totalUsers: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const toast = useToast();

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: pagination.currentPage - 1,
                size: pagination.usersPerPage,
                sortBy: 'createdAt',
                sortDir: 'desc',
                search: appliedFilters.searchTerm,
                role: appliedFilters.role !== 'all' ? appliedFilters.role : undefined,
                status: appliedFilters.status !== 'all' ? appliedFilters.status === 'active' : undefined,
            };
            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
            const response = await adminApi.getUsers(params);
            setUsers(response.content || []);
            setPagination(prev => ({ ...prev, totalPages: response.totalPages || 0, totalUsers: response.totalElements || 0 }));
        } catch (error) {
            console.error('Error loading users:', error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.currentPage, pagination.usersPerPage, appliedFilters]);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setAppliedFilters({ ...filters });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleReset = () => {
        const empty = { searchTerm: '', role: 'all', status: 'all' };
        setFilters(empty);
        setAppliedFilters(empty);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleSaveUser = async (userData) => {
        try {
            if (editingUser) {
                await adminApi.updateUser(editingUser.userId, userData);
                toast.success('Cập nhật người dùng thành công!');
            } else {
                await adminApi.createUser(userData);
                toast.success('Thêm người dùng thành công!');
            }
            setIsModalOpen(false);
            loadUsers();
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        }
    };

    const handleDeleteUser = async (userId) => {
        const yes = await toast.confirm('Bạn có chắc chắn muốn xóa người dùng này?');
        if (yes) {
            try {
                await adminApi.deleteUser(userId);
                toast.success('Xóa người dùng thành công!');
                loadUsers();
            } catch (error) {
                toast.error(`Lỗi: ${error.message}`);
            }
        }
    };

    const handleToggleStatus = async (userId) => {
        const yes = await toast.confirm('Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này?');
        if (yes) {
            try {
                await adminApi.toggleUserStatus(userId);
                toast.success('Cập nhật trạng thái thành công!');
                loadUsers();
            } catch (error) {
                toast.error(`Lỗi: ${error.message}`);
            }
        }
    };

    const getStatusText = (status) => (status ? 'Hoạt động' : 'Bị khóa');
    const getStatusClass = (status) => (status ? 'admin-status-active' : 'admin-status-locked');
    const getRoleBadge = (role) => {
        const cfg = { ADMIN: { bg: '#fee2e2', color: '#991b1b' }, STAFF: { bg: '#dbeafe', color: '#1e40af' }, CUSTOMER: { bg: '#d1fae5', color: '#065f46' } };
        const c = cfg[role] || { bg: '#f3f4f6', color: '#374151' };
        return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: c.bg, color: c.color }}>{role}</span>;
    };

    return (
        <div className="admin-page">
            <div className="admin-space-y-6">
                <div className="admin-flex admin-items-center admin-justify-between">
                    <h1 className="admin-text-2xl admin-font-bold admin-text-gray-900">Quản lý người dùng</h1>
                    <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="admin-button admin-button-primary admin-flex admin-items-center" style={{ gap: '0.5rem' }}>
                        <FiPlus /> Thêm người dùng
                    </button>
                </div>

                {/* Filters */}
                <div className="admin-card">
                    <div className="admin-grid admin-grid-cols-1 admin-sm:grid-cols-2 admin-lg:grid-cols-4 admin-gap-4">
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-2">Từ khóa</label>
                            <input type="text" name="searchTerm" placeholder="Username, Họ tên, Email..." value={filters.searchTerm} onChange={handleFilterChange} className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-2">Vai trò</label>
                            <select name="role" value={filters.role} onChange={handleFilterChange} className="admin-input">
                                <option value="all">Tất cả</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="STAFF">STAFF</option>
                                <option value="CUSTOMER">CUSTOMER</option>
                            </select>
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-2">Trạng thái</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange} className="admin-input">
                                <option value="all">Tất cả</option>
                                <option value="active">Hoạt động</option>
                                <option value="locked">Bị khóa</option>
                            </select>
                        </div>
                        <div className="admin-flex admin-items-end admin-space-x-2">
                            <button onClick={handleSearch} disabled={isLoading} className="admin-flex-1 admin-button admin-button-primary admin-flex admin-items-center admin-justify-center" style={{ gap: '0.375rem' }}>
                                {isLoading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiSearch size={16} />} Lọc
                            </button>
                            <button onClick={handleReset} className="admin-button admin-button-secondary">Reset</button>
                        </div>
                    </div>
                </div>

                {/* User Table */}
                <div className="admin-card" style={{ padding: 0 }}>
                    <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200" style={{ padding: '1rem 1.5rem' }}>
                        <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900">Danh sách tài khoản ({pagination.totalUsers})</h2>
                    </div>
                    <div className="admin-overflow-x-auto">
                        <table className="admin-min-w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-table-header">ID</th>
                                    <th className="admin-table-header">Username</th>
                                    <th className="admin-table-header">Họ tên</th>
                                    <th className="admin-table-header">Email</th>
                                    <th className="admin-table-header">SĐT</th>
                                    <th className="admin-table-header">Vai trò</th>
                                    <th className="admin-table-header">Trạng thái</th>
                                    <th className="admin-table-header">Ngày tạo</th>
                                    <th className="admin-table-header admin-text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="9" className="admin-table-cell admin-text-center"><FiRefreshCw className="w-5 h-5 animate-spin" style={{ margin: '0 auto' }} /></td></tr>
                                ) : users.length > 0 ? users.map(user => (
                                    <tr key={user.userId} className="admin-table-row">
                                        <td className="admin-table-cell admin-font-medium">{user.userId}</td>
                                        <td className="admin-table-cell">{user.username}</td>
                                        <td className="admin-table-cell">{user.userDetail?.fullName || '-'}</td>
                                        <td className="admin-table-cell admin-text-sm">{user.userDetail?.email || '-'}</td>
                                        <td className="admin-table-cell admin-text-sm">{user.userDetail?.phone || '-'}</td>
                                        <td className="admin-table-cell">{getRoleBadge(user.role)}</td>
                                        <td className="admin-table-cell"><span className={getStatusClass(user.status)}>{getStatusText(user.status)}</span></td>
                                        <td className="admin-table-cell admin-text-sm admin-text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                                        <td className="admin-table-cell admin-text-center">
                                            <div className="admin-flex admin-items-center admin-justify-center admin-space-x-2">
                                                <button onClick={() => { setEditingUser(user); setIsModalOpen(true); }} className="admin-text-blue-600 admin-p-1" title="Sửa"><FiEdit className="w-4 h-4" /></button>
                                                <button onClick={() => handleToggleStatus(user.userId)} className={`${user.status ? 'admin-text-yellow-600' : 'admin-text-green-600'} admin-p-1`} title={user.status ? 'Khóa' : 'Mở khóa'}>
                                                    {user.status ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => handleDeleteUser(user.userId)} className="admin-text-red-600 admin-p-1" title="Xóa"><FiTrash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="9" className="admin-table-cell admin-text-center admin-text-gray-500">Không tìm thấy người dùng nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="admin-px-6 admin-py-4 admin-border-t admin-border-gray-200 admin-flex admin-items-center admin-justify-between" style={{ padding: '1rem 1.5rem' }}>
                            <span className="admin-text-sm admin-text-gray-500">Trang {pagination.currentPage} / {pagination.totalPages}</span>
                            <div className="admin-flex admin-space-x-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
                                    <button key={num} onClick={() => setPagination(prev => ({ ...prev, currentPage: num }))}
                                        className="admin-button" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: num === pagination.currentPage ? '#2563eb' : 'white', color: num === pagination.currentPage ? 'white' : '#374151', border: '1px solid #d1d5db' }}>
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} user={editingUser} isEdit={!!editingUser} />
        </div>
    );
};

export default AdminUsersPage;
