import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="row mb-5">
                    <div className="col-md-4">
                        <h4 className="footer-title">Bonsai Shop</h4>
                        <p>Chuyên cung cấp cây cảnh bonsai chất lượng cao, mang thiên nhiên vào không gian sống của bạn.</p>
                        <div className="social-links">
                            <a href="/#"><i className="fab fa-facebook-f"></i></a>
                            <a href="/#"><i className="fab fa-twitter"></i></a>
                            <a href="/#"><i className="fab fa-instagram"></i></a>
                            <a href="/#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <h4 className="footer-title">Liên kết</h4>
                        <ul className="footer-links">
                            <li><a href="/">Trang chủ</a></li>
                            <li><a href="/categories">Sản phẩm</a></li>
                            <li><a href="/about">Giới thiệu</a></li>
                            <li><a href="/contact">Liên hệ</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h4 className="footer-title">Hỗ trợ</h4>
                        <ul className="footer-links">
                            <li><a href="/#">Hướng dẫn mua hàng</a></li>
                            <li><a href="/#">Chính sách đổi trả</a></li>
                            <li><a href="/#">Chính sách vận chuyển</a></li>
                            <li><a href="/#">Điều khoản dịch vụ</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h4 className="footer-title">Liên hệ</h4>
                        <p><i className="fas fa-map-marker-alt me-2"></i>VTI Academy, Quận 1, Hồ Chí Minh</p>
                        <p><i className="fas fa-phone me-2"></i> (082) 3838 6686</p>
                        <p><i className="fas fa-envelope me-2"></i> info@bonsaishop.vn</p>
                    </div>
                </div>
                <div className="footer-bottom text-center">
                    <p>&copy; 2025 - Bonsai Shop | Đồ án Java Web - VTI</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
