import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ProfileModal from './ProfileModal';
import OrderHistoryModal from './OrderHistoryModal';

const Navbar = () => {
    const location = useLocation();
    const { isAuthenticated, user, loading, logout } = useAuth();
    const { getCartCount, fetchCart } = useCart();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

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
                            <li className="nav-item"><NavLink className="nav-link" to="/" end>Trang chu</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/categories">San pham</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/about">Gioi thieu</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/contact">Lien he</NavLink></li>
                        </ul>
                        <div className="d-flex align-items-center">
                            {!isAuthenticated ? (
                                <div className="ms-auto">
                                    {location.pathname !== '/login' && (
                                        <Link to="/login" className="btn nav-btn btn-login me-2">Dang nhap</Link>
                                    )}
                                    {location.pathname !== '/register' && (
                                        <Link to="/register" className="btn nav-btn btn-register">Dang ky</Link>
                                    )}
                                </div>
                            ) : (
                                <div className="d-flex align-items-center ms-auto">
                                    <span className="me-2 navbar-text">Chao, {user?.userDetail?.fullName || user?.username}!</span>
                                    <div className="dropdown">
                                        <a href="/#" className="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            {user?.userDetail?.avatar ? (
                                                <img
                                                    src={`http://localhost:8080${user.userDetail.avatar}?v=${new Date().getTime()}`}
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
                                                    <i className="fas fa-user-edit me-2"></i>Thong tin tai khoan
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/#" className="dropdown-item" onClick={(e) => { e.preventDefault(); setShowOrderModal(true); }}>
                                                    <i className="fas fa-shopping-bag me-2"></i>Don hang cua toi
                                                </a>
                                            </li>
                                            {user?.role === 'ADMIN' && (
                                                <li>
                                                    <Link to="/admin/dashboard" className="dropdown-item">
                                                        <i className="fas fa-cogs me-2"></i>Quan tri
                                                    </Link>
                                                </li>
                                            )}
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <a href="/#" className="dropdown-item" onClick={handleLogout}>
                                                    <i className="fas fa-sign-out-alt me-2"></i>Dang xuat
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
                <>
                    <ProfileModal
                        show={showProfileModal}
                        handleClose={() => setShowProfileModal(false)}
                    />
                    <OrderHistoryModal
                        show={showOrderModal}
                        handleClose={() => setShowOrderModal(false)}
                    />
                </>
            )}
        </>
    );
};

export default Navbar;
