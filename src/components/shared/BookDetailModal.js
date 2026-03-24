import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Row, Col, Spinner } from 'react-bootstrap';

// Component con để hiển thị một đánh giá
const ReviewItem = ({ review }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={`fas fa-star ${i < review.rating ? 'text-warning' : 'text-light'}`}></i>
    ));

    return (
        <div className="review-item mb-3">
            <strong>{review.reviewerName}</strong>
            <div className="d-flex justify-content-between">
                <div className="review-stars">{stars}</div>
                <small className="text-muted">{review.reviewDate}</small>
            </div>
            <p className="mb-0 fst-italic">"{review.comment}"</p>
        </div>
    );
};

const BookDetailModal = ({ show, handleClose, bookId }) => {
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show && bookId) {
            const fetchDetails = async () => {
                setLoading(true);
                setError('');
                try {
                    const [bookRes, reviewsRes] = await Promise.all([
                        axios.get(`http://localhost:8080/api/books/details/${bookId}`),
                        axios.get(`http://localhost:8080/api/reviews/book/${bookId}`)
                    ]);
                    setBook(bookRes.data);
                    setReviews(reviewsRes.data);
                } catch (err) {
                    setError('Không thể tải thông tin chi tiết của sách này.');
                    console.error("Lỗi khi tải chi tiết sách:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [show, bookId]);

    const getCoverImageUrl = (path) => {
        if (!path) return 'https://source.unsplash.com/500x650/?book,cover';
        if (path.startsWith('http')) return path;
        return `http://localhost:8080${path}`;
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{book?.title || 'Đang tải...'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
                {error && <div className="alert alert-danger">{error}</div>}
                
                {!loading && !error && book && (
                    <Row>
                        <Col md={4} className="text-center">
                            <img src={getCoverImageUrl(book.coverImage)} alt={book.title} className="img-fluid rounded shadow-sm mb-3" />
                        </Col>
                        <Col md={8}>
                            <p className="text-muted">Tác giả: <strong>{book.author || 'Chưa rõ'}</strong></p>
                            <hr />
                            <p style={{ whiteSpace: 'pre-wrap' }}>{book.description || 'Không có mô tả.'}</p>
                            <hr />
                            <Row>
                                <Col xs={6} className="mb-2"><strong>Danh mục:</strong> {book.category?.name || 'N/A'}</Col>
                                <Col xs={6} className="mb-2"><strong>Năm XB:</strong> {book.publicationYear || 'N/A'}</Col>
                                <Col xs={6} className="mb-2"><strong>Nhà XB:</strong> {book.publisher || 'N/A'}</Col>
                                <Col xs={6} className="mb-2"><strong>Còn lại:</strong> <span className="fw-bold text-success">{book.availableCopies}</span></Col>
                            </Row>
                            <hr />
                            <div className="reviews-section mt-3">
                                <h5><i className="fas fa-comments me-2"></i>Đánh giá từ độc giả</h5>
                                {reviews.length > 0 ? (
                                    reviews.map(review => <ReviewItem key={review.reviewDate} review={review} />)
                                ) : (
                                    <p className="text-muted small">Chưa có đánh giá nào cho cuốn sách này.</p>
                                )}
                            </div>
                        </Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                {book?.samplePdfUrl ? (
                    <a href={book.samplePdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                        <i className="fas fa-eye me-2"></i>Đọc thử
                    </a>
                ) : (
                    <Button variant="outline-secondary" disabled><i className="fas fa-eye-slash me-2"></i>Đọc thử</Button>
                )}
                <Button variant="secondary" onClick={handleClose}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BookDetailModal;