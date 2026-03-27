import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { API_BASE, formatPrice } from '../../utils/config';

const CartPage = () => {
    const { cartItems, removeFromCart, updateCartItem, clearCart, getCartTotal, getCartCount, fetchCart } = useCart();
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutData, setCheckoutData] = useState({
        shippingAddress: '',
        phone: '',
        note: '',
        paymentMethod: 'COD'
    });
    const [ordering, setOrdering] = useState(false);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const getCoverImageUrl = (path) => {
        if (!path) return 'https://placehold.co/60x80?text=Bonsai';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

    const handleQuantityChange = async (productId, newQty) => {
        if (newQty < 1) return;
        try {
            await updateCartItem(productId, newQty);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCheckout = async () => {
        if (!checkoutData.shippingAddress || !checkoutData.phone) {
            alert('Vui long nhap dia chi giao hang va so dien thoai.');
            return;
        }
        setOrdering(true);
        try {
            const orderRequest = {
                shippingAddress: checkoutData.shippingAddress,
                phone: checkoutData.phone,
                note: checkoutData.note,
                paymentMethod: checkoutData.paymentMethod,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };
            const response = await axios.post(`${API_BASE}/api/orders`, orderRequest, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            alert(response.data.message || 'Dat hang thanh cong!');
            await clearCart();
            setShowCheckout(false);
            setCheckoutData({ shippingAddress: '', phone: '', note: '', paymentMethod: 'COD' });
            navigate('/orders');
        } catch (error) {
            alert('Dat hang that bai: ' + (error.response?.data?.message || error.message));
        } finally {
            setOrdering(false);
        }
    };

    return (
        <div style={{ marginTop: '80px' }}>
            <div className="bg-light py-2">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item"><Link to="/">Trang chu</Link></li>
                            <li className="breadcrumb-item active">Gio hang</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-4">
                <h3 className="fw-bold mb-4">
                    <i className="fas fa-shopping-cart me-2 text-success"></i>Gio hang ({getCartCount()} san pham)
                </h3>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Gio hang cua ban dang trong.</p>
                        <Link to="/categories" className="btn btn-success">Mua sam ngay</Link>
                    </div>
                ) : (
                    <div className="row">
                        <div className={showCheckout ? 'col-lg-7' : 'col-12'}>
                            <div className="card shadow-sm">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <strong>San pham trong gio</strong>
                                    <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
                                        <i className="fas fa-trash me-1"></i>Xoa tat ca
                                    </button>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0 align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: '80px' }}></th>
                                                    <th>San pham</th>
                                                    <th className="text-end" style={{ width: '130px' }}>Don gia</th>
                                                    <th className="text-center" style={{ width: '150px' }}>So luong</th>
                                                    <th className="text-end" style={{ width: '130px' }}>Thanh tien</th>
                                                    <th style={{ width: '50px' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map(item => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <img
                                                                src={getCoverImageUrl(item.productImage)}
                                                                alt={item.productName}
                                                                style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }}
                                                                onClick={() => navigate(`/product/${item.productId}`)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Link to={`/product/${item.productId}`} className="text-decoration-none text-dark fw-bold">
                                                                {item.productName}
                                                            </Link>
                                                        </td>
                                                        <td className="text-end text-success">{formatPrice(item.price)}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                <button
                                                                    className="btn btn-outline-secondary btn-sm px-2"
                                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                >-</button>
                                                                <span className="mx-3 fw-bold">{item.quantity}</span>
                                                                <button
                                                                    className="btn btn-outline-secondary btn-sm px-2"
                                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                                    disabled={item.quantity >= item.stockQuantity}
                                                                >+</button>
                                                            </div>
                                                        </td>
                                                        <td className="text-end fw-bold">{formatPrice(item.price * item.quantity)}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => removeFromCart(item.productId)}
                                                                title="Xoa"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link to="/categories" className="btn btn-outline-success btn-sm">
                                            <i className="fas fa-arrow-left me-1"></i>Tiep tuc mua sam
                                        </Link>
                                        <div className="text-end">
                                            <span className="text-muted me-2">Tong cong:</span>
                                            <strong className="text-success fs-4">{formatPrice(getCartTotal())}</strong>
                                        </div>
                                    </div>
                                    {!showCheckout && (
                                        <button
                                            className="btn btn-success w-100 mt-3"
                                            onClick={() => setShowCheckout(true)}
                                        >
                                            <i className="fas fa-credit-card me-2"></i>Tien hanh dat hang
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {showCheckout && (
                            <div className="col-lg-5 mt-4 mt-lg-0">
                                <div className="card shadow-sm">
                                    <div className="card-header">
                                        <strong><i className="fas fa-file-invoice me-2"></i>Thong tin dat hang</strong>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Dia chi giao hang <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={checkoutData.shippingAddress}
                                                onChange={e => setCheckoutData({ ...checkoutData, shippingAddress: e.target.value })}
                                                placeholder="Nhap dia chi giao hang..."
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">So dien thoai <span className="text-danger">*</span></label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                value={checkoutData.phone}
                                                onChange={e => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                                                placeholder="Nhap so dien thoai..."
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Ghi chu</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={checkoutData.note}
                                                onChange={e => setCheckoutData({ ...checkoutData, note: e.target.value })}
                                                placeholder="Ghi chu cho don hang (tuy chon)..."
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Phuong thuc thanh toan</label>
                                            <select
                                                className="form-select"
                                                value={checkoutData.paymentMethod}
                                                onChange={e => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                                            >
                                                <option value="COD">Thanh toan khi nhan hang (COD)</option>
                                                <option value="BANK_TRANSFER">Chuyen khoan ngan hang</option>
                                            </select>
                                        </div>

                                        <hr />
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="fw-bold">Tong thanh toan:</span>
                                            <span className="text-success fw-bold fs-5">{formatPrice(getCartTotal())}</span>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-outline-secondary flex-fill"
                                                onClick={() => setShowCheckout(false)}
                                            >
                                                <i className="fas fa-arrow-left me-1"></i>Quay lai
                                            </button>
                                            <button
                                                className="btn btn-success flex-fill"
                                                onClick={handleCheckout}
                                                disabled={ordering}
                                            >
                                                {ordering ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                                        Dang xu ly...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-check me-1"></i>Xac nhan dat hang
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
