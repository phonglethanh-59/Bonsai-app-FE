import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="row mb-5">
                    <div className="col-md-4">
                        <h4 className="footer-title">Bonsai Shop</h4>
                        <p>Chuyen cung cap cay canh bonsai chat luong cao, mang thien nhien vao khong gian song cua ban.</p>
                        <div className="social-links">
                            <a href="/#"><i className="fab fa-facebook-f"></i></a>
                            <a href="/#"><i className="fab fa-twitter"></i></a>
                            <a href="/#"><i className="fab fa-instagram"></i></a>
                            <a href="/#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <h4 className="footer-title">Lien ket</h4>
                        <ul className="footer-links">
                            <li><a href="/">Trang chu</a></li>
                            <li><a href="/categories">San pham</a></li>
                            <li><a href="/about">Gioi thieu</a></li>
                            <li><a href="/contact">Lien he</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h4 className="footer-title">Ho tro</h4>
                        <ul className="footer-links">
                            <li><a href="/#">Huong dan mua hang</a></li>
                            <li><a href="/#">Chinh sach doi tra</a></li>
                            <li><a href="/#">Chinh sach van chuyen</a></li>
                            <li><a href="/#">Dieu khoan dich vu</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h4 className="footer-title">Lien he</h4>
                        <p><i className="fas fa-map-marker-alt me-2"></i>VTI Academy, Quan 1, Ho Chi Minh</p>
                        <p><i className="fas fa-phone me-2"></i> (082) 3838 6686</p>
                        <p><i className="fas fa-envelope me-2"></i> info@bonsaishop.vn</p>
                    </div>
                </div>
                <div className="footer-bottom text-center">
                    <p>&copy; 2025 - Bonsai Shop | Do an Java Web - VTI</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
