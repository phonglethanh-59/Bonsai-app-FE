import React, { useState, useEffect, useCallback } from 'react';
import {
    FiUsers, FiShoppingBag, FiPackage, FiShoppingCart,
    FiUserCheck, FiRefreshCw, FiEdit, FiTrash2, FiPlus, FiUserX
} from 'react-icons/fi';
import adminApi from '../../services/adminApi';
import UserModal from '../../components/admin/UserModal';

const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={24} style={{ color }} />
        </div>
        <div>
            <p className="admin-text-sm admin-text-gray-500">{label}</p>
            <p className="admin-text-2xl admin-font-bold admin-text-gray-900">{value}</p>
        </div>
    </div>
);

const AdminDashboardPage = () => {
    const [filters, setFilters] = useState({ searchTerm: '', role: 'all', status: 'all' });
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalAdmins: 0, totalStaff: 0, totalCustomers: 0, lockedAccounts: 0, totalUsers: 0 });
    const [pagination, setPagination] = useState({ currentPage: 1, usersPerPage: 8, totalPages: 0, totalUsers: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const loadStats = useCallback(async () => {
        try {
            const data = await adminApi.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }, []);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: pagination.currentPage - 1,
                size: pagination.usersPerPage,
                sortBy: 'createdAt',
                sortDir: 'desc',
                search: filters.searchTerm,
                role: filters.role !== 'all' ? filters.role : undefined,
                status: filters.status !== 'all' ? filters.status === 'active' : undefined,
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
    }, [pagination.currentPage, pagination.usersPerPage, filters]);

    useEffect(() => { loadStats(); loadUsers(); }, [loadUsers, loadStats]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => setPagination(prev => ({ ...prev, currentPage: 1 }));
    const handleReset = () => { setFilters({ searchTerm: '', role: 'all', status: 'all' }); setPagination(prev => ({ ...prev, currentPage: 1 })); };

    const handleSaveUser = async (userData) => {
        try {
            if (editingUser) {
                await adminApi.updateUser(editingUser.userId, userData);
                alert('Cập nhật người dùng thành công!');
            } else {
                await adminApi.createUser(userData);
                alert('Thêm người dùng thành công!');
            }
            setIsModalOpen(false);
            loadUsers();
            loadStats();
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await adminApi.deleteUser(userId);
                alert('Xóa người dùng thành công!');
                loadUsers();
                loadStats();
            } catch (error) {
                alert(`Lỗi: ${error.message}`);
            }
        }
    };

    const handleToggleStatus = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này?')) {
            try {
                await adminApi.toggleUserStatus(userId);
                alert('Cập nhật trạng thái thành công!');
                loadUsers();
                loadStats();
            } catch (error) {
                alert(`Lỗi: ${error.message}`);
            }
        }
    };

    const getStatusText = (status) => (status ? 'Hoạt động' : 'Bị khóa');
    const getStatusClass = (status) => (status ? 'admin-status-active' : 'admin-status-locked');
    const getRoleBadge = (role) => {
        const cfg = { ADMIN: { bg: '#fee2e2', color: '#991b1b' }, STAFF: { bg: '#dbeafe', color: '#1e40af' }, CUSTOMER: { bg: '#d1fae5', color: '#065f46' } };
        const c = cfg[role] || { bg: '#f3f4f6', color: '#374151' };
        return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: c.bg, color: c.color }}>{role}</span>;
    };

    return (
        <div className="admin-page">
            <div className="admin-space-y-6">
                {/* Stat Cards */}
                <div className="admin-grid admin-grid-cols-1 admin-sm:grid-cols-2 admin-lg:grid-cols-4 admin-gap-4">
                    <StatCard icon={FiUsers} label="Tổng người dùng" value={stats.totalUsers} color="#2563eb" bgColor="#dbeafe" />
                    <StatCard icon={FiShoppingBag} label="Khách hàng" value={stats.totalCustomers} color="#059669" bgColor="#d1fae5" />
                    <StatCard icon={FiPackage} label="Nhân viên" value={stats.totalStaff} color="#7c3aed" bgColor="#ede9fe" />
                    <StatCard icon={FiUserX} label="Tài khoản bị khóa" value={stats.lockedAccounts} color="#dc2626" bgColor="#fee2e2" />
                </div>

                {/* Search and Filter */}
                <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-p-6">
                    <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900 admin-mb-4">Quản lý người dùng</h2>
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
                            <button onClick={handleSearch} disabled={isLoading} className="admin-flex-1 admin-button admin-button-primary">
                                {isLoading ? <FiRefreshCw className="w-4 h-4 animate-spin" style={{ margin: '0 auto' }} /> : 'Lọc'}
                            </button>
                            <button onClick={handleReset} className="admin-button" style={{ border: '1px solid #d1d5db' }}>Reset</button>
                        </div>
                    </div>
                </div>

                {/* User Table */}
                <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-overflow-hidden">
                    <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200 admin-flex admin-items-center admin-justify-between">
                        <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900">Danh sách tài khoản ({pagination.totalUsers})</h2>
                        <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="admin-button admin-button-primary admin-flex admin-items-center" style={{ gap: '0.5rem' }}>
                            <FiPlus /> Thêm
                        </button>
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
                                        <td className="admin-table-cell admin-text-sm">{user.userDetail?.phoneNumber || '-'}</td>
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
                                    <tr><td colSpan="9" className="admin-table-cell admin-text-center">Không tìm thấy người dùng nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="admin-px-6 admin-py-4 admin-border-t admin-border-gray-200 admin-flex admin-items-center admin-justify-between">
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

export default AdminDashboardPage;
