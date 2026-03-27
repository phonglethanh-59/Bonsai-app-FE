import React, { useState, useEffect, useCallback } from 'react';
import {
    FiUsers, FiPackage, FiShoppingCart,
    FiUserCheck, FiRefreshCw, FiEdit, FiTrash2, FiPlus, FiUserX,
    FiDollarSign, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle
} from 'react-icons/fi';
import {
    ComposedChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import adminApi from '../../services/adminApi';
import UserModal from '../../components/admin/UserModal';
import { formatPrice } from '../../utils/config';

const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

const StatCard = ({ icon: Icon, label, value, color, bgColor, subText }) => (
    <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={24} style={{ color }} />
        </div>
        <div>
            <p className="admin-text-sm admin-text-gray-500">{label}</p>
            <p className="admin-text-2xl admin-font-bold admin-text-gray-900">{value}</p>
            {subText && <p className="admin-text-xs" style={{ color: subText.color, marginTop: 2 }}>{subText.text}</p>}
        </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200" style={{ padding: '1.25rem' }}>
        <h3 className="admin-text-base admin-font-semibold admin-text-gray-900" style={{ marginBottom: '1rem' }}>{title}</h3>
        {children}
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</p>
            {payload.map((entry, i) => (
                <p key={i} style={{ color: entry.color, fontSize: '0.875rem' }}>
                    {entry.name}: {entry.name === 'Doanh thu' ? formatPrice(entry.value) : entry.value}
                </p>
            ))}
        </div>
    );
};

