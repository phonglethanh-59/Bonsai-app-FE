import React from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const AboutPage = () => {
    const aboutSectionRef = useScrollAnimation();
    const visionMissionRef = useScrollAnimation();
    const teamRef = useScrollAnimation();
    const timelineRef = useScrollAnimation();

    return (
        <div className="about-page">
            <section className="page-header">
                <video playsInline autoPlay muted loop id="header-video-bg" preload="metadata">
                    <source src="/videos/4.mp4" type="video/mp4" />
                </video>
                <div className="container">
                    <h1>Giới thiệu về Bonsai Shop</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Giới thiệu</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="about-section" ref={aboutSectionRef}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Về chúng tôi</h2>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4">
                            <div className="about-img">
                                <video playsInline autoPlay muted loop className="img-fluid">
                                    <source src="/videos/5.mp4" type="video/mp4" />
                                </video>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-card">
                                <h3>Bonsai Shop</h3>
                                <p>Bonsai Shop là hệ thống bán cây cảnh bonsai trực tuyến, chuyên cung cấp các loại bonsai chất lượng cao từ các nghệ nhân hàng đầu Việt Nam.</p>
                                <p>Được thành lập vào năm 2025, chúng tôi mang đến cho khách hàng bộ sưu tập bonsai đa dạng từ bonsai mini để bàn đến bonsai nghệ thuật cao cấp, phục vụ nhu cầu trang trí nội thất, quà tặng và phong thủy.</p>
                                <p>Với hơn 500 sản phẩm bonsai từ nhiều chủng loại khác nhau, Bonsai Shop tự hào là một trong những địa chỉ uy tín hàng đầu về cây cảnh bonsai tại Việt Nam.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="vision-mission" ref={visionMissionRef}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Tầm nhìn & Sứ mệnh</h2>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="vision-card text-center">
                                <div className="vision-icon">
                                    <i className="fas fa-eye"></i>
                                </div>
                                <h3>Tầm nhìn</h3>
                                <p>Trở thành nền tảng bán cây cảnh bonsai trực tuyến hàng đầu Việt Nam, kết nối nghệ nhân bonsai với những người yêu thích cây cảnh trên toàn quốc.</p>
                                <p>Chúng tôi hướng tới việc xây dựng cộng đồng yêu bonsai năng động, nơi mọi người có thể chia sẻ kiến thức, kinh nghiệm chăm sóc và nghệ thuật tạo hình bonsai.</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-4">
                            <div className="mission-card text-center">
                                <div className="mission-icon">
                                    <i className="fas fa-rocket"></i>
                                </div>
                                <h3>Sứ mệnh</h3>
                                <p>Mang thiên nhiên vào mỗi không gian sống thông qua những tác phẩm bonsai đẹp và chất lượng, đồng thời bảo tồn và phát triển nghệ thuật bonsai Việt Nam.</p>
                                <p>Cung cấp dịch vụ tư vấn chăm sóc chuyên nghiệp, giúp mỗi khách hàng có thể tự tin nuôi trồng và thưởng thức vẻ đẹp của bonsai.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="team-section" ref={teamRef}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Đội ngũ phát triển</h2>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-card h-100">
                                <div className="team-info">
                                    <h5>Tạ Ngọc Thanh</h5>
                                    <p>Nhóm trưởng</p>
                                    <div className="team-social">
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-card h-100">
                                <div className="team-info">
                                    <h5>Võ Đăng Khoa</h5>
                                    <p>Full-stack Developer</p>
                                    <div className="team-social">
                                        <a href="https://www.facebook.com/share/1E2s7JBpEZ/" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                                        <a href="https://github.com/KhoaVo-dgkv" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-card h-100">
                                <div className="team-info">
                                    <h5>Lê Thành Phong</h5>
                                    <p>UI/UX Designer</p>
                                    <div className="team-social">
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-behance"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-card h-100">
                                <div className="team-info">
                                    <h5>Trần Lê Kỳ</h5>
                                    <p>Diagram Analysis</p>
                                    <div className="team-social">
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                                        <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="timeline-section" ref={timelineRef}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Lịch sử phát triển</h2>
                    </div>
                    <div className="timeline">
                        <div className="timeline-item timeline-left">
                            <div className="timeline-content">
                                <div className="timeline-date">Tháng 1, 2025</div>
                                <h4 className="timeline-title">Khởi động dự án</h4>
                                <p>Dự án Bonsai Shop được khởi động với mục tiêu xây dựng nền tảng bán cây cảnh bonsai trực tuyến.</p>
                            </div>
                        </div>
                        <div className="timeline-item timeline-right">
                            <div className="timeline-content">
                                <div className="timeline-date">Tháng 3, 2025</div>
                                <h4 className="timeline-title">Thiết kế & Phát triển</h4>
                                <p>Giai đoạn thiết kế UI/UX và phát triển các tính năng cốt lõi của hệ thống.</p>
                            </div>
                        </div>
                        <div className="timeline-item timeline-left">
                            <div className="timeline-content">
                                <div className="timeline-date">Tháng 4, 2025</div>
                                <h4 className="timeline-title">Thử nghiệm Beta</h4>
                                <p>Phiên bản beta được ra mắt với sự tham gia của nhóm khách hàng thử nghiệm.</p>
                            </div>
                        </div>
                        <div className="timeline-item timeline-right">
                            <div className="timeline-content">
                                <div className="timeline-date">Tháng 5, 2025</div>
                                <h4 className="timeline-title">Ra mắt chính thức</h4>
                                <p>Bonsai Shop chính thức đi vào hoạt động với đầy đủ tính năng mua sắm và tư vấn.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
