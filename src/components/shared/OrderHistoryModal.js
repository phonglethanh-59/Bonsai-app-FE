import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Spinner } from 'react-bootstrap';

import { API_BASE, formatPrice } from '../../utils/config';

const statusLabels = {
    PENDING: { text: 'Cho xu ly', class: 'bg-warning' },
    CONFIRMED: { text: 'Da xac nhan', class: 'bg-info' },
    SHIPPING: { text: 'Dang giao', class: 'bg-primary' },
    DELIVERED: { text: 'Da giao', class: 'bg-success' },
    CANCELLED: { text: 'Da huy', class: 'bg-danger' },
};

const OrderHistoryModal = ({ show, handleClose }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            const fetchOrders = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`${API_BASE}/api/orders`, { withCredentials: true });
                    setOrders(res.data?.content || []);
                } catch (error) {
                    console.error('Loi khi tai don hang:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [show]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title><i className="fas fa-shopping-bag me-2"></i>Don hang cua toi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center p-5"><Spinner animation="border" /></div>
                ) : orders.length === 0 ? (
                    <p className="text-center text-muted p-4">Ban chua co don hang nao.</p>
                ) : (
                    <div className="table-responsive">
                        {orders.map(order => (
                            <div key={order.id} className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <span><strong>Don hang #{order.id}</strong> - {formatDate(order.orderDate)}</span>
                                    <span className={`badge ${statusLabels[order.status]?.class || 'bg-secondary'}`}>
                                        {statusLabels[order.status]?.text || order.status}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <table className="table table-sm mb-2">
                                        <thead>
                                            <tr>
                                                <th>San pham</th>
                                                <th className="text-center">SL</th>
                                                <th className="text-end">Don gia</th>
                                                <th className="text-end">Thanh tien</th>
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
                                    <div className="d-flex justify-content-between">
                                        <small className="text-muted">
                                            <i className="fas fa-map-marker-alt me-1"></i>{order.shippingAddress}
                                            {order.phone && <> | <i className="fas fa-phone me-1"></i>{order.phone}</>}
                                        </small>
                                        <strong className="text-success">{formatPrice(order.totalAmount)}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default OrderHistoryModal;
