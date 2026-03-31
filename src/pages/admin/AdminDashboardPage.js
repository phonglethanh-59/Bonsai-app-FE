import React, { useState, useEffect, useCallback } from 'react';
import {
    FiUsers, FiPackage, FiShoppingCart,
    FiRefreshCw, FiDollarSign, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiTrendingUp
} from 'react-icons/fi';
import {
    ComposedChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import adminApi from '../../services/adminApi';
import { formatPrice } from '../../utils/config';

const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

const StatCard = ({ icon: Icon, label, value, color, bgColor, subText, trend }) => (
    <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
        <div style={{ width: 52, height: 52, borderRadius: '0.75rem', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={24} style={{ color }} />
        </div>
        <div style={{ flex: 1 }}>
            <p className="admin-text-sm admin-text-gray-500" style={{ marginBottom: '0.125rem' }}>{label}</p>
            <p className="admin-text-2xl admin-font-bold admin-text-gray-900" style={{ marginBottom: 0 }}>{value}</p>
            {subText && <p className="admin-text-xs" style={{ color: subText.color, marginTop: 2, marginBottom: 0 }}>{subText.text}</p>}
        </div>
        {trend && (
            <div style={{ padding: '0.25rem 0.5rem', borderRadius: '0.375rem', background: trend >= 0 ? '#d1fae5' : '#fee2e2', fontSize: '0.75rem', fontWeight: 600, color: trend >= 0 ? '#059669' : '#dc2626' }}>
                {trend >= 0 ? '+' : ''}{trend}%
            </div>
        )}
    </div>
);

const ChartCard = ({ title, children, action }) => (
    <div className="admin-card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="admin-text-base admin-font-semibold admin-text-gray-900" style={{ margin: 0 }}>{title}</h3>
            {action}
        </div>
        <div style={{ padding: '1.25rem' }}>
            {children}
        </div>
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
    const [stats, setStats] = useState(null);
    const [chartView, setChartView] = useState('daily');
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

    useEffect(() => { loadStats(); }, [loadStats]);

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

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <StatCard icon={FiDollarSign} label="Tổng doanh thu" value={stats ? formatPrice(stats.totalRevenue) : '...'} color="#059669" bgColor="#d1fae5"
                        trend={stats?.revenueGrowthPercent}
                        subText={stats ? { text: `So với tuần trước`, color: '#6b7280' } : null} />
                    <StatCard icon={FiShoppingCart} label="Tổng đơn hàng" value={stats ? stats.totalOrders : '...'} color="#2563eb" bgColor="#dbeafe"
                        subText={stats ? { text: `${stats.pendingOrders} đang chờ xử lý`, color: '#d97706' } : null} />
                    <StatCard icon={FiUsers} label="Tổng người dùng" value={stats ? stats.totalUsers : '...'} color="#7c3aed" bgColor="#ede9fe"
                        subText={stats ? { text: `${stats.totalCustomers} khách hàng`, color: '#6b7280' } : null} />
                    <StatCard icon={FiXCircle} label="Tỷ lệ hủy đơn" value={stats ? `${stats.cancelRate}%` : '...'} color="#dc2626" bgColor="#fee2e2"
                        subText={stats ? { text: `${stats.cancelledOrders} đơn đã hủy`, color: '#dc2626' } : null} />
                </div>

                {/* Revenue Chart + Pie Chart */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1rem' }}>
                    <ChartCard title="Biểu đồ doanh thu"
                        action={
                            <div style={{ display: 'flex', gap: '0.25rem', background: '#f3f4f6', borderRadius: '0.5rem', padding: '0.25rem' }}>
                                {[{ key: 'daily', label: 'Ngày' }, { key: 'weekly', label: 'Tuần' }, { key: 'monthly', label: 'Tháng' }].map(btn => (
                                    <button key={btn.key} onClick={() => setChartView(btn.key)}
                                        style={{
                                            padding: '0.375rem 0.75rem', fontSize: '0.8rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer',
                                            background: chartView === btn.key ? 'white' : 'transparent',
                                            color: chartView === btn.key ? '#111827' : '#6b7280',
                                            fontWeight: chartView === btn.key ? 600 : 400,
                                            boxShadow: chartView === btn.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                        }}>
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        {statsLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}><FiRefreshCw className="animate-spin" size={24} style={{ margin: '0 auto', color: '#9ca3af' }} /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <ComposedChart data={getRevenueChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                    <YAxis yAxisId="left" tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} tick={{ fontSize: 11 }} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                    <Line yAxisId="right" type="monotone" dataKey="orderCount" name="Số đơn" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>

                    <ChartCard title="Phân bố trạng thái đơn">
                        {statsLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}><FiRefreshCw className="animate-spin" size={24} style={{ margin: '0 auto', color: '#9ca3af' }} /></div>
                        ) : stats && stats.orderStatusDistribution ? (
                            <>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={stats.orderStatusDistribution} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                                            {stats.orderStatusDistribution.map((_, idx) => (
                                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [value + ' đơn', name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                                    {stats.orderStatusDistribution.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem' }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
                                            <span className="admin-text-gray-600">{item.label}: <strong>{item.count}</strong></span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </ChartCard>
                </div>

                {/* Growth Chart */}
                <ChartCard title="Tăng trưởng doanh thu theo tháng">
                    {statsLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}><FiRefreshCw className="animate-spin" size={24} style={{ margin: '0 auto', color: '#9ca3af' }} /></div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={stats?.monthlyRevenue || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                <YAxis tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} tick={{ fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="orderCount" name="Số đơn" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                {/* Top Products + Top Customers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
                    <ChartCard title="Top sản phẩm bán chạy">
                        <table className="admin-min-w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-table-header">#</th>
                                    <th className="admin-table-header">Sản phẩm</th>
                                    <th className="admin-table-header">SL bán</th>
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
                                    <tr><td colSpan="4" className="admin-table-cell admin-text-center admin-text-gray-500">Chưa có dữ liệu</td></tr>
                                )}
                            </tbody>
                        </table>
                    </ChartCard>

                    <ChartCard title="Top khách hàng">
                        <table className="admin-min-w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-table-header">#</th>
                                    <th className="admin-table-header">Khách hàng</th>
                                    <th className="admin-table-header">Số đơn</th>
                                    <th className="admin-table-header">Tổng chi</th>
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
                                    <tr><td colSpan="4" className="admin-table-cell admin-text-center admin-text-gray-500">Chưa có dữ liệu</td></tr>
                                )}
                            </tbody>
                        </table>
                    </ChartCard>
                </div>

                {/* Order Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {[
                        { icon: FiClock, label: 'Chờ xử lý', value: stats?.pendingOrders || 0, color: '#d97706', bg: '#fef3c7' },
                        { icon: FiAlertCircle, label: 'Đã xác nhận', value: stats?.confirmedOrders || 0, color: '#2563eb', bg: '#dbeafe' },
                        { icon: FiPackage, label: 'Đang giao', value: stats?.shippingOrders || 0, color: '#7c3aed', bg: '#ede9fe' },
                        { icon: FiCheckCircle, label: 'Đã giao', value: stats?.deliveredOrders || 0, color: '#059669', bg: '#d1fae5' },
                        { icon: FiXCircle, label: 'Đã hủy', value: stats?.cancelledOrders || 0, color: '#dc2626', bg: '#fee2e2' },
                    ].map((item, idx) => (
                        <StatCard key={idx} icon={item.icon} label={item.label} value={item.value} color={item.color} bgColor={item.bg} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
