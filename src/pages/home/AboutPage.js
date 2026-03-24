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
                    <h1>Gioi thieu ve Bonsai Shop</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a href="/">Trang chu</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Gioi thieu</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="about-section" ref={aboutSectionRef}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Ve chung toi</h2>
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
                                <p>Bonsai Shop la he thong ban cay canh bonsai truc tuyen, chuyen cung cap cac loai bonsai chat luong cao tu cac nghe nhan hang dau Viet Nam.</p>
                                <p>Duoc thanh lap vao nam 2025, chung toi mang den cho khach hang bo suu tap bonsai da dang tu bonsai mini de ban den bonsai nghe thuat cao cap, phuc vu nhu cau trang tri noi that, qua tang va phong thuy.</p>
                                <p>Voi hon 500 san pham bonsai tu nhieu chung loai khac nhau, Bonsai Shop tu hao la mot trong nhung dia chi uy tin hang dau ve cay canh bonsai tai Viet Nam.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="vision-mission" ref={visionMissionRef}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Tam nhin & Su menh</h2>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="vision-card text-center">
                                <div className="vision-icon">
                                    <i className="fas fa-eye"></i>
                                </div>
                                <h3>Tam nhin</h3>
                                <p>Tro thanh nen tang ban cay canh bonsai truc tuyen hang dau Viet Nam, ket noi nghe nhan bonsai voi nhung nguoi yeu thich cay canh tren toan quoc.</p>
                                <p>Chung toi huong toi viec xay dung cong dong yeu bonsai nang dong, noi moi nguoi co the chia se kien thuc, kinh nghiem cham soc va nghe thuat tao hinh bonsai.</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-4">
                            <div className="mission-card text-center">
                                <div className="mission-icon">
                                    <i className="fas fa-rocket"></i>
                                </div>
                                <h3>Su menh</h3>
                                <p>Mang thien nhien vao moi khong gian song thong qua nhung tac pham bonsai dep va chat luong, dong thoi bao ton va phat trien nghe thuat bonsai Viet Nam.</p>
                                <p>Cung cap dich vu tu van cham soc chuyen nghiep, giup moi khach hang co the tu tin nuoi trong va thuong thuc ve dep cua bonsai.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="team-section" ref={teamRef}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Doi ngu phat trien</h2>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 mb-4">
                            <div className="team-card h-100">
                                <div className="team-info">
                                    <h5>Ta Ngoc Thanh</h5>
                                    <p>Nhom truong</p>
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
                                    <h5>Vo Dang Khoa</h5>
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
                                    <h5>Le Thanh Phong</h5>
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
                                    <h5>Tran Le Ky</h5>
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
                        <h2 className="section-title">Lich su phat trien</h2>
                    </div>
                    <div className="timeline">
                        <div className="timeline-item timeline-left">
                            <div className="timeline-content">
                                <div className="timeline-date">Thang 1, 2025</div>
                                <h4 className="timeline-title">Khoi dong du an</h4>
                                <p>Du an Bonsai Shop duoc khoi dong voi muc tieu xay dung nen tang ban cay canh bonsai truc tuyen.</p>
                            </div>
                        </div>
                        <div className="timeline-item timeline-right">
                            <div className="timeline-content">
                                <div className="timeline-date">Thang 3, 2025</div>
                                <h4 className="timeline-title">Thiet ke & Phat trien</h4>
                                <p>Giai doan thiet ke UI/UX va phat trien cac tinh nang cot loi cua he thong.</p>
                            </div>
                        </div>
                        <div className="timeline-item timeline-left">
                            <div className="timeline-content">
                                <div className="timeline-date">Thang 4, 2025</div>
                                <h4 className="timeline-title">Thu nghiem Beta</h4>
                                <p>Phien ban beta duoc ra mat voi su tham gia cua nhom khach hang thu nghiem.</p>
                            </div>
                        </div>
                        <div className="timeline-item timeline-right">
                            <div className="timeline-content">
                                <div className="timeline-date">Thang 5, 2025</div>
                                <h4 className="timeline-title">Ra mat chinh thuc</h4>
                                <p>Bonsai Shop chinh thuc di vao hoat dong voi day du tinh nang mua sam va tu van.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
