import React from 'react';

const HomePage = () => {
    return (
        <>
            <section className="hero">
                <video playsInline autoPlay muted loop className="hero-video" preload="metadata">
                    <source src="/videos/1.mp4" type="video/mp4" />
                    Trinh duyet cua ban khong ho tro video.
                </video>
                <div className="hero-content">
                    <h1>Nghe thuat Bonsai - Tinh hoa thien nhien</h1>
                    <p>Kham pha bo suu tap bonsai doc dao, mang thien nhien vao khong gian song cua ban</p>
                </div>
                <div className="hero-actions">
                    <a href="/categories" className="btn btn-secondary hero-btn me-3">Mua ngay</a>
                    <a href="#features" className="btn btn-outline-light hero-btn">Tim hieu them</a>
                </div>
            </section>

            <div className="container">
                <section id="features" className="text-center py-5">
                    <h2 className="section-title">Tai sao chon chung toi?</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-leaf"></i>
                                </div>
                                <h5>Bonsai chat luong cao</h5>
                                <p>Moi cay bonsai deu duoc cham soc tu chuyen gia, dam bao suc khoe va tham my truoc khi den tay ban.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-truck"></i>
                                </div>
                                <h5>Giao hang tan noi</h5>
                                <p>Dong goi can than, giao hang nhanh chong tren toan quoc. Dam bao cay den tay ban trong tinh trang tot nhat.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-headset"></i>
                                </div>
                                <h5>Tu van cham soc</h5>
                                <p>Doi ngu chuyen gia san sang ho tro tu van cach cham soc bonsai, giup cay phat trien manh khoe.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section className="roles-section">
                <div className="container">
                    <h2 className="section-title text-center">Dich vu cua chung toi</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="role-card">
                                <h5><i className="fas fa-seedling me-2"></i>Ban cay Bonsai</h5>
                                <ul>
                                    <li>Da dang chung loai bonsai trong va ngoai nuoc</li>
                                    <li>Tu bonsai mini den bonsai nghe thuat cao cap</li>
                                    <li>Cam ket nguon goc, chat luong ro rang</li>
                                    <li>Gia ca canh tranh, nhieu uu dai</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="role-card">
                                <h5><i className="fas fa-tools me-2"></i>Cham soc & Bao duong</h5>
                                <ul>
                                    <li>Dich vu cat tia, tao dang bonsai chuyen nghiep</li>
                                    <li>Tu van ky thuat cham soc tai nha</li>
                                    <li>Cung cap phan bon, dung cu chuyen dung</li>
                                    <li>Dich vu thay chau, thay dat dinh ky</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="role-card">
                                <h5><i className="fas fa-gift me-2"></i>Qua tang & Trang tri</h5>
                                <ul>
                                    <li>Bonsai lam qua tang y nghia cho moi dip</li>
                                    <li>Tu van bonsai phong thuy, hop menh</li>
                                    <li>Thiet ke tieu canh bonsai theo yeu cau</li>
                                    <li>Dich vu goi qua va gui tang</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="benefits-section py-5">
                <div className="container">
                    <h2 className="section-title text-center">Cam ket cua chung toi</h2>
                    <div className="row">
                        <div className="col-md-6 col-lg-3">
                            <div className="benefit-item">
                                <i className="fas fa-medal benefit-icon"></i>
                                Bonsai chinh hang, nguon goc ro rang
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="benefit-item">
                                <i className="fas fa-exchange-alt benefit-icon"></i>
                                Doi tra trong 7 ngay neu cay co van de
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="benefit-item">
                                <i className="fas fa-shipping-fast benefit-icon"></i>
                                Mien phi giao hang don tu 500K
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="benefit-item">
                                <i className="fas fa-phone-alt benefit-icon"></i>
                                Ho tro tu van 24/7
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section text-center">
                <div className="container">
                    <div className="cta-content">
                        <h3>San sang so huu cay bonsai dau tien?</h3>
                        <p className="mb-4">Dang ky tai khoan ngay de nhan uu dai giam 10% cho don hang dau tien</p>
                        <a href="/register" className="btn cta-btn">Dang ky ngay</a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
