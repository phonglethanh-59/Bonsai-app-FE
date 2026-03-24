// src/components/auth/NewAuthLayout.js
import React from 'react';
import { Link } from 'react-router-dom';

const NewAuthLayout = ({ children }) => {
    return (
        <div className="new-auth-layout">
            {/* Vùng nội dung chính */}
            <div className="auth-main-content">
                {/* Navbar */}
                <header className="auth-navbar">
                    <Link to="/" className="navbar-brand">
                        <i className="fas fa-book-open me-2"></i>Thư viện Số
                    </Link>
                    <Link to="/register" className="btn btn-register">Đăng ký</Link>
                </header>
                
                {/* Nội dung trang (Login, Register) sẽ được đưa vào đây */}
                <div className="auth-form-container">
                    {children}
                </div>

                {/* Footer */}
                <footer className="auth-footer"></footer>
            </div>
        </div>
    );
};

export default NewAuthLayout;