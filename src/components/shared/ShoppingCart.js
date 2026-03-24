import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const API_BASE = 'http://localhost:8080';

const ShoppingCart = () => {
    const { cartItems, removeFromCart, updateCartItem, clearCart, getCartTotal, getCartCount } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const { isAuthenticated } = useAuth();
    const [checkoutData, setCheckoutData] = useState({
        shippingAddress: '',
        phone: '',
        note: '',
        paymentMethod: 'COD'
    });
    const [ordering, setOrdering] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getCoverImageUrl = (path) => {
        if (!path) return 'https://placehold.co/40x60?text=Bonsai';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
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
            setIsOpen(false);
            setCheckoutData({ shippingAddress: '', phone: '', note: '', paymentMethod: 'COD' });
        } catch (error) {
            alert('Dat hang that bai: ' + (error.response?.data?.message || error.message));
        } finally {
            setOrdering(false);
        }
    };

    const handleQuantityChange = async (productId, newQty) => {
        if (newQty < 1) return;
        try {
            await updateCartItem(productId, newQty);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className={`borrow-cart-container ${isOpen ? 'active' : ''}`}>
            <div
                className="borrow-cart-icon"
                onClick={() => setIsOpen(!isOpen)}
                title="Gio hang"
            >
                <i className="fas fa-shopping-cart fa-lg"></i>
                {getCartCount() > 0 && <span className="badge rounded-pill bg-danger">{getCartCount()}</span>}
            </div>

            <div className="borrow-cart-panel" id="borrowCartPanel">
                <div className="cart-header">
                    <h6><i className="fas fa-shopping-cart me-2"></i>Gio hang ({getCartCount()} san pham)</h6>
                    <button className="btn-close btn-sm" onClick={() => setIsOpen(false)}></button>
                </div>
                <div className="cart-body" id="cartItemList">
                    {!showCheckout ? (
                        <>
                            {cartItems.length > 0 ? (
                                cartItems.map(item => (
                                    <div key={item.id} className="cart-item d-flex align-items-center">
                                        <img
                                            src={getCoverImageUrl(item.productImage)}
                                            alt={item.productName}
                                            style={{ width: '40px', height: '60px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div className="fw-bold small">{item.productName}</div>
                                            <div className="text-success small">{formatPrice(item.price)}</div>
                                            <div className="d-flex align-items-center mt-1">
                                                <button className="btn btn-sm btn-outline-secondary px-1 py-0"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
                                                <span className="mx-2 small">{item.quantity}</span>
                                                <button className="btn btn-sm btn-outline-secondary px-1 py-0"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.productId)}>x</button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted p-3">Gio hang cua ban dang trong.</p>
                            )}
                        </>
                    ) : (
                        <div className="p-2">
                            <div className="mb-2">
                                <label className="form-label small fw-bold">Dia chi giao hang *</label>
                                <input type="text" className="form-control form-control-sm"
                                    value={checkoutData.shippingAddress}
                                    onChange={e => setCheckoutData({ ...checkoutData, shippingAddress: e.target.value })}
                                    placeholder="Nhap dia chi..." />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-bold">So dien thoai *</label>
                                <input type="tel" className="form-control form-control-sm"
                                    value={checkoutData.phone}
                                    onChange={e => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                                    placeholder="Nhap SDT..." />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-bold">Ghi chu</label>
                                <textarea className="form-control form-control-sm" rows="2"
                                    value={checkoutData.note}
                                    onChange={e => setCheckoutData({ ...checkoutData, note: e.target.value })}
                                    placeholder="Ghi chu cho don hang..." />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-bold">Phuong thuc thanh toan</label>
                                <select className="form-select form-select-sm"
                                    value={checkoutData.paymentMethod}
                                    onChange={e => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}>
                                    <option value="COD">Thanh toan khi nhan hang (COD)</option>
                                    <option value="BANK_TRANSFER">Chuyen khoan ngan hang</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
                <div className="cart-footer">
                    {cartItems.length > 0 && (
                        <>
                            <div className="d-flex justify-content-between mb-2">
                                <strong>Tong cong:</strong>
                                <strong className="text-success">{formatPrice(getCartTotal())}</strong>
                            </div>
                            {!showCheckout ? (
                                <>
                                    <button className="btn btn-danger btn-sm me-2" onClick={clearCart}>Xoa tat ca</button>
                                    <button className="btn btn-success btn-sm w-100 mt-2" onClick={() => {
                                        if (!isAuthenticated) {
                                            alert('Vui long dang nhap de dat hang.');
                                            return;
                                        }
                                        setShowCheckout(true);
                                    }}>
                                        <i className="fas fa-shopping-bag me-1"></i>Dat hang
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => setShowCheckout(false)}>
                                        <i className="fas fa-arrow-left me-1"></i>Quay lai
                                    </button>
                                    <button className="btn btn-success btn-sm w-100 mt-2" onClick={handleCheckout} disabled={ordering}>
                                        {ordering ? 'Dang xu ly...' : 'Xac nhan dat hang'}
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
