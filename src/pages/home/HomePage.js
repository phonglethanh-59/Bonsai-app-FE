import React from 'react';

const HomePage = () => {
    return (
        <>
            <section className="hero">
                <video playsInline autoPlay muted loop className="hero-video" preload="metadata">
                    <source src="/videos/1.mp4" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
                <div className="hero-content">
                    <h1>Nghệ thuật Bonsai - Tinh hoa thiên nhiên</h1>
                    <p>Khám phá bộ sưu tập bonsai độc đáo, mang thiên nhiên vào không gian sống của bạn</p>
                </div>
                <div className="hero-actions">
                    <a href="/categories" className="btn btn-secondary hero-btn me-3">Mua ngay</a>
                    <a href="#features" className="btn btn-outline-light hero-btn">Tìm hiểu thêm</a>
                </div>
            </section>

            <div className="container">
                <section id="features" className="text-center py-5">
                    <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-leaf"></i>
                                </div>
                                <h5>Bonsai chất lượng cao</h5>
                                <p>Mỗi cây bonsai đều được chăm sóc từ chuyên gia, đảm bảo sức khỏe và thẩm mỹ trước khi đến tay bạn.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-truck"></i>
                                </div>
                                <h5>Giao hàng tận nơi</h5>
                                <p>Đóng gói cẩn thận, giao hàng nhanh chóng trên toàn quốc. Đảm bảo cây đến tay bạn trong tình trạng tốt nhất.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-headset"></i>
                                </div>
                                <h5>Tư vấn chăm sóc</h5>
                                <p>Đội ngũ chuyên gia sẵn sàng hỗ trợ tư vấn cách chăm sóc bonsai, giúp cây phát triển mạnh khỏe.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section className="roles-section">
                <div className="container">
                    <h2 className="section-title text-center">Dịch vụ của chúng tôi</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="role-card">
                                <h5><i className="fas fa-seedling me-2"></i>Bán cây Bonsai</h5>
                                <ul>
                                    <li>Đa dạng chủng loại bonsai trong và ngoài nước</li>
                                    <li>Từ bonsai mini đến bonsai nghệ thuật cao cấp</li>
                                    <li>Cam kết nguồn gốc, chất lượng rõ ràng</li>
                                    <li>Giá cả cạnh tranh, nhiều ưu đãi</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="role-card">
                                <h5><i className="fas fa-tools me-2"></i>Chăm sóc & Bảo dưỡng</h5>
                                <ul>
                                    <li>Dịch vụ cắt tỉa, tạo dáng bonsai chuyên nghiệp</li>
                                    <li>Tư vấn kỹ thuật chăm sóc tại nhà</li>
                                    <li>Cung cấp phân bón, dụng cụ chuyên dụng</li>
                                    <li>Dịch vụ thay chậu, thay đất định kỳ</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="role-card">
                                <h5><i className="fas fa-gift me-2"></i>Quà tặng & Trang trí</h5>
                                <ul>
                                    <li>Bonsai làm quà tặng ý nghĩa cho mọi dịp</li>
                                    <li>Tư vấn bonsai phong thủy, hợp mệnh</li>
                                    <li>Thiết kế tiểu cảnh bonsai theo yêu cầu</li>
                                    <li>Dịch vụ gói quà và gửi tặng</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="benefits-section py-5">
                <div className="container">
                    <h2 className="section-title text-center">Cam kết của chúng tôi</h2>
                    <div className="row">
                        <div className="col-md-6 col-lg-3">
                            <div className="benefit-item">
                                <i className="fas fa-medal benefit-icon"></i>
                                Bonsai chính hãng, nguồn gốc rõ ràng
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="benefit-item">
                                <i className="fas fa-exchange-alt benefit-icon"></i>
                                Đổi trả trong 7 ngày nếu cây có vấn đề
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="benefit-item">
                                <i className="fas fa-shipping-fast benefit-icon"></i>
                                Miễn phí giao hàng đơn từ 500K
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="benefit-item">
                                <i className="fas fa-phone-alt benefit-icon"></i>
                                Hỗ trợ tư vấn 24/7
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section text-center">
                <div className="container">
                    <div className="cta-content">
                        <h3>Sẵn sàng sở hữu cây bonsai đầu tiên?</h3>
                        <p className="mb-4">Đăng ký tài khoản ngay để nhận ưu đãi giảm 10% cho đơn hàng đầu tiên</p>
                        <a href="/register" className="btn cta-btn">Đăng ký ngay</a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
