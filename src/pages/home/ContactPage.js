import React from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const ContactPage = () => {
    const formSection = useScrollAnimation();

    return (
        <div className="contact-page">
            <section className="page-header">
                <video playsInline autoPlay muted loop id="header-video-bg" preload="metadata">
                    <source src="/videos/6.mp4" type="video/mp4" />
                </video>
                <div className="container">
                    <h1>Liên hệ với chúng tôi</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Liên hệ</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="contact-form-section pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <div className="contact-form">
                                <h3 className="mb-4">Gửi tin nhắn cho chúng tôi</h3>
                                <form id="contactForm">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input type="text" className="form-control" name="fullName" placeholder="Họ và tên *" required />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="email" className="form-control" name="email" placeholder="Email *" required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input type="tel" className="form-control" name="phone" placeholder="Số điện thoại" />
                                        </div>
                                        <div className="col-md-6">
                                            <select className="form-control" name="subject" required defaultValue="">
                                                <option value="" disabled>Chọn chủ đề *</option>
                                                <option value="order">Vấn đề đơn hàng</option>
                                                <option value="product">Tư vấn sản phẩm</option>
                                                <option value="care">Hướng dẫn chăm sóc</option>
                                                <option value="warranty">Bảo hành / Đổi trả</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </div>
                                    </div>
                                    <textarea className="form-control" name="message" rows="5" placeholder="Nội dung tin nhắn *" required></textarea>
                                    <div className="form-check mb-3">
                                        <input className="form-check-input" type="checkbox" id="privacy" name="privacyPolicy" required />
                                        <label className="form-check-label" htmlFor="privacy">
                                            Tôi đồng ý với <a href="#">chính sách bảo mật</a> và cho phép lưu trữ thông tin.
                                        </label>
                                    </div>
                                    <button type="submit" className="btn contact-btn">Gửi tin nhắn</button>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="working-hours contact-info-box mb-4">
                                <div className="contact-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <h5>Giờ làm việc</h5>
                                <div className="d-flex justify-content-between">
                                    <span>Thứ Hai - Thứ Sáu:</span>
                                    <span>08:00 - 18:00</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Thứ Bảy:</span>
                                    <span>08:00 - 16:00</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Chủ Nhật:</span>
                                    <span>09:00 - 12:00</span>
                                </div>
                                <div className="mt-3">
                                    <span className="badge bg-warning text-dark">Lưu ý:</span> Thời gian phục vụ có thể thay đổi trong các dịp lễ, Tết.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="map-section py-5">
                <div className="container">
                    <h2 className="section-title text-center">Bản đồ vị trí</h2>
                    <div className="map-container">
                        <iframe className="map-frame" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6403.868262045655!2d106.69648656894687!3d10.785342940365043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529ac5fdea2b9%3A0xd593cd76b0f80708!2sVTI%20Academy!5e0!3m2!1svi!2s!4v1758480345108!5m2!1svi!2s" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map"></iframe>
                    </div>
                </div>
            </section>

            <section className="faq-section">
                <div className="container">
                    <h2 className="section-title text-center">Câu hỏi thường gặp</h2>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="accordion" id="faqAccordion">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Làm thế nào để đặt mua bonsai?
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Bạn chỉ cần đăng ký tài khoản, chọn sản phẩm yêu thích, thêm vào giỏ hàng và tiến hành đặt hàng. Chúng tôi sẽ liên hệ xác nhận và giao hàng đến tận nơi.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingTwo">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            Chính sách đổi trả như thế nào?
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu cây bị hư hỏng trong quá trình vận chuyển. Vui lòng chụp ảnh và liên hệ bộ phận hỗ trợ để được xử lý nhanh nhất.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingThree">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                            Giao hàng mất bao lâu?
                                        </button>
                                    </h2>
                                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Đơn hàng nội thành HCM giao trong 1-2 ngày. Các tỉnh khác từ 3-5 ngày làm việc. Cây được đóng gói cẩn thận đảm bảo an toàn trong quá trình vận chuyển.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingFour">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                            Có hướng dẫn chăm sóc bonsai không?
                                        </button>
                                    </h2>
                                    <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Có! Mỗi sản phẩm đều đi kèm hướng dẫn chăm sóc chi tiết. Ngoài ra, đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn qua hotline hoặc email.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingFive">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                            Có thể đặt bonsai theo yêu cầu không?
                                        </button>
                                    </h2>
                                    <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Chúng tôi nhận đặt bonsai theo yêu cầu về chủng loại, kích thước, kiểu dáng. Vui lòng liên hệ trực tiếp để được tư vấn và báo giá chi tiết.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
