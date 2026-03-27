import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { API_BASE, formatPrice } from '../../utils/config';

const WishlistPage = () => {
    const { wishlistItems, removeFromWishlist, clearWishlist, fetchWishlist, loading } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const getCoverImageUrl = (path) => {
        if (!path) return 'https://placehold.co/300x400?text=Bonsai';
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

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '80px' }}>
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2 text-muted">Dang tai danh sach yeu thich...</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '80px' }}>
            <div className="bg-light py-2">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item"><Link to="/">Trang chu</Link></li>
                            <li className="breadcrumb-item active">Yeu thich</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">
                        <i className="fas fa-heart me-2 text-danger"></i>San pham yeu thich ({wishlistItems.length})
                    </h3>
                    {wishlistItems.length > 0 && (
                        <button className="btn btn-outline-danger btn-sm" onClick={clearWishlist}>
                            <i className="fas fa-trash me-1"></i>Xoa tat ca
                        </button>
                    )}
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-heart-broken fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Chua co san pham yeu thich nao.</p>
                        <Link to="/categories" className="btn btn-success">Kham pha san pham</Link>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                        {wishlistItems.map(item => (
                            <div key={item.id} className="col">
                                <div className="card h-100 shadow-sm">
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={getCoverImageUrl(item.productImage)}
                                            alt={item.productName}
                                            className="card-img-top"
                                            style={{ height: '220px', objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={() => navigate(`/product/${item.productId}`)}
                                        />
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleRemove(item.productId)}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Xoa khoi yeu thich"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                        {item.stockQuantity <= 0 && (
                                            <span className="badge bg-danger" style={{
                                                position: 'absolute', bottom: '10px', left: '10px'
                                            }}>Het hang</span>
                                        )}
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="card-title fw-bold"
                                            style={{ cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                            onClick={() => navigate(`/product/${item.productId}`)}>
                                            {item.productName}
                                        </h6>
                                        <p className="text-success fw-bold mb-3">{formatPrice(item.price)}</p>
                                        <div className="mt-auto d-flex gap-2">
                                            {item.stockQuantity > 0 ? (
                                                <button
                                                    className="btn btn-success btn-sm flex-fill"
                                                    onClick={() => handleAddToCart(item.productId)}
                                                >
                                                    <i className="fas fa-cart-plus me-1"></i>Them vao gio
                                                </button>
                                            ) : (
                                                <button className="btn btn-secondary btn-sm flex-fill" disabled>
                                                    Het hang
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => navigate(`/product/${item.productId}`)}
                                            >
                                                Chi tiet
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-footer text-muted small">
                                        <i className="fas fa-clock me-1"></i>Them luc: {item.createdAt}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
