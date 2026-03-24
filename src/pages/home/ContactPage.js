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
                    <h1>Lien he voi chung toi</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item"><a href="/">Trang chu</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Lien he</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="contact-form-section pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <div className="contact-form">
                                <h3 className="mb-4">Gui tin nhan cho chung toi</h3>
                                <form id="contactForm">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input type="text" className="form-control" name="fullName" placeholder="Ho va ten *" required />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="email" className="form-control" name="email" placeholder="Email *" required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input type="tel" className="form-control" name="phone" placeholder="So dien thoai" />
                                        </div>
                                        <div className="col-md-6">
                                            <select className="form-control" name="subject" required defaultValue="">
                                                <option value="" disabled>Chon chu de *</option>
                                                <option value="order">Van de don hang</option>
                                                <option value="product">Tu van san pham</option>
                                                <option value="care">Huong dan cham soc</option>
                                                <option value="warranty">Bao hanh / Doi tra</option>
                                                <option value="other">Khac</option>
                                            </select>
                                        </div>
                                    </div>
                                    <textarea className="form-control" name="message" rows="5" placeholder="Noi dung tin nhan *" required></textarea>
                                    <div className="form-check mb-3">
                                        <input className="form-check-input" type="checkbox" id="privacy" name="privacyPolicy" required />
                                        <label className="form-check-label" htmlFor="privacy">
                                            Toi dong y voi <a href="#">chinh sach bao mat</a> va cho phep luu tru thong tin.
                                        </label>
                                    </div>
                                    <button type="submit" className="btn contact-btn">Gui tin nhan</button>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="working-hours contact-info-box mb-4">
                                <div className="contact-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <h5>Gio lam viec</h5>
                                <div className="d-flex justify-content-between">
                                    <span>Thu Hai - Thu Sau:</span>
                                    <span>08:00 - 18:00</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Thu Bay:</span>
                                    <span>08:00 - 16:00</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Chu Nhat:</span>
                                    <span>09:00 - 12:00</span>
                                </div>
                                <div className="mt-3">
                                    <span className="badge bg-warning text-dark">Luu y:</span> Thoi gian phuc vu co the thay doi trong cac dip le, Tet.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="map-section py-5">
                <div className="container">
                    <h2 className="section-title text-center">Ban do vi tri</h2>
                    <div className="map-container">
                        <iframe className="map-frame" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6403.868262045655!2d106.69648656894687!3d10.785342940365043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529ac5fdea2b9%3A0xd593cd76b0f80708!2sVTI%20Academy!5e0!3m2!1svi!2s!4v1758480345108!5m2!1svi!2s" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map"></iframe>
                    </div>
                </div>
            </section>

            <section className="faq-section">
                <div className="container">
                    <h2 className="section-title text-center">Cau hoi thuong gap</h2>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="accordion" id="faqAccordion">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Lam the nao de dat mua bonsai?
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Ban chi can dang ky tai khoan, chon san pham yeu thich, them vao gio hang va tien hanh dat hang. Chung toi se lien he xac nhan va giao hang den tan noi.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingTwo">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            Chinh sach doi tra nhu the nao?
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Chung toi ho tro doi tra trong vong 7 ngay neu cay bi hu hong trong qua trinh van chuyen. Vui long chup anh va lien he bo phan ho tro de duoc xu ly nhanh nhat.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingThree">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                            Giao hang mat bao lau?
                                        </button>
                                    </h2>
                                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Don hang noi thanh HCM giao trong 1-2 ngay. Cac tinh khac tu 3-5 ngay lam viec. Cay duoc dong goi can than dam bao an toan trong qua trinh van chuyen.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingFour">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                            Co huong dan cham soc bonsai khong?
                                        </button>
                                    </h2>
                                    <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Co! Moi san pham deu di kem huong dan cham soc chi tiet. Ngoai ra, doi ngu chuyen gia cua chung toi luon san sang tu van qua hotline hoac email.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingFive">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                            Co the dat bonsai theo yeu cau khong?
                                        </button>
                                    </h2>
                                    <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Chung toi nhan dat bonsai theo yeu cau ve chung loai, kich thuoc, kieu dang. Vui long lien he truc tiep de duoc tu van va bao gia chi tiet.
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