const AdminDashboardPage = () => {
    const [filters, setFilters] = useState({ searchTerm: '', role: 'all', status: 'all' });
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [chartView, setChartView] = useState('daily');
    const [pagination, setPagination] = useState({ currentPage: 1, usersPerPage: 8, totalPages: 0, totalUsers: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const loadStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const data = await adminApi.getAdvancedDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setStatsLoading(false);
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
                alert('Cap nhat nguoi dung thanh cong!');
            } else {
                await adminApi.createUser(userData);
                alert('Them nguoi dung thanh cong!');
            }
            setIsModalOpen(false);
            loadUsers();
            loadStats();
        } catch (error) {
            alert(`Loi: ${error.message}`);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Ban co chac chan muon xoa nguoi dung nay?')) {
            try {
                await adminApi.deleteUser(userId);
                alert('Xoa nguoi dung thanh cong!');
                loadUsers();
                loadStats();
            } catch (error) {
                alert(`Loi: ${error.message}`);
            }
        }
    };

    const handleToggleStatus = async (userId) => {
        if (window.confirm('Ban co chac chan muon thay doi trang thai tai khoan nay?')) {
            try {
                await adminApi.toggleUserStatus(userId);
                alert('Cap nhat trang thai thanh cong!');
                loadUsers();
                loadStats();
            } catch (error) {
                alert(`Loi: ${error.message}`);
            }
        }
    };

    const getStatusText = (status) => (status ? 'Hoat dong' : 'Bi khoa');
    const getStatusClass = (status) => (status ? 'admin-status-active' : 'admin-status-locked');
    const getRoleBadge = (role) => {
        const cfg = { ADMIN: { bg: '#fee2e2', color: '#991b1b' }, STAFF: { bg: '#dbeafe', color: '#1e40af' }, CUSTOMER: { bg: '#d1fae5', color: '#065f46' } };
        const c = cfg[role] || { bg: '#f3f4f6', color: '#374151' };
        return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: c.bg, color: c.color }}>{role}</span>;
    };

    const getRevenueChartData = () => {
        if (!stats) return [];
        if (chartView === 'daily') return stats.dailyRevenue || [];
        if (chartView === 'weekly') return stats.weeklyRevenue || [];
        return stats.monthlyRevenue || [];
    };

    const growthUp = stats && stats.revenueGrowthPercent >= 0;

    return (
        <div className="admin-page">
            <div className="admin-space-y-6">

                {/* ===== OVERVIEW STAT CARDS ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <StatCard icon={FiDollarSign} label="Tong doanh thu" value={stats ? formatPrice(stats.totalRevenue) : '...'} color="#059669" bgColor="#d1fae5"
                        subText={stats ? { text: `${growthUp ? '+' : ''}${stats.revenueGrowthPercent}% so voi tuan truoc`, color: growthUp ? '#059669' : '#dc2626' } : null} />
                    <StatCard icon={FiShoppingCart} label="Tong don hang" value={stats ? stats.totalOrders : '...'} color="#2563eb" bgColor="#dbeafe"
                        subText={stats ? { text: `${stats.pendingOrders} dang cho xu ly`, color: '#d97706' } : null} />
                    <StatCard icon={FiUsers} label="Tong nguoi dung" value={stats ? stats.totalUsers : '...'} color="#7c3aed" bgColor="#ede9fe"
                        subText={stats ? { text: `${stats.totalCustomers} khach hang`, color: '#6b7280' } : null} />
                    <StatCard icon={FiXCircle} label="Ty le huy don" value={stats ? `${stats.cancelRate}%` : '...'} color="#dc2626" bgColor="#fee2e2"
                        subText={stats ? { text: `${stats.cancelledOrders} don da huy`, color: '#dc2626' } : null} />
                </div>

                {/* ===== REVENUE CHART + ORDER STATUS PIE ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
                    {/* Revenue Chart */}
                    <ChartCard title="Bieu do doanh thu">
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            {[{ key: 'daily', label: 'Ngay' }, { key: 'weekly', label: 'Tuan' }, { key: 'monthly', label: 'Thang' }].map(btn => (
                                <button key={btn.key} onClick={() => setChartView(btn.key)}
                                    style={{
                                        padding: '0.375rem 0.75rem', fontSize: '0.8rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer',
                                        background: chartView === btn.key ? '#2563eb' : 'white', color: chartView === btn.key ? 'white' : '#374151'
                                    }}>
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                        {statsLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}><FiRefreshCw className="animate-spin" size={24} style={{ margin: '0 auto', color: '#9ca3af' }} /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={getRevenueChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                    <YAxis yAxisId="left" tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} tick={{ fontSize: 11 }} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Line yAxisId="right" type="monotone" dataKey="orderCount" name="So don" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>

                    {/* Pie Chart - Order Status */}
                    <ChartCard title="Phan bo trang thai don">
                        {statsLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}><FiRefreshCw className="animate-spin" size={24} style={{ margin: '0 auto', color: '#9ca3af' }} /></div>
                        ) : stats && stats.orderStatusDistribution ? (
                            <>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={stats.orderStatusDistribution} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                                            {stats.orderStatusDistribution.map((_, idx) => (
                                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [value + ' don', name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                    {stats.orderStatusDistribution.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
                                            <span>{item.label}: {item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </ChartCard>
                </div>

                {/* ===== GROWTH CHART ===== */}
                <ChartCard title="Tang truong doanh thu theo thang">
                    {statsLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}><FiRefreshCw className="animate-spin" size={24} style={{ margin: '0 auto', color: '#9ca3af' }} /></div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={stats?.monthlyRevenue || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                <YAxis tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} tick={{ fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="orderCount" name="So don" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                {/* ===== TOP PRODUCTS + TOP CUSTOMERS ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
                    {/* Top Products */}
                    <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-overflow-hidden">
                        <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200">
                            <h3 className="admin-text-base admin-font-semibold admin-text-gray-900">Top san pham ban chay</h3>
                        </div>
                        <div className="admin-overflow-x-auto">
                            <table className="admin-min-w-full admin-table">
                                <thead>
                                    <tr>
                                        <th className="admin-table-header">#</th>
                                        <th className="admin-table-header">San pham</th>
                                        <th className="admin-table-header">SL ban</th>
                                        <th className="admin-table-header">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.topProducts?.length > 0 ? stats.topProducts.map((p, idx) => (
                                        <tr key={idx} className="admin-table-row">
                                            <td className="admin-table-cell admin-font-medium">{idx + 1}</td>
                                            <td className="admin-table-cell admin-text-sm">{p.productName}</td>
                                            <td className="admin-table-cell admin-text-sm">{p.quantitySold}</td>
                                            <td className="admin-table-cell admin-font-medium" style={{ color: '#059669' }}>{formatPrice(p.revenue)}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="admin-table-cell admin-text-center admin-text-gray-500">Chua co du lieu</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Customers */}
                    <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-overflow-hidden">
                        <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200">
                            <h3 className="admin-text-base admin-font-semibold admin-text-gray-900">Top khach hang</h3>
                        </div>
                        <div className="admin-overflow-x-auto">
                            <table className="admin-min-w-full admin-table">
                                <thead>
                                    <tr>
                                        <th className="admin-table-header">#</th>
                                        <th className="admin-table-header">Khach hang</th>
                                        <th className="admin-table-header">So don</th>
                                        <th className="admin-table-header">Tong chi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.topCustomers?.length > 0 ? stats.topCustomers.map((c, idx) => (
                                        <tr key={idx} className="admin-table-row">
                                            <td className="admin-table-cell admin-font-medium">{idx + 1}</td>
                                            <td className="admin-table-cell admin-text-sm">{c.customerName}</td>
                                            <td className="admin-table-cell admin-text-sm">{c.orderCount}</td>
                                            <td className="admin-table-cell admin-font-medium" style={{ color: '#059669' }}>{formatPrice(c.totalSpent)}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="admin-table-cell admin-text-center admin-text-gray-500">Chua co du lieu</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ===== ORDER QUICK STATS ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                    {[
                        { icon: FiClock, label: 'Cho xu ly', value: stats?.pendingOrders || 0, color: '#d97706', bg: '#fef3c7' },
                        { icon: FiAlertCircle, label: 'Da xac nhan', value: stats?.confirmedOrders || 0, color: '#2563eb', bg: '#dbeafe' },
                        { icon: FiPackage, label: 'Dang giao', value: stats?.shippingOrders || 0, color: '#7c3aed', bg: '#ede9fe' },
                        { icon: FiCheckCircle, label: 'Da giao', value: stats?.deliveredOrders || 0, color: '#059669', bg: '#d1fae5' },
                        { icon: FiXCircle, label: 'Da huy', value: stats?.cancelledOrders || 0, color: '#dc2626', bg: '#fee2e2' },
                    ].map((item, idx) => (
                        <StatCard key={idx} icon={item.icon} label={item.label} value={item.value} color={item.color} bgColor={item.bg} />
                    ))}
                </div>

                {/* ===== USER MANAGEMENT (kept from original) ===== */}
                <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-p-6">
                    <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900 admin-mb-4">Quan ly nguoi dung</h2>
                    <div className="admin-grid admin-grid-cols-1 admin-sm:grid-cols-2 admin-lg:grid-cols-4 admin-gap-4">
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-2">Tu khoa</label>
                            <input type="text" name="searchTerm" placeholder="Username, Ho ten, Email..." value={filters.searchTerm} onChange={handleFilterChange} className="admin-input" />
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-2">Vai tro</label>
                            <select name="role" value={filters.role} onChange={handleFilterChange} className="admin-input">
                                <option value="all">Tat ca</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="STAFF">STAFF</option>
                                <option value="CUSTOMER">CUSTOMER</option>
                            </select>
                        </div>
                        <div>
                            <label className="admin-block admin-text-sm admin-font-medium admin-text-gray-700 admin-mb-2">Trang thai</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange} className="admin-input">
                                <option value="all">Tat ca</option>
                                <option value="active">Hoat dong</option>
                                <option value="locked">Bi khoa</option>
                            </select>
                        </div>
                        <div className="admin-flex admin-items-end admin-space-x-2">
                            <button onClick={handleSearch} disabled={isLoading} className="admin-flex-1 admin-button admin-button-primary">
                                {isLoading ? <FiRefreshCw className="w-4 h-4 animate-spin" style={{ margin: '0 auto' }} /> : 'Loc'}
                            </button>
                            <button onClick={handleReset} className="admin-button" style={{ border: '1px solid #d1d5db' }}>Reset</button>
                        </div>
                    </div>
                </div>

                {/* User Table */}
                <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-overflow-hidden">
                    <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200 admin-flex admin-items-center admin-justify-between">
                        <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900">Danh sach tai khoan ({pagination.totalUsers})</h2>
                        <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="admin-button admin-button-primary admin-flex admin-items-center" style={{ gap: '0.5rem' }}>
                            <FiPlus /> Them
                        </button>
                    </div>
                    <div className="admin-overflow-x-auto">
                        <table className="admin-min-w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-table-header">ID</th>
                                    <th className="admin-table-header">Username</th>
                                    <th className="admin-table-header">Ho ten</th>
                                    <th className="admin-table-header">Email</th>
                                    <th className="admin-table-header">SDT</th>
                                    <th className="admin-table-header">Vai tro</th>
                                    <th className="admin-table-header">Trang thai</th>
                                    <th className="admin-table-header">Ngay tao</th>
                                    <th className="admin-table-header admin-text-center">Thao tac</th>
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
                                                <button onClick={() => { setEditingUser(user); setIsModalOpen(true); }} className="admin-text-blue-600 admin-p-1" title="Sua"><FiEdit className="w-4 h-4" /></button>
                                                <button onClick={() => handleToggleStatus(user.userId)} className={`${user.status ? 'admin-text-yellow-600' : 'admin-text-green-600'} admin-p-1`} title={user.status ? 'Khoa' : 'Mo khoa'}>
                                                    {user.status ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => handleDeleteUser(user.userId)} className="admin-text-red-600 admin-p-1" title="Xoa"><FiTrash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="9" className="admin-table-cell admin-text-center">Khong tim thay nguoi dung nao.</td></tr>
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
