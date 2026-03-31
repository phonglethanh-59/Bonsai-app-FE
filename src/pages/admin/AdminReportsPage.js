import React, { useState, useCallback } from 'react';
import { FiDownload, FiRefreshCw, FiTrendingUp, FiShoppingCart, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import adminApi from '../../services/adminApi';
import { formatPrice } from '../../utils/config';
import { useToast } from '../../components/shared/Toast';

const AdminReportsPage = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const [fromDate, setFromDate] = useState(firstDay.toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(today.toISOString().split('T')[0]);
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const toast = useToast();

    const loadReport = useCallback(async () => {
        if (!fromDate || !toDate) {
            toast.warning('Vui lòng chọn khoảng thời gian');
            return;
        }
        setIsLoading(true);
        try {
            const data = await adminApi.getRevenueReport({ fromDate, toDate });
            setReport(data);
        } catch (err) {
            toast.error('Lỗi tải báo cáo: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    }, [fromDate, toDate]);

    const downloadBlob = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleExport = async (type) => {
        if (!fromDate || !toDate) {
            toast.warning('Vui lòng chọn khoảng thời gian');
            return;
        }
        setExporting(true);
        try {
            const params = { fromDate, toDate };
            if (type === 'excel') {
                const blob = await adminApi.exportRevenueExcel(params);
                downloadBlob(blob, `doanh-thu_${fromDate}_${toDate}.xlsx`);
            } else {
                const blob = await adminApi.exportRevenuePdf(params);
                downloadBlob(blob, `doanh-thu_${fromDate}_${toDate}.pdf`);
            }
        } catch (err) {
            toast.error('Lỗi xuất file: ' + err.message);
        } finally {
            setExporting(false);
        }
    };

    const statCards = report ? [
        { label: 'Tổng doanh thu', value: formatPrice(report.totalRevenue), icon: FiTrendingUp, color: '#059669', bg: '#d1fae5' },
        { label: 'Tổng đơn hàng', value: report.totalOrders, icon: FiShoppingCart, color: '#2563eb', bg: '#dbeafe' },
        { label: 'Đã giao', value: report.deliveredOrders, icon: FiCheckCircle, color: '#059669', bg: '#d1fae5' },
        { label: 'Đã hủy', value: report.cancelledOrders, icon: FiXCircle, color: '#dc2626', bg: '#fee2e2' },
        { label: 'Chờ xử lý', value: report.pendingOrders, icon: FiClock, color: '#d97706', bg: '#fef3c7' },
    ] : [];

    return (
        <div className="admin-page">
            <div className="admin-space-y-6">
                <h1 className="admin-text-2xl admin-font-bold admin-text-gray-900">Báo cáo doanh thu</h1>

                {/* Filter */}
                <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-p-4">
                    <div className="admin-flex admin-items-center" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                        <div>
                            <label className="admin-text-sm admin-font-medium admin-text-gray-700" style={{ display: 'block', marginBottom: '0.25rem' }}>Từ ngày</label>
                            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                                className="admin-input" style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
                        </div>
                        <div>
                            <label className="admin-text-sm admin-font-medium admin-text-gray-700" style={{ display: 'block', marginBottom: '0.25rem' }}>Đến ngày</label>
                            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                                className="admin-input" style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
                        </div>
                        <button onClick={loadReport} disabled={isLoading}
                            className="admin-button" style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                            {isLoading ? <FiRefreshCw className="animate-spin" size={16} /> : <FiTrendingUp size={16} />}
                            Xem báo cáo
                        </button>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleExport('excel')} disabled={exporting || !report}
                                className="admin-button" style={{ background: '#059669', color: 'white', display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', fontSize: '0.875rem', border: 'none', borderRadius: '0.375rem', cursor: (exporting || !report) ? 'not-allowed' : 'pointer', opacity: (exporting || !report) ? 0.6 : 1 }}>
                                <FiDownload size={16} /> Excel
                            </button>
                            <button onClick={() => handleExport('pdf')} disabled={exporting || !report}
                                className="admin-button" style={{ background: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', fontSize: '0.875rem', border: 'none', borderRadius: '0.375rem', cursor: (exporting || !report) ? 'not-allowed' : 'pointer', opacity: (exporting || !report) ? 0.6 : 1 }}>
                                <FiDownload size={16} /> PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {report && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {statCards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <div key={idx} className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-p-4">
                                    <div className="admin-flex admin-items-center admin-justify-between">
                                        <div>
                                            <p className="admin-text-sm admin-text-gray-500">{card.label}</p>
                                            <p className="admin-text-xl admin-font-bold" style={{ color: card.color }}>{card.value}</p>
                                        </div>
                                        <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon size={24} style={{ color: card.color }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Daily Revenue Table */}
                {report && report.dailyRevenues && report.dailyRevenues.length > 0 && (
                    <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-overflow-hidden">
                        <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200">
                            <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900">Doanh thu theo ngày</h2>
                        </div>
                        <div className="admin-overflow-x-auto">
                            <table className="admin-min-w-full admin-table">
                                <thead>
                                    <tr>
                                        <th className="admin-table-header">Ngày</th>
                                        <th className="admin-table-header">Doanh thu</th>
                                        <th className="admin-table-header">Số đơn hàng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.dailyRevenues.map((day, idx) => (
                                        <tr key={idx} className="admin-table-row">
                                            <td className="admin-table-cell admin-text-sm">{day.date}</td>
                                            <td className="admin-table-cell admin-font-medium" style={{ color: '#059669' }}>{formatPrice(day.revenue)}</td>
                                            <td className="admin-table-cell admin-text-sm">{day.orderCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Top Products Table */}
                {report && report.topProducts && report.topProducts.length > 0 && (
                    <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-overflow-hidden">
                        <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200">
                            <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900">Top sản phẩm bán chạy</h2>
                        </div>
                        <div className="admin-overflow-x-auto">
                            <table className="admin-min-w-full admin-table">
                                <thead>
                                    <tr>
                                        <th className="admin-table-header">#</th>
                                        <th className="admin-table-header">Sản phẩm</th>
                                        <th className="admin-table-header">Số lượng bán</th>
                                        <th className="admin-table-header">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.topProducts.map((product, idx) => (
                                        <tr key={idx} className="admin-table-row">
                                            <td className="admin-table-cell admin-font-medium">{idx + 1}</td>
                                            <td className="admin-table-cell admin-text-sm">{product.productName}</td>
                                            <td className="admin-table-cell admin-text-sm">{product.quantitySold}</td>
                                            <td className="admin-table-cell admin-font-medium" style={{ color: '#059669' }}>{formatPrice(product.revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!report && !isLoading && (
                    <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-p-8" style={{ textAlign: 'center' }}>
                        <FiTrendingUp size={48} style={{ margin: '0 auto', color: '#9ca3af' }} />
                        <p className="admin-text-gray-500" style={{ marginTop: '1rem' }}>Chọn khoảng thời gian và nhấn "Xem báo cáo" để hiển thị dữ liệu.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReportsPage;
