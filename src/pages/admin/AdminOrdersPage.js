import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiEye, FiX, FiDownload } from 'react-icons/fi';
import adminApi from '../../services/adminApi';
import { formatPrice } from '../../utils/config';
import { useToast } from '../../components/shared/Toast';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

const statusConfig = {
    PENDING: { label: 'Chờ xử lý', bg: '#fef3c7', color: '#92400e' },
    CONFIRMED: { label: 'Đã xác nhận', bg: '#dbeafe', color: '#1e40af' },
    SHIPPING: { label: 'Đang giao', bg: '#e0e7ff', color: '#3730a3' },
    DELIVERED: { label: 'Đã giao', bg: '#d1fae5', color: '#065f46' },
    CANCELLED: { label: 'Đã hủy', bg: '#fee2e2', color: '#991b1b' },
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || { label: status, bg: '#f3f4f6', color: '#374151' };
    return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
};

const OrderDetailModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: '0.5rem', width: '90%', maxWidth: '650px', maxHeight: '85vh', overflow: 'auto', padding: '1.5rem' }}>
                <div className="admin-flex admin-items-center admin-justify-between admin-mb-4">
                    <h3 className="admin-text-lg admin-font-semibold">Chi tiết đơn hàng #{order.id}</h3>
                    <button onClick={onClose} className="admin-p-1"><FiX className="w-5 h-5" /></button>
                </div>

                <div className="admin-space-y-4">
                    <div className="admin-grid admin-grid-cols-2 admin-gap-4">
                        <div><strong className="admin-text-sm admin-text-gray-500">Khách hàng:</strong><p className="admin-text-sm">{order.customerName || order.username || '-'}</p></div>
                        <div><strong className="admin-text-sm admin-text-gray-500">Trạng thái:</strong><p><StatusBadge status={order.status} /></p></div>
                        <div><strong className="admin-text-sm admin-text-gray-500">Ngày đặt:</strong><p className="admin-text-sm">{formatDate(order.orderDate || order.createdAt)}</p></div>
                        <div><strong className="admin-text-sm admin-text-gray-500">Thanh toán:</strong><p className="admin-text-sm">{order.paymentMethod || 'COD'}</p></div>
                        <div style={{ gridColumn: 'span 2' }}><strong className="admin-text-sm admin-text-gray-500">Địa chỉ:</strong><p className="admin-text-sm">{order.shippingAddress || '-'}</p></div>
                        <div><strong className="admin-text-sm admin-text-gray-500">SĐT:</strong><p className="admin-text-sm">{order.phone || '-'}</p></div>
                        {order.note && <div><strong className="admin-text-sm admin-text-gray-500">Ghi chú:</strong><p className="admin-text-sm">{order.note}</p></div>}
                    </div>

                    <div>
                        <h4 className="admin-font-semibold admin-text-sm admin-mb-2">Sản phẩm:</h4>
                        <table className="admin-min-w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-table-header">Sản phẩm</th>
                                    <th className="admin-table-header">SL</th>
                                    <th className="admin-table-header">Đơn giá</th>
                                    <th className="admin-table-header">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(order.items || order.orderItems || []).map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="admin-table-cell admin-text-sm">{item.productName || `SP #${item.productId}`}</td>
                                        <td className="admin-table-cell admin-text-sm">{item.quantity}</td>
                                        <td className="admin-table-cell admin-text-sm">{formatPrice(item.price)}</td>
                                        <td className="admin-table-cell admin-text-sm admin-font-medium">{formatPrice(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="admin-flex admin-justify-between" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem' }}>
                        <span className="admin-font-semibold">Tổng cộng:</span>
                        <span className="admin-text-lg admin-font-bold" style={{ color: '#059669' }}>{formatPrice(order.totalAmount)}</span>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                    <button onClick={onClose} className="admin-button admin-button-secondary">Đóng</button>
                </div>
            </div>
        </div>
    );
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({ currentPage: 1, perPage: 10, totalPages: 0, total: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [exporting, setExporting] = useState(false);
    const toast = useToast();

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: pagination.currentPage - 1,
                size: pagination.perPage,
                status: statusFilter || undefined,
            };
            Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);
            const res = await adminApi.getOrders(params);
            setOrders(res.content || []);
            setPagination(prev => ({ ...prev, totalPages: res.totalPages || 0, total: res.totalElements || 0 }));
        } catch (err) {
            console.error('Error loading orders:', err);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.currentPage, pagination.perPage, statusFilter]);

    useEffect(() => { loadOrders(); }, [loadOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        const yes = await toast.confirm(`Cập nhật trạng thái đơn hàng #${orderId} thành "${statusConfig[newStatus]?.label}"?`);
        if (yes) {
            try {
                await adminApi.updateOrderStatus(orderId, newStatus);
                toast.success('Cập nhật trạng thái thành công!');
                loadOrders();
            } catch (err) {
                toast.error(`Lỗi: ${err.message}`);
            }
        }
    };

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setShowDetail(true);
    };

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
        setExporting(true);
        try {
            const params = { status: statusFilter || undefined };
            if (type === 'excel') {
                const blob = await adminApi.exportOrdersExcel(params);
                downloadBlob(blob, `don-hang_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '')}.xlsx`);
            } else {
                const blob = await adminApi.exportOrdersPdf(params);
                downloadBlob(blob, `don-hang_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '')}.pdf`);
            }
        } catch (err) {
            toast.error('Lỗi xuất file: ' + err.message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-space-y-6">
                <div className="admin-flex admin-items-center admin-justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h1 className="admin-text-2xl admin-font-bold admin-text-gray-900">Quản lý đơn hàng</h1>
                    <div className="admin-flex admin-space-x-2">
                        <button onClick={() => handleExport('excel')} disabled={exporting}
                            className="admin-button" style={{ background: '#059669', color: 'white', display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', fontSize: '0.875rem', border: 'none', borderRadius: '0.375rem', cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting ? 0.6 : 1 }}>
                            <FiDownload size={16} /> Excel
                        </button>
                        <button onClick={() => handleExport('pdf')} disabled={exporting}
                            className="admin-button" style={{ background: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', fontSize: '0.875rem', border: 'none', borderRadius: '0.375rem', cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting ? 0.6 : 1 }}>
                            <FiDownload size={16} /> PDF
                        </button>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="admin-flex admin-space-x-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                    <button onClick={() => { setStatusFilter(''); setPagination(prev => ({ ...prev, currentPage: 1 })); }}
                        className="admin-button" style={{ background: !statusFilter ? '#2563eb' : 'white', color: !statusFilter ? 'white' : '#374151', border: '1px solid #d1d5db' }}>
                        Tất cả
                    </button>
                    {Object.entries(statusConfig).map(([key, cfg]) => (
                        <button key={key} onClick={() => { setStatusFilter(key); setPagination(prev => ({ ...prev, currentPage: 1 })); }}
                            className="admin-button" style={{ background: statusFilter === key ? cfg.bg : 'white', color: statusFilter === key ? cfg.color : '#374151', border: `1px solid ${statusFilter === key ? cfg.color : '#d1d5db'}` }}>
                            {cfg.label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="admin-bg-white admin-rounded-lg admin-shadow-sm admin-border admin-border-gray-200 admin-overflow-hidden">
                    <div className="admin-px-6 admin-py-4 admin-border-b admin-border-gray-200">
                        <h2 className="admin-text-lg admin-font-semibold admin-text-gray-900">Danh sách đơn hàng ({pagination.total})</h2>
                    </div>
                    <div className="admin-overflow-x-auto">
                        <table className="admin-min-w-full admin-table">
                            <thead>
                                <tr>
                                    <th className="admin-table-header">Mã ĐH</th>
                                    <th className="admin-table-header">Khách hàng</th>
                                    <th className="admin-table-header">Ngày đặt</th>
                                    <th className="admin-table-header">Tổng tiền</th>
                                    <th className="admin-table-header">Thanh toán</th>
                                    <th className="admin-table-header">Trạng thái</th>
                                    <th className="admin-table-header admin-text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="7" className="admin-table-cell admin-text-center"><FiRefreshCw className="w-5 h-5 animate-spin" style={{ margin: '0 auto' }} /></td></tr>
                                ) : orders.length > 0 ? orders.map(order => (
                                    <tr key={order.id} className="admin-table-row">
                                        <td className="admin-table-cell admin-font-medium">#{order.id}</td>
                                        <td className="admin-table-cell admin-text-sm">{order.customerName || order.username || '-'}</td>
                                        <td className="admin-table-cell admin-text-sm">{formatDate(order.orderDate || order.createdAt)}</td>
                                        <td className="admin-table-cell admin-font-medium" style={{ color: '#059669' }}>{formatPrice(order.totalAmount)}</td>
                                        <td className="admin-table-cell admin-text-sm">{order.paymentMethod || 'COD'}</td>
                                        <td className="admin-table-cell">
                                            <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="admin-input" style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                                                {Object.entries(statusConfig).map(([key, cfg]) => (
                                                    <option key={key} value={key}>{cfg.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="admin-table-cell admin-text-center">
                                            <button onClick={() => handleViewDetail(order)} className="admin-text-blue-600 admin-p-1" title="Xem chi tiết">
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7" className="admin-table-cell admin-text-center">Không có đơn hàng nào.</td></tr>
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

            <OrderDetailModal isOpen={showDetail} onClose={() => setShowDetail(false)} order={selectedOrder} />
        </div>
    );
};

export default AdminOrdersPage;
