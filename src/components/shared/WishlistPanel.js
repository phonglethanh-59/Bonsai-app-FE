import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { API_BASE, formatPrice } from '../../utils/config';

const WishlistPanel = () => {
    const { wishlistItems, removeFromWishlist, clearWishlist, getWishlistCount, fetchWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        }
    }, [isAuthenticated, fetchWishlist]);

    const getCoverImageUrl = (path) => {
        if (!path) return 'https://placehold.co/40x60?text=Bonsai';
        if (path.startsWith('http')) return path;
        return `${API_BASE}${path}`;
    };

    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId, 1);
            alert('Da them vao gio hang!');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId);
        } catch (err) {
            alert(err.message);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className={`borrow-cart-container wishlist-container ${isOpen ? 'active' : ''}`}
             style={{ right: '70px' }}>
            <div
                className="borrow-cart-icon"
                onClick={() => setIsOpen(!isOpen)}
                title="Danh sach yeu thich"
                style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}
            >
                <i className="fas fa-heart fa-lg"></i>
                {getWishlistCount() > 0 && <span className="badge rounded-pill bg-danger">{getWishlistCount()}</span>}
            </div>

            <div className="borrow-cart-panel" id="wishlistPanel">
                <div className="cart-header">
                    <h6><i className="fas fa-heart me-2 text-danger"></i>Yeu thich ({getWishlistCount()} san pham)</h6>
                    <button className="btn-close btn-sm" onClick={() => setIsOpen(false)}></button>
                </div>
                <div className="cart-body">
                    {wishlistItems.length > 0 ? (
                        wishlistItems.map(item => (
                            <div key={item.id} className="cart-item d-flex align-items-center">
                                <img
                                    src={getCoverImageUrl(item.productImage)}
                                    alt={item.productName}
                                    style={{ width: '40px', height: '60px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div className="fw-bold small">{item.productName}</div>
                                    <div className="text-success small">{formatPrice(item.price)}</div>
                                    <div className="mt-1">
                                        {item.stockQuantity > 0 ? (
                                            <button
                                                className="btn btn-sm btn-outline-success px-2 py-0"
                                                onClick={() => handleAddToCart(item.productId)}
                                                title="Them vao gio hang"
                                            >
                                                <i className="fas fa-cart-plus"></i>
                                            </button>
                                        ) : (
                                            <span className="badge bg-secondary" style={{ fontSize: '0.65rem' }}>Het hang</span>
                                        )}
                                    </div>
                                </div>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.productId)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted p-3">Chua co san pham yeu thich nao.</p>
                    )}
                </div>
                <div className="cart-footer">
                    {wishlistItems.length > 0 && (
                        <button className="btn btn-outline-danger btn-sm w-100" onClick={clearWishlist}>
                            <i className="fas fa-trash me-1"></i>Xoa tat ca
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistPanel;
