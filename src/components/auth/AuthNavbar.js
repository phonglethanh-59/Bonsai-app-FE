import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const auth = useAuth();

    if (!auth) {
        return null;
    }

    const { isAuthenticated, user, logout } = auth;

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <i className="fas fa-leaf me-2"></i>Bonsai<span>Shop</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Trang chủ</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/categories">Sản phẩm</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/about">Giới thiệu</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/contact">Liên hệ</Link></li>
                    </ul>
                    <div className="d-flex align-items-center">
                        <div className="ms-auto">
                            {location.pathname !== '/login' && (
                                <Link to="/login" className="btn nav-btn btn-login me-2">Đăng nhập</Link>
                            )}
                            {location.pathname !== '/register' && (
                                <Link to="/register" className="btn nav-btn btn-register">Đăng ký</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
