import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, formatPrice } from '../../utils/config';

const statusLabels = {
    PENDING: { text: 'Chờ xử lý', class: 'bg-warning text-dark' },
    CONFIRMED: { text: 'Đã xác nhận', class: 'bg-info' },
    SHIPPING: { text: 'Đang giao', class: 'bg-primary' },
    DELIVERED: { text: 'Đã giao', class: 'bg-success' },
    CANCELLED: { text: 'Đã hủy', class: 'bg-danger' },
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/orders`, { withCredentials: true });
                setOrders(res.data?.content || []);
            } catch (error) {
                console.error('Lỗi khi tải đơn hàng:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '80px' }}>
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2 text-muted">Đang tải đơn hàng...</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '80px' }}>
            <div className="bg-light py-2">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item active">Đơn hàng của tôi</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-4">
                <h3 className="fw-bold mb-4"><i className="fas fa-shopping-bag me-2"></i>Đơn hàng của tôi</h3>

                {orders.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Bạn chưa có đơn hàng nào.</p>
                        <Link to="/categories" className="btn btn-success">Mua sắm ngay</Link>
                    </div>
                ) : (
                    <div>
                        {orders.map(order => (
                            <div key={order.id} className="card mb-4 shadow-sm">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Đơn hàng #{order.id}</strong>
                                        <span className="text-muted ms-3">{formatDate(order.orderDate)}</span>
                                    </div>
                                    <span className={`badge ${statusLabels[order.status]?.class || 'bg-secondary'} fs-6`}>
                                        {statusLabels[order.status]?.text || order.status}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-sm mb-3">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th className="text-center" style={{width: '80px'}}>SL</th>
                                                    <th className="text-end" style={{width: '120px'}}>Đơn giá</th>
                                                    <th className="text-end" style={{width: '120px'}}>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items?.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.productName}</td>
                                                        <td className="text-center">{item.quantity}</td>
                                                        <td className="text-end">{formatPrice(item.price)}</td>
                                                        <td className="text-end">{formatPrice(item.price * item.quantity)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="text-muted small">
                                            <i className="fas fa-map-marker-alt me-1"></i>{order.shippingAddress}
                                            {order.phone && <span className="ms-3"><i className="fas fa-phone me-1"></i>{order.phone}</span>}
                                            {order.paymentMethod && <span className="ms-3"><i className="fas fa-credit-card me-1"></i>{order.paymentMethod}</span>}
                                        </div>
                                        <div>
                                            <span className="text-muted me-2">Tổng:</span>
                                            <strong className="text-success fs-5">{formatPrice(order.totalAmount)}</strong>
                                        </div>
                                    </div>
                                    {order.note && (
                                        <div className="mt-2 text-muted small">
                                            <i className="fas fa-sticky-note me-1"></i>Ghi chú: {order.note}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
