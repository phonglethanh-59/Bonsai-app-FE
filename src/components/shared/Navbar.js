import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { API_BASE } from '../../utils/config';
import ProfileModal from './ProfileModal';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, loading, logout } = useAuth();
    const { getCartCount, fetchCart } = useCart();
    const { getWishlistCount, fetchWishlist } = useWishlist();
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
            fetchWishlist();
        }
    }, [isAuthenticated, fetchCart, fetchWishlist]);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    if (loading) {
        return (
            <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{ height: '76px' }}>
                <div className="container">
                    <Link to="/" className="navbar-brand"><i className="fas fa-leaf me-2"></i>Bonsai<span>Shop</span></Link>
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="container">
                    <Link to="/" className="navbar-brand"><i className="fas fa-leaf me-2"></i>Bonsai<span>Shop</span></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item"><NavLink className="nav-link" to="/" end>Trang chủ</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/categories">Sản phẩm</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/about">Giới thiệu</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/contact">Liên hệ</NavLink></li>
                        </ul>
                        <div className="d-flex align-items-center">
                            {!isAuthenticated ? (
                                <div className="ms-auto">
                                    {location.pathname !== '/login' && (
                                        <Link to="/login" className="btn nav-btn btn-login me-2">Đăng nhập</Link>
                                    )}
                                    {location.pathname !== '/register' && (
                                        <Link to="/register" className="btn nav-btn btn-register">Đăng ký</Link>
                                    )}
                                </div>
                            ) : (
                                <div className="d-flex align-items-center ms-auto">
                                    <span className="me-2 navbar-text">Chào, {user?.userDetail?.fullName || user?.username}!</span>
                                    <div className="dropdown">
                                        <a href="/#" className="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            {user?.userDetail?.avatar ? (
                                                <img
                                                    src={`${API_BASE}${user.userDetail.avatar}`}
                                                    alt="Avatar"
                                                    width="32"
                                                    height="32"
                                                    className="rounded-circle"
                                                />
                                            ) : (
                                                <i className="fas fa-user-circle fa-lg user-avatar-icon"></i>
                                            )}
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end text-small shadow">
                                            <li>
                                                <a href="/#" className="dropdown-item" onClick={(e) => { e.preventDefault(); setShowProfileModal(true); }}>
                                                    <i className="fas fa-user-edit me-2"></i>Thông tin tài khoản
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/#" className="dropdown-item" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>
                                                    <i className="fas fa-shopping-bag me-2"></i>Đơn hàng của tôi
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/#" className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); navigate('/wishlist'); }}>
                                                    <i className="fas fa-heart me-2 text-danger"></i>Yêu thích
                                                    {getWishlistCount() > 0 && (
                                                        <span className="badge bg-danger rounded-pill ms-auto">{getWishlistCount()}</span>
                                                    )}
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/#" className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); navigate('/cart'); }}>
                                                    <i className="fas fa-shopping-cart me-2 text-success"></i>Giỏ hàng
                                                    {getCartCount() > 0 && (
                                                        <span className="badge bg-success rounded-pill ms-auto">{getCartCount()}</span>
                                                    )}
                                                </a>
                                            </li>
                                            {user?.role === 'ADMIN' && (
                                                <li>
                                                    <Link to="/admin/dashboard" className="dropdown-item">
                                                        <i className="fas fa-cogs me-2"></i>Quản trị
                                                    </Link>
                                                </li>
                                            )}
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <a href="/#" className="dropdown-item" onClick={handleLogout}>
                                                    <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {isAuthenticated && (
                <ProfileModal
                    show={showProfileModal}
                    handleClose={() => setShowProfileModal(false)}
                />
            )}
        </>
    );
};

export default Navbar;
